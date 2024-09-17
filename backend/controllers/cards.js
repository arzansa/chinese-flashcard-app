const express = require("express");
const verifyToken = require("../middleware/checkToken.js");
const Card = require("../models/card.js");
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const cards = await Card.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
