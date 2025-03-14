const express = require("express");
const { protectedRouter } = require("../middleware/auth.middleware");
const {
  addFriend,
  acceptFriendRequest,
} = require("../controllers/friend.controller");

const router = express.Router();
router.post("/add", protectedRouter, addFriend);
router.post("/accept", protectedRouter, acceptFriendRequest);

module.exports = router;
