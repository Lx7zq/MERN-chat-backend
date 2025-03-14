const User = require("../models/user.model");
const { generateToken } = require("../lib/utils");
const bcrypt = require("bcrypt");
const cloudinary = require("../lib/cloudinary");
const { model } = require("mongoose");

exports.signup = async (req, res) => {
  const { email, fullname, password } = req.body; //rename ได้โดย  test : newTest
  console.log(email, fullname, password);

  if (!email || !fullname || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullname,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error); // เพิ่มการพิมพ์ข้อผิดพลาดลงในคอนโซล
    res
      .status(500)
      .json({ message: "Internal Server Error while registering a new user" });
  }
};
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email }); // ค้นหาผู้ใช้โดยอีเมล
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error while logging in" });
  }
};
exports.signout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json({ message: "Signout success" });
};
exports.uploadProfilePic = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res
        .status(500)
        .json({ message: "Error while updateing profile picture" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while uploading profile picture",
    });
  }
};

exports.checkAuth = async (req, res) => {
  //เพิ่มฟังก์ชันตรวจสอบการตรวจสอบ
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while checking authentication",
    });
  }
};
