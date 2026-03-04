const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Vendor = require("./models/Vendor");
const Payout = require("./models/Payout");
const PayoutAudit = require("./models/PayoutAudit");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

(async () => {
  await User.deleteMany();
  await Vendor.deleteMany();
  await Payout.deleteMany();
  await PayoutAudit.deleteMany();

  await User.create([
    {
      email: "ops@demo.com",
      password: await bcrypt.hash("ops123", 10),
      role: "OPS",
    },
    {
      email: "finance@demo.com",
      password: await bcrypt.hash("fin123", 10),
      role: "FINANCE",
    },
  ]);

  await Vendor.create([
    {
      name: "Acme Corp",
      upi_id: "acmecorp@ybl",
      bank_account: "1234567890",
      ifsc: "HDFC0001234",
    },
    {
      name: "Tech Solutions",
      upi_id: "techsolutions@icici",
      bank_account: "0987654321",
      ifsc: "ICIC0005678",
    },
  ]);

  console.log("Seeded database with Users and Vendors.");
  process.exit();
})();
