const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    optionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

// Ensure one vote per user per poll
voteSchema.index({ user: 1, poll: 1 }, { unique: true });

const Vote = new mongoose.model("Vote", voteSchema);
module.exports = Vote;
