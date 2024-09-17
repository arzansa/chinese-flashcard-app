const express = require("express");
const verifyToken = require("../middleware/checkToken.js");
const Deck = require("../models/deck.js");
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
