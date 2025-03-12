const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  uploadProfilePic,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put("/update-profile", uploadProfilePic);

module.exports = router;
