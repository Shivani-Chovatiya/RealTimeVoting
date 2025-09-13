/* ---- Polls ---- */

const Poll = require("../Models/Poll");

// app.post("/polls",
const addPolls = async (req, res) => {
  try {
    const { question, creatorId, options = [] } = req.body;
    const poll = await Poll.create({
      question,
      creator: creatorId,
      options: options.map((text) => ({ text })),
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// app.get("/polls",
const getAllPollData = async (req, res) => {
  const polls = await Poll.find().populate("creator", "name").lean();
  const result = polls.map((p) => ({
    ...p,
    options: p.options.map((opt) => ({
      id: opt._id,
      text: opt.text,
      votes: opt.votes.length,
    })),
  }));
  res.json(result);
};

// app.get("/polls/:id",
const getPollById = async (req, res) => {
  const poll = await Poll.findById(req.params.id)
    .populate("creator", "name")
    .lean();
  if (!poll) return res.status(404).json({ error: "Poll not found" });
  const result = {
    ...poll,
    options: poll.options.map((o) => ({
      id: o._id,
      text: o.text,
      votes: o.votes.length,
    })),
  };
  res.json(result);
};

// app.post("/polls/:id/options",
const addNewPollOption = async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: "Poll not found" });
  poll.options.push({ text: req.body.text });
  await poll.save();
  res.status(201).json(poll);
};
module.exports = { addPolls, getAllPollData, getPollById, addNewPollOption };
