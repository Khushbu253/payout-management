const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Payout = require("../models/Payout");
const PayoutAudit = require("../models/PayoutAudit");

// GET /payouts (with filters)
router.get("/", auth, async (req, res) => {
  try {
    const { status, vendor_id } = req.query;
    let query = {};
    if (status) query.status = status;
    if (vendor_id) query.vendor_id = vendor_id;

    const payouts = await Payout.find(query)
      .populate("vendor_id", "name")
      .populate("created_by", "email role")
      .sort({ createdAt: -1 });
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /payouts/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id)
      .populate("vendor_id", "name bank_account upi_id ifsc")
      .populate("created_by", "email role");

    if (!payout) return res.status(404).json({ message: "Payout not found" });

    const audits = await PayoutAudit.find({ payout_id: payout._id })
      .populate("user_id", "email role")
      .sort({ createdAt: -1 });

    res.json({ payout, audits });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /payouts
router.post("/", auth, role("OPS"), async (req, res) => {
  try {
    const { vendor_id, amount, mode, note } = req.body;

    if (!vendor_id || !amount || !mode) {
      return res
        .status(400)
        .json({ message: "vendor_id, amount, and mode are required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "amount must be > 0" });
    }
    const validModes = ["UPI", "IMPS", "NEFT"];
    if (!validModes.includes(mode)) {
      return res
        .status(400)
        .json({ message: "Invalid mode. Use UPI, IMPS, or NEFT." });
    }

    const payout = await Payout.create({
      vendor_id,
      amount,
      mode,
      note,
      status: "Draft",
      created_by: req.user.id,
    });

    await PayoutAudit.create({
      payout_id: payout._id,
      action: "CREATED",
      user_id: req.user.id,
    });

    res.status(201).json(payout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /payouts/:id/submit
router.post("/:id/submit", auth, role("OPS"), async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    if (payout.status !== "Draft") {
      return res
        .status(400)
        .json({
          message: "Invalid status transition. Can only submit from Draft.",
        });
    }

    payout.status = "Submitted";
    await payout.save();

    await PayoutAudit.create({
      payout_id: payout._id,
      action: "SUBMITTED",
      user_id: req.user.id,
    });

    res.json(payout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /payouts/:id/approve
router.post("/:id/approve", auth, role("FINANCE"), async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    if (payout.status !== "Submitted") {
      return res
        .status(400)
        .json({
          message: "Invalid transition. Can only approve from Submitted.",
        });
    }

    payout.status = "Approved";
    await payout.save();

    await PayoutAudit.create({
      payout_id: payout._id,
      action: "APPROVED",
      user_id: req.user.id,
    });

    res.json(payout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /payouts/:id/reject
router.post("/:id/reject", auth, role("FINANCE"), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Reason required for rejection" });
    }

    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    if (payout.status !== "Submitted") {
      return res
        .status(400)
        .json({
          message: "Invalid transition. Can only reject from Submitted.",
        });
    }

    payout.status = "Rejected";
    payout.decision_reason = reason;
    await payout.save();

    await PayoutAudit.create({
      payout_id: payout._id,
      action: "REJECTED",
      user_id: req.user.id,
    });

    res.json(payout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
