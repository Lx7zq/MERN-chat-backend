const express = require("express");
const {
  getUserForSidebar,
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");
const { protectedRouter } = require("../middleware/auth.middleware");
const { checkFriendShip } = require("../middleware/friend.middleware");

const router = express.Router();

// Route to get all messages
router.get("/users", protectedRouter, getUserForSidebar);
router.get("/messages", protectedRouter, getMessages);
router.post("/send/:id", protectedRouter, sendMessage);

module.exports = router;
