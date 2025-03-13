const express = require("express");
const { getUserForSidebar } = require("../controllers/message.controller");
const { protectedRouter } = require("../middleware/auth.middleware");

const router = express.Router();

// Route to get all messages
router.get("/users", protectedRouter, getUserForSidebar);

module.exports = router;
