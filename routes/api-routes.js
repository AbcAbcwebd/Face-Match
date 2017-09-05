const express = require("express");
const router = express.Router();

const db = require("../models");

// ADD API ROUTES HERE --------
router.get("/test", function(req, res) {
  console.log("Test route works");
});

// -----------------------------
module.exports = router;