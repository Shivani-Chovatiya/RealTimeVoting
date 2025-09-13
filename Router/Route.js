const express = require("express");
const { addUsers } = require("../Controllers/User");
const { addVote } = require("../Controllers/Vote");
const {
  addPolls,
  getAllPollData,
  getPollById,
  addNewPollOption,
} = require("../Controllers/Poll");
const router = express.Router();

router.post("/users", addUsers);
router.post("/polls/:pollId/vote", addVote);

router.post("/polls", addPolls);
router.get("/polls", getAllPollData);
router.get("/polls/:id", getPollById);
router.post("/polls/:id/options", addNewPollOption);

module.exports = router;
