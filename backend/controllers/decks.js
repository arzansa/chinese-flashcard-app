const express = require("express");
const router = express.Router();
const Deck = require("../models/deck");
const Card = require("../models/card");
const verifyToken = require("../middleware/checkToken");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// ========== Public Routes ===========

// GET /api/decks - Get all decks
router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find()
      .populate({
        path: "cards",
        model: "Card",
      })
      .populate("creator", "name");
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clone a deck
router.post("/clone/:id", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const clonedDeck = new Deck({
      title: deck.title,
      text: deck.text,
      creator: req.user._id,
      cards: deck.cards,
      difficulty: deck.difficulty, // Ensure difficulty is copied
      isPublic: false, // Cloned decks should be private by default
    });

    await clonedDeck.save();
    res.status(201).json(clonedDeck);
  } catch (error) {
    console.error("Error cloning deck:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
});

// GET /api/decks/:id - Get a specific deck
router.get("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
      .populate({
        path: "cards",
        model: "Card",
      })
      .populate("creator", "name");
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // If deck is public or user is the creator
    if (deck.isPublic || (req.user && deck.creator.equals(req.user._id))) {
      res.status(200).json(deck);
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/decks/:id/cards - Add a card to a deck
router.post("/:id/cards", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    console.log("Request payload:", req.body); // Log the request payload

    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // Check if the logged-in user is the creator
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Create the new card
    const cardData = {
      ...req.body,
      creator: req.user._id,
    };
    const newCard = await Card.create(cardData);

    // Add the card to the deck
    deck.cards.push(newCard._id);
    await deck.save();

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error adding card to deck:", error); // Log the error
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/decks/:id/cards/:cardId - Remove a card from a deck
router.delete("/:id/cards/:cardId", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // Check if the logged-in user is the creator
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove the card from the deck
    deck.cards.pull(req.params.cardId);
    await deck.save();

    // Delete the card
    await Card.findByIdAndDelete(req.params.cardId);

    res.status(200).json({ message: "Card removed from deck" });
  } catch (error) {
    console.error("Error removing card from deck:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
});

// ========= Protected Routes =========

// Middleware to check token and ensure user is logged in
router.use(verifyToken);
router.use(ensureLoggedIn);

// POST /api/decks - Create a new deck
router.post("/", async (req, res) => {
  try {
    const deckData = {
      ...req.body,
      creator: req.user._id,
    };
    const newDeck = await Deck.create(deckData);
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/decks/:id - Update a deck
router.put("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // Check if the logged-in user is the creator
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(deck, req.body);
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/decks/:id - Delete a deck
router.delete("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    // Check if the logged-in user is the creator
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Deck.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
    res.status(200).json({ message: "Deck deleted" });
  } catch (error) {
    console.error("Error deleting deck:", error); // Log the error
    res.status(500).json({ message: error.message });
  }
});

// POST /api/decks/:id/comments - Add a comment to a deck
router.post("/:id/comments", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const comment = {
      text: req.body.text,
      author: req.user._id,
    };

    deck.comments.push(comment);
    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/decks/:id/comments/:commentId - Delete a comment
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const comment = deck.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if the logged-in user is the comment author
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.remove();
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/decks/:id/like - Like a deck
router.put("/:id/like", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    deck.likes += 1;
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/decks/:id/dislike - Dislike a deck
router.put("/:id/dislike", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    deck.dislikes += 1;
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;