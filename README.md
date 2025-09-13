# 🗳️ Real-Time Polling Backend

A simple real-time polling backend built with **Node.js**, **Express**, **MongoDB**, and **WebSockets (socket.io)**.  
Users can create polls and vote in real-time. All connected clients viewing the poll will see live updates of the vote counts.

---

## 🚀 Tech Stack

- **Node.js** – Backend runtime
- **Express.js** – HTTP server framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **Socket.IO** – Real-time bidirectional communication
- **dotenv** – Environment variable management

---

## 📂 Project Structure

├── server.js # Entry point for the app (Express + Socket.IO server)
├── Models/ # Mongoose models (User, Poll, PollOption, Vote)
├── Router/ # Express routes for RESTful API endpoints
├── Controllers/ # Business logic for each entity
├── package.json
└── README.md

---

## ⚡ Features

1️⃣ **RESTful API**

- **User**: Create and retrieve users
- **Poll**: Create and retrieve polls with options
- **Vote**: Cast a vote for a poll option

2️⃣ **Real-Time Updates**

- When a vote is cast, all clients viewing that poll receive **instant live updates** of the current vote counts.

---

## 🔑 API Endpoints (Example)

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| POST   | `/users`          | Create a new user               |
| GET    | `/users`          | List all users                  |
| POST   | `/polls`          | Create a poll with options      |
| GET    | `/polls`          | Get all polls                   |
| GET    | `/polls/:id`      | Get details of a single poll    |
| POST   | `/polls/:id/vote` | Vote for a specific poll option |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shivani-Chovatiya/RealTimeVoting

```
