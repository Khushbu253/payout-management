const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    payout_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout",
    },
    action: {
      type: String,
      enum: ["CREATED", "SUBMITTED", "APPROVED", "REJECTED"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PayoutAudit", auditSchema);
