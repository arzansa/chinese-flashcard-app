const express = require("express");
const router = express.Router();
const Deck = require("../models/deck");
const Card = require("../models/card");
const verifyToken = require("../middleware/checkToken");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");




router.get("/", async (req, res) => {
  try {
    const decks = await Deck.find()
      .populate({
        path: "cards",
        model: "Card",
      })
      .populate("creator");
    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/clone/:id", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const clonedDeck = new Deck({
      title: deck.title,
      text: deck.text,
      creator: req.user._id,
      cards: deck.cards,
      difficulty: deck.difficulty, 
      isPublic: false, 
    });

    await clonedDeck.save();
    res.status(201).json(clonedDeck);
  } catch (error) {
    console.error("Error cloning deck:", error); 
    res.status(500).json({ message: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id)
      .populate({
        path: "cards",
        model: "Card",
      })
      .populate("creator", "name");
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    
    if (deck.isPublic || (req.user && deck.creator.equals(req.user._id))) {
      res.status(200).json(deck);
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/:id/cards", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    console.log("Request payload:", req.body); 

    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    
    const cardData = {
      ...req.body,
      creator: req.user._id,
    };
    const newCard = await Card.create(cardData);

    
    deck.cards.push(newCard._id);
    await deck.save();

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error adding card to deck:", error); 
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id/cards/:cardId", verifyToken, ensureLoggedIn, async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    
    deck.cards.pull(req.params.cardId);
    await deck.save();

    
    await Card.findByIdAndDelete(req.params.cardId);

    res.status(200).json({ message: "Card removed from deck" });
  } catch (error) {
    console.error("Error removing card from deck:", error); 
    res.status(500).json({ message: error.message });
  }
});




router.use(verifyToken);
router.use(ensureLoggedIn);


router.post("/", async (req, res) => {
  try {
    const deckData = {
      ...req.body,
      creator: req.user._id,
    };
    const newDeck = await Deck.create(deckData);
    await newDeck.populate("creator");
    console.log("New deck created:", newDeck);
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id).populate("creator");
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    
    if (!deck.creator._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(deck, req.body);
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    
    if (!deck.creator.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Deck.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: "Deck deleted" });
  } catch (error) {
    console.error("Error deleting deck:", error); 
    res.status(500).json({ message: error.message });
  }
});


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


router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Deck not found" });

    const comment = deck.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    
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