const services = require("../services/design.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const AdminSettings = require("../schema/adminSettingsSchema.js");
// const { emitSettingUpdate } = require('../socket.js');

const { UserDesigns } = require('../model/designSchemas/UserDesignsSchema.js');
const { default: mongoose } = require("mongoose");


exports.sendEmailDesign = async (req, res) => {
  try {
    console.log("sendEmailDesign ");

    const { email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link } = req.body;
    if (!email) {
      return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.EMAIL_REQUIRED);
    }
    const EmailSendSuccess = await services.sendEmailDesign(email, companyEmail, frontSrc, backSrc, designname, phoneNumber, edit_design_link, add_to_cart_link, unsubscribe_link);
    if (!EmailSendSuccess) {
      return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.ERROR_SENDING_MAIL);
    }
    return sendResponse(res, statusCode.OK, true, SuccessMessage.EMAIL_SEND_SUCCESS, EmailSendSuccess);
  } catch (error) {
    console.log(error)
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};


exports.saveSettings = async (req, res) => {
  try {

    const existing = await AdminSettings.findOne();
    if (existing) {
      await AdminSettings.updateOne({}, { $set: req.body });
      // emitSettingUpdate(req.body);

      return sendResponse(res, statusCode.OK, true, "Settings updated");
    } else {
      await AdminSettings.create(req.body);
      // emitSettingUpdate(req.body);
      return sendResponse(res, statusCode.OK, true, "Settings created");

    }
  } catch (error) {
    console.log(error)
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};


exports.getSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findOne();

    return sendResponse(res, statusCode.OK, true, SuccessMessage.DATA_FETCHED, settings || {});

  } catch (error) {
    console.log(error)
    return sendResponse(res, statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};



///////////////////////////////////////Design API's//////////////////////////////////////////////////////////////////////////////////////
function ensureEmail(email) {
  if (!email) {
    const err = new Error('ownerEmail is required');
    err.status = 400;
    throw err;
  }
}


function validateCreateBody(body) {
  const errors = [];
  if (!body?.ownerEmail) errors.push('ownerEmail is required');
  if (!body?.design) errors.push('design is required');
  const p = body?.design?.present;
  if (!p || !p.front || !p.back || !p.leftSleeve || !p.rightSleeve) {
    errors.push('design.present must include front/back/leftSleeve/rightSleeve');
  }
  return errors;
}

const pickDesignFields = (d = {}) => ({
  DesignName: d.DesignName ?? 'Untitled Design',
  present: d.present,
  FinalImages: d.FinalImages ?? [],
  DesignNotes: d.DesignNotes ?? null,
  NamesAndNumberPrintAreas: Array.isArray(d.NamesAndNumberPrintAreas) ? d.NamesAndNumberPrintAreas : [],
  status: d.status ?? 'draft',
  version: typeof d.version === 'number' ? d.version : 1,
});

exports.saveDesignsFromFrontEnd = async (req, res) => {
  try {

    const errors = validateCreateBody(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(', ') });

    const { ownerEmail, design } = req.body;
    
    const toPush = pickDesignFields(design);
    

    const doc = await UserDesigns.findOneAndUpdate(
      { ownerEmail },
      { $push: { designs: toPush } },
      { upsert: true, new: true, runValidators: true, projection: { designs: { $slice: -1 } } }
    ).lean();

    return res.status(201).json(doc.designs[0]); // {_id, DesignName, present, ...}
    // const fullDoc = await UserDesigns.findOne({ ownerEmail }).lean();
    // return res.status(200).json({ message: 'Saved', userDesigns: fullDoc });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Design name already exists for this user' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.updateDesignFromFrontEnd = async (req, res) => {
  try {
    const { ownerEmail, designId, design } = req.body;
    if (!ownerEmail || !designId || !design) {
      return res.status(400).json({ message: 'ownerEmail, designId and design are required' });
    }

    const _id = new mongoose.Types.ObjectId(designId);

    // 1) Read current subdoc to compute next version (only if present is being replaced)
    const currentDoc = await UserDesigns.findOne(
      { ownerEmail, 'designs._id': _id },
      { 'designs.$': 1 }
    );
    if (!currentDoc || !currentDoc.designs?.length) {
      return res.status(404).json({ message: 'Design not found for this user' });
    }

    const current = currentDoc.designs[0];
    const bumpVersion = Object.prototype.hasOwnProperty.call(design, 'present');
    const nextVersion = bumpVersion ? (current.version || 1) + 1 : (current.version || 1);

    // 2) Build the $set payload (this is what your code called setObj)
    const set = {};
    if ('DesignName' in design) set['designs.$.DesignName'] = design.DesignName;
    if ('present' in design) set['designs.$.present'] = design.present;
    if ('FinalImages' in design) set['designs.$.FinalImages'] = design.FinalImages;
    if ('DesignNotes' in design) set['designs.$.DesignNotes'] = design.DesignNotes;
    if ('NamesAndNumberPrintAreas' in design) set['designs.$.NamesAndNumberPrintAreas'] = design.NamesAndNumberPrintAreas;
    if ('status' in design) set['designs.$.status'] = design.status;
    if (bumpVersion) set['designs.$.version'] = nextVersion;

    // 3) Update (no positional projection here)
    await UserDesigns.updateOne(
      { ownerEmail, 'designs._id': _id },
      { $set: set },
      { runValidators: true }
    );

    // 4) Fetch only the updated subdoc (no positional projection, uses $elemMatch)
    const after = await UserDesigns.findOne(
      { ownerEmail },
      { designs: { $elemMatch: { _id } } }
    ).lean();

    if (!after?.designs?.length) {
      return res.status(500).json({ message: 'Updated but failed to re-read design' });
    }

    return res.json(after.designs[0]);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Design name already exists for this user' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.getDesignsFromFrontEndByEmail = async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    console.log("ownerEmail", ownerEmail)
    ensureEmail(ownerEmail);

    const doc = await UserDesigns.findOne({ ownerEmail }).lean();
    return res.status(200).json({ userDesigns: doc || { ownerEmail, designs: [] } });
  } catch (err) {
    console.log(`Some Error Occured ${err}`)
  }
};


exports.getDesignsFromFrontEndById = async (req, res) => {
  try {
    const { designId } = req.query;

    const doc = await UserDesigns.findOne(
      { "designs._id": designId },
      { "designs.$": 1, ownerEmail: 1 } // only return the matched design
    ).lean();

    return res.status(200).json({
      userDesigns: doc || { ownerEmail: "", designs: [] }
    });
  } catch (err) {
    console.log(`Some Error Occured ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// exports.getAllOrderedDesigns = async (req, res) => {
//   const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
//   const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
//   const skip = (page - 1) * limit;

//   try {
//     const [result] = await UserDesigns.aggregate([
//       {
//         $project: {
//           ownerEmail: 1,
//           updatedAt: 1,
//           orderedDesigns: {
//             $filter: {
//               input: { $ifNull: ["$designs", []] },
//               as: "d",
//               cond: { $eq: ["$$d.status", "ordered"] },
//             },
//           },
//         },
//       },
//       { $unwind: "$orderedDesigns" },
//       {
//         $group: {
//           _id: null,
//           designs: { $push: "$orderedDesigns" },
//           total: { $sum: 1 },
//         },
//       },
//       {
//         $project: {
//           total: 1,
//           designs: { $slice: ["$designs", skip, limit] },
//         },
//       },
//     ]).exec();

//     if (!result) {
//       return res.status(200).json({
//         ok: true,
//         data: { designs: [], page, limit, total: 0, totalPages: 0 },
//       });
//     }

//     const totalPages = result.total ? Math.ceil(result.total / limit) : 0;

//     return res.status(200).json({
//       ok: true,
//       data: {
//         designs: result.designs,
//         page,
//         limit,
//         total: result.total,
//         totalPages,
//       },
//     });
//   } catch (err) {
//     console.error("getAllOrderedDesigns error:", err);
//     return res.status(500).json({
//       ok: false,
//       error: "INTERNAL_ERROR",
//       message: "Failed to fetch ordered designs.",
//     });
//   }
// };
exports.getAllOrderedDesigns = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
  const skip = (page - 1) * limit;

  try {
    const [result] = await UserDesigns.aggregate([
      {
        // Build an array of ordered designs where each item includes the parent ownerEmail
        $project: {
          orderedDesigns: {
            $map: {
              input: {
                $filter: {
                  input: { $ifNull: ["$designs", []] },
                  as: "d",
                  cond: { $eq: ["$$d.status", "ordered"] },
                },
              },
              as: "d",
              in: {
                $mergeObjects: [
                  "$$d",
                  { ownerEmail: "$ownerEmail" } // <— inject ownerEmail into each design
                ],
              },
            },
          },
        },
      },
      { $unwind: "$orderedDesigns" },

      // (optional) sort designs here if you want consistent paging
      // { $sort: { "orderedDesigns.updatedAt": -1 } },

      {
        $group: {
          _id: null,
          designs: { $push: "$orderedDesigns" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          total: 1,
          designs: { $slice: ["$designs", skip, limit] },
        },
      },
    ]).exec();

    if (!result) {
      return res.status(200).json({
        ok: true,
        data: { designs: [], page, limit, total: 0, totalPages: 0 },
      });
    }

    const totalPages = result.total ? Math.ceil(result.total / limit) : 0;

    return res.status(200).json({
      ok: true,
      data: {
        designs: result.designs,     // each item now has ownerEmail
        page,
        limit,
        total: result.total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("getAllOrderedDesigns error:", err);
    return res.status(500).json({
      ok: false,
      error: "INTERNAL_ERROR",
      message: "Failed to fetch ordered designs.",
    });
  }
};

exports.getAllDesigns = async (req, res) => {
  // --- paging
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
  const skip = (page - 1) * limit;

  // --- filters
  const q = (req.query.q || '').trim();            // search name/email
  const statusQ = (req.query.status || '').trim();       // e.g. "ordered,in-progress" or "all"
  const fromStr = (req.query.from || '').trim();         // ISO date
  const toStr = (req.query.to || '').trim();           // ISO date

  // --- sorting (default: updatedAt desc, fallback to createdAt desc)
  // Accepts "-updatedAt" / "updatedAt" / "-createdAt" / "createdAt"
  const sortParam = (req.query.sort || '-updatedAt').trim();
  const sortField = sortParam.replace(/^-/, '');
  const sortDir = sortParam.startsWith('-') ? -1 : 1;
  const sort = {};
  if (['updatedAt', 'createdAt'].includes(sortField)) {
    sort[sortField] = sortDir;
  } else {
    sort['updatedAt'] = -1; // safe default
  }

  try {
    const pipeline = [
      // Pull designs array and keep ownerEmail; handle missing arrays safely
      { $project: { ownerEmail: 1, designs: { $ifNull: ['$designs', []] } } },
      { $unwind: '$designs' },

      // Flatten each design + inject ownerEmail at top level
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$designs', { ownerEmail: '$ownerEmail' }] }
        }
      },
    ];

    // --- status filter
    if (statusQ && statusQ.toLowerCase() !== 'all') {
      const statusList = statusQ
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      if (statusList.length) {
        pipeline.push({ $match: { status: { $in: statusList } } });
      }
    }

    // --- search (DesignName or ownerEmail)
    if (q) {
      pipeline.push({
        $match: {
          $or: [
            { DesignName: { $regex: q, $options: 'i' } },
            { ownerEmail: { $regex: q, $options: 'i' } },
          ],
        },
      });
    }

    // --- date range (by createdAt)
    const dateMatch = {};
    if (fromStr) {
      const d = new Date(fromStr);
      if (!isNaN(d)) dateMatch.$gte = d;
    }
    if (toStr) {
      // include entire end-day if user passed a date without time
      const d = new Date(toStr);
      if (!isNaN(d)) {
        // if time is 00:00, bump to end of day
        if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
          d.setHours(23, 59, 59, 999);
        }
        dateMatch.$lte = d;
      }
    }
    if (Object.keys(dateMatch).length) {
      pipeline.push({ $match: { createdAt: dateMatch } });
    }

    // --- sort/paginate + total count
    pipeline.push(
      { $sort: sort },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          meta: [{ $count: 'total' }],
        },
      }
    );

    const [agg = { data: [], meta: [] }] = await UserDesigns.aggregate(pipeline).allowDiskUse(true);

    const designs = agg.data || [];
    const total = (agg.meta && agg.meta[0] && agg.meta[0].total) ? agg.meta[0].total : 0;
    const totalPages = total ? Math.ceil(total / limit) : 0;

    return res.status(200).json({
      ok: true,
      data: { designs, page, limit, total, totalPages },
    });
  } catch (err) {
    console.error('getAllDesigns error:', err);
    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to fetch designs.',
    });
  }
};


exports.deleteDesignsFromFrontEnd = async (req, res) => {
  try {
    const { ownerEmail } = req.body; // or from auth token/session
    const { designId } = req.params;
    ensureEmail(ownerEmail);

    if (!mongoose.isValidObjectId(designId)) {
      return res.status(400).json({ message: 'Invalid designId' });
    }

    const result = await UserDesigns.findOneAndUpdate(
      { ownerEmail },
      { $pull: { designs: { _id: designId } } },
      { new: true }
    ).lean();

    return res.status(200).json({ message: 'Deleted', userDesigns: result });
  } catch (err) {
    console.log(`Some Error Occured ${err}`)
  }
};



