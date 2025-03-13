const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  uploadProfilePic,
  checkAuth,
} = require("../controllers/auth.controller");
const { protectedRouter } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/update-profile", protectedRouter, uploadProfilePic);
router.get("/check", protectedRouter, checkAuth);

module.exports = router;
