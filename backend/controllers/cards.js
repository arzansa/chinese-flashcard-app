const express = require("express");
const router = express.Router();
const Card = require("../models/card");
const verifyToken = require("../middleware/checkToken");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");




router.get("/", async (req, res) => {
  try {
    const cards = await Card.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate("creator", "name")
      .populate("comments.author", "name");
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.use(verifyToken);
router.use(ensureLoggedIn);


router.post("/", async (req, res) => {
  try {
    const cardData = {
      ...req.body,
      creator: req.user._id,
    };
    const newCard = await Card.create(cardData);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    
    if (!card.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(card, req.body);
    await card.save();
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      console.error(`Card with ID ${req.params.id} not found`);
      return res.status(404).json({ message: "Card not found" });
    }

    
    if (!card.creator.equals(req.user._id)) {
      console.error(
        `User ${req.user._id} is not authorized to delete card ${req.params.id}`
      );
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Card.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Card deleted" });
  } catch (error) {
    console.error(`Error deleting card with ID ${req.params.id}:`, error); 
    res.status(500).json({ message: error.message });
  }
});


router.post("/:id/comments", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const comment = {
      text: req.body.text,
      author: req.user._id,
    };

    card.comments.push(comment);
    await card.save();
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const comment = card.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.remove();
    await card.save();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
