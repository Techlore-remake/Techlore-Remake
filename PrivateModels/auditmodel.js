const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(auditSchema = new Schema({
    operation: String,
    walltime: Date,
    clusterTime: mongoose.Schema.Types.Mixed,
    objcollection: String,
    documentKey: mongoose.Schema.Types.ObjectId,
    updatedFields: mongoose.Schema.Types.Mixed,
    deletedFields: mongoose.Schema.Types.Mixed,
    truncatedArrays: mongoose.Schema.Types.Mixed
})),
  (audits = mongoose.model("audits", auditSchema));

module.exports = audits;