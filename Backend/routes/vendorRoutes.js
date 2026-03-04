const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const Vendor = require("../models/Vendor");

// Get all vendors
router.get("/", auth, async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a vendor
router.post("/", auth, role("OPS"), async (req, res) => {
  try {
    const { name, upi_id, bank_account, ifsc, is_active } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const vendor = await Vendor.create({
      name,
      upi_id,
      bank_account,
      ifsc,
      is_active: is_active !== undefined ? is_active : true,
    });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
