function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("✅ User is authenticated");
      return next();
    }
    console.log("Session Data:", req.session); // Check if session exists
    console.log("User Data:", req.user);
    console.log("🔍 req.user:",req.user)
    
    console.log("❌ User is NOT authenticated, redirecting to login...");
    // if (req.isAuthenticated() || (req.session.passport && req.session.passport.user)) {
    //     return next();
    // }
    
    // If it's an API request, send JSON instead of redirecting
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
  
    res.redirect("/login"); // Redirect for normal users
}
  
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === "admin") {
      return next();
    }
  
    // Handle unauthorized API access differently
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.status(403).json({ error: "Access Denied: Admins Only" });
    }
  
    res.status(403).send("Access Denied: Admins Only");
}
  
module.exports = { ensureAuth, ensureAdmin };
  