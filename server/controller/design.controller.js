const services = require("../services/design.service.js");
const { sendResponse } = require("../utils/sendResponse.js");
const { SuccessMessage, ErrorMessage } = require("../constant/messages.js");
const { statusCode } = require("../constant/statusCodes.js");
const AdminSettings = require("../schema/adminSettingsSchema.js");
const { emitSettingUpdate } = require('../socket.js');

const { UserDesigns } = require('../model/designSchemas/UserDesignsSchema.js');
const { default: mongoose } = require("mongoose");


exports.sendEmailDesign = async (req, res) => {
    try {
        console.log("sendEmailDesign");
        const email = req.body.email;
        const frontSrc = req.body.frontSrc;
        const backSrc = req.body.backSrc;
        const designName = req.body.designName;
        if (!email) {
            return sendResponse(res, statusCode.BAD_REQUEST, false, ErrorMessage.EMAIL_REQUIRED);
        }
        const EmailSendSuccess = await services.sendEmailDesign(email, frontSrc, backSrc, designName);
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
            emitSettingUpdate(req.body);

            return sendResponse(res, statusCode.OK, true, "Settings updated");
        } else {
            await AdminSettings.create(req.body);
            emitSettingUpdate(req.body);
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

exports.saveDesignsFromFrontEnd = async (req, res) => {
   try {
    const { ownerEmail, design, designId } = req.body;
    ensureEmail(ownerEmail);

    if (!design && !designId) {
      return res.status(400).json({ message: 'Provide `design` for create or `designId` + `design` for update.' });
    }

    // If updating an existing design by ID
    if (designId) {
      if (!mongoose.isValidObjectId(designId)) {
        return res.status(400).json({ message: 'Invalid designId' });
      }

      // Try update existing design in-place
      const updateRes = await UserDesigns.updateOne(
        { ownerEmail, 'designs._id': designId },
        { $set: { 'designs.$': design } }
      );

      if (updateRes.matchedCount === 0) {
        // No existing design with this id for this user; push it as new with specified _id
        const toInsert = { ...design, _id: designId };
        await UserDesigns.updateOne(
          { ownerEmail },
          { $push: { designs: toInsert } },
          { upsert: true }
        );
      }

      const doc = await UserDesigns.findOne({ ownerEmail }).lean();
      return res.status(200).json({ message: 'Saved', userDesigns: doc });
    }

    // Creating a new design (no designId provided)
    // Let Mongo assign a new _id to the subdoc
    const result = await UserDesigns.findOneAndUpdate(
      { ownerEmail },
      { $push: { designs: design } },
      { upsert: true, new: true }
    ).lean();

    return res.status(201).json({ message: 'Created', userDesigns: result });
  } catch (err) {
   console.log(`Some Error Occured ${err}`)
  }
};


exports.getDesignsFromFrontEnd = async (req, res) => {
try {
    const { ownerEmail } = req.query;
    console.log("ownerEmail",ownerEmail)
    ensureEmail(ownerEmail);

    const doc = await UserDesigns.findOne({ ownerEmail }).lean();
    return res.status(200).json({ userDesigns: doc || { ownerEmail, designs: [] } });
  } catch (err) {
     console.log(`Some Error Occured ${err}`)
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