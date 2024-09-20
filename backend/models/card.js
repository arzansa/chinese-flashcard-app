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

const cardSchema = new mongoose.Schema(
  {
    english: {
      type: String,
      required: true,
    },
    chinese: {
      type: String,
      required: true,
    },
    pinyin: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      
      required: false,
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
