const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    unique: true, 
    default: function() { return this.role === "student" ? uuidv4() : null; } 
  }, // Generate unique ID
  adminId: { 
    type: String, 
    unique: true, 
    default: function() { return this.role === "admin" ? uuidv4() : null; } 
  }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" }, // Default role: student
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

module.exports = mongoose.model("User", UserSchema);
