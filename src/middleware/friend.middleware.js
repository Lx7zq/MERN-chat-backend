const User = require("../models/user.model");

exports.checkFriendShip = async (req, res, next) => {
  const { id: friendId } = req.params;
  const userId = req.user._id;
  console.log("friendId :", friendId, "userId :", userId);

  try {
    const user = await User.findById(userId);
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "You are not friends" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while checking friendship" });
  }
};
