const Message = require("../models/message.model");
const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

exports.getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while getting user info" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }
    const senderId = req.user._id;
    const { text, image } = req.body;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }
    const newMessage = await new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });
    await newMessage.save();
    //real-time message sending
    const receiverSocketId = await getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while sending message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while getting messages" });
  }
};
