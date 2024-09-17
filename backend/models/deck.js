const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const deckSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: String,
      required: true,
    },
    rating: {
      type: Float,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    likes: {
      type: Integer,
      required: true,
    },
    dislikes: {
      type: Integer,
      required: true,
    },
    isPublic: {
        type: Boolean,
        required: true,
      },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Deck = mongoose.model("Deck", deckSchema);
module.exports = Deck;
