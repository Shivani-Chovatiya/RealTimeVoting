const Poll = require("../Models/Poll");
const Vote = require("../Models/Vote");

/* ---- Votes ---- */

const addVote = async (req, res) => {
  try {
    const { userId, optionId } = req.body;
    const pollId = req.params.pollId;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const option = poll.options.id(optionId);
    if (!option) return res.status(400).json({ error: "Invalid option" });

    const vote = await Vote.create({ user: userId, poll: pollId, optionId });

    option.votes.push(vote._id);
    await poll.save();

    // broadcast updated counts
    const updatedPoll = await Poll.findById(pollId).lean();
    const payload = updatedPoll.options.map((o) => ({
      id: o._id,
      text: o.text,
      votes: o.votes.length,
    }));
    const io = req.app.get("io");
    io.to(`poll_${pollId}`).emit("pollUpdated", { pollId, options: payload });

    res.status(201).json({ ok: true, voteId: vote._id, options: payload });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "User already voted on this poll" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
module.exports = { addVote };
