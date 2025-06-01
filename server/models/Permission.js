const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: String,
  role: { type: String, default: "student" },
  reason: String,
  letter: String,
  status: { type: String, enum: ["new", "approved", "rejected"], default: "new" },
  date: String,
  duration: String
});

module.exports = mongoose.model("Permission", permissionSchema);
