const User = require("../models/User");
const nodemailer = require("nodemailer");
const passport = require("passport");

exports.signup = async (req, res) => {
  const { email, password, role = "student" } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.send("Email already registered.");

    const newUser = new User({ email, password, role });
    await newUser.save();

    // Determine which ID to send in the email
    const userId = newUser.role === "admin" ? newUser.adminId : newUser.studentId;
    const idType = newUser.role === "admin" ? "Admin ID" : "Student ID";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }, 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: `Your ${idType}`,
      text: `Hello! Your ${idType} is: ${userId}. Use it to log in.`,
    };

    await transporter.sendMail(mailOptions);

    res.send(`Signup successful! Check your email for your ${idType}.`);
  } catch (err) {
    res.status(500).send("Error registering user.");
  }
};

// Login Controller
exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (!user) return res.status(401).json({ error: "Invalid ID or password" });
  
      req.logIn(user, (err) => {
        if (err) return res.status(500).json({ error: "Login failed" });
        return res.json({ message: "Login successful", user });
      });
    })(req, res, next);
  };
  
  // Logout Controller
  exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      res.json({ message: "Logout successful" });
    });
  };