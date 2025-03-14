const User = require("../models/user.model");

exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friendId :", friendId, "userId :", userId);

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "You can't add yourself as friend" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    console.log("user :", user, "friend :", friend);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    // Check if the user is already a friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if the user has already sent a friend request
    if (user.friendRequests.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(userId);
      user.friendRequests = user.friendRequests.filter(
        (id = friendId !== id.toString())
      );
      friend.friendRequests = friend.friendRequests.filter(
        (id = userId !== id.toString())
      );
      await user.save();
      await friend.save();
      return res.status(200).json({ message: "Friend request accepted" });
    }
    if (!friend.friendRequests.includes(userId)) {
      friend.friendRequests.push(userId);
      await friend.save();
    }
    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while adding friend" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friendId :", friendId, "userId :", userId);

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    console.log("user :", user, "friend :", friend);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    // Check if the user has received a friend request
    if (!user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: "No friend request found" });
    }
    user.friends.push(friendId);
    friend.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(
      (id = friendId !== id.toString())
    );
    friend.friendRequests = friend.friendRequests.filter(
      (id = userId !== id.toString())
    );
    await user.save();
    await friend.save();
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while accepting friend request",
    });
  }
};
