const express = require("express");
const router = express.Router();

// Sample route to fetch books
router.get("/", (req, res) => {
  res.send("Books route is working!");
});

module.exports = router;