const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy({ usernameField: "userId", passwordField: "password" }, 
    async (userId, password, done) => { // Accepts both studentId and adminId
    try {
        console.log("Looking for user:", userId);
      // check for user by studentId or adminId  
      let user = await User.findOne({
        $or: [{ studentId: userId }, { adminId: userId }]
      })
      if (!user) return done(null, false, { message: "User not found" });

      console.log("User Found:", user);

      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect Password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("✅ User found in DB:", user);
    done(null, user);
  } catch (err) {
    console.error("❌ Error in deserializing user:", err);
    done(err);
  }
});

module.exports = passport;
