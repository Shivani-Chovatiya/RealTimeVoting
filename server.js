const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./Models/User");
const Poll = require("./Models/Poll");
const Vote = require("./Models/Vote");

const { Server: IOServer } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* ---------------- WebSocket ---------------- */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinPoll", (pollId) => socket.join(`poll_${pollId}`));
  socket.on("leavePoll", (pollId) => socket.leave(`poll_${pollId}`));

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ---------------- REST API ---------------- */

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

/* ---- Users ---- */
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---- Polls ---- */
app.post("/polls", async (req, res) => {
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
});

app.get("/polls", async (req, res) => {
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
});

app.get("/polls/:id", async (req, res) => {
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
});

app.post("/polls/:id/options", async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: "Poll not found" });
  poll.options.push({ text: req.body.text });
  await poll.save();
  res.status(201).json(poll);
});

/* ---- Votes ---- */
app.post("/polls/:pollId/vote", async (req, res) => {
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

    io.to(`poll_${pollId}`).emit("pollUpdated", { pollId, options: payload });

    res.status(201).json({ ok: true, voteId: vote._id, options: payload });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "User already voted on this poll" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

/* ---------------- Start ---------------- */
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/polling";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
