function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    
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
  