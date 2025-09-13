const mongoose = require("mongoose");

const pollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
});

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    options: [pollOptionSchema],
  },
  { timestamps: true }
);

const Poll = new mongoose.model("Poll", pollSchema);
module.exports = Poll;
