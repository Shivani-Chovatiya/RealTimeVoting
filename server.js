const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./Router/index");

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
app.set("io", io);

// Health
app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/", routes);
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
