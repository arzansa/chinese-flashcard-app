const express = require("express");
const router = express.Router();
const Deck = require("../models/deck");
const verifyToken = require("../middleware/checkToken");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

// ========== Public Routes ===========

// GET /api/decks - Get all public decks
router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find({ isPublic: true })
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/decks/:id - Get a specific deck
router.get("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
      .populate("cards")
      .populate("creator", "name")
      .populate("comments.author", "name");
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
router.post('/:id/cards', async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });

    // Check if the logged-in user is the creator
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' });
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
    res.status(400).json({ message: error.message });
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

    await deck.remove();
    res.status(200).json({ message: "Deck deleted" });
  } catch (error) {
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
