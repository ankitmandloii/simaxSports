// scripts/runCleanupNow.js
const mongoose = require('mongoose');
const { UserDesigns } = require('../model/designSchemas/UserDesignsSchema'); // adjust path as needed



exports.runCleanupNow = async ({ days = 30 } = {}) => {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const filter = { designs: { $elemMatch: { status: 'draft', createdAt: { $lt: cutoff } } } };

  const res = await UserDesigns.updateMany(
    filter,
    { $pull: { designs: { status: 'draft', createdAt: { $lt: cutoff } } } }
  );

  console.log(`[Cleanup] matched: ${res.matchedCount ?? res.n ?? 'n/a'}, modified: ${res.modifiedCount ?? res.nModified ?? 'n/a'}`);
};


