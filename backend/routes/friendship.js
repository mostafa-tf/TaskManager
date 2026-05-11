const express = require("express");
const router = express.Router();
const verifytoken = require("../middlwares/verifytoken");
const usermodel = require("../models/User");
const friendshipmodel = require("../models/Friendship");
const notificationmodel = require("../models/Notification");

const checkisfriend = async (myid, userid) => {
  const isfriend = await friendshipmodel.findOne({
    $or: [
      { requester: myid, receiver: userid },
      { requester: userid, receiver: myid },
    ],
    status: "accepted",
  });
  return isfriend;
};
const checkfriendship = async (myid, userid) => {
  const friendship = await friendshipmodel.findOne({
    $or: [
      { requester: myid, receiver: userid },
      { requester: userid, receiver: myid },
    ],
    status: { $in: ["accepted", "pending", "blocked"] },
  });

  return !!friendship;
};

const isincomingrequest = async (myid, userid) => {
  const isrequest = await friendshipmodel.findOne({
    requester: userid,
    receiver: myid,
    status: "pending",
  });
  return isrequest ? true : false;
};
const isoutgoingrequest = async (myid, userid) => {
  const isrequest = await friendshipmodel.findOne({
    requester: myid,
    receiver: userid,
    status: "pending",
  });
  return isrequest ? true : false;
};
const isblocked = async (myid, userid) => {
  const friendship = await friendshipmodel.findOne({
    requester: myid,
    receiver: userid,
    status: "blocked",
  });
  return !!friendship;
};
router.get("/nonfriendsusers", verifytoken, async (req, res) => {
  try {
    const currentUser = await usermodel.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "No User With That id Found" });
    }

    const usersExceptMe = await usermodel.find({
      _id: { $ne: req.user.id },
    });

    const filteredusers = [];

    for (const otherUser of usersExceptMe) {
      const friendship = await checkfriendship(req.user.id, otherUser._id);

      if (!friendship) {
        filteredusers.push(otherUser);
      }
    }

    return res.status(200).json(filteredusers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/addfriend", verifytoken, async (req, res) => {
  try {
    if (!req.body.receiver) {
      return res.status(400).json({ message: "you must provide receiver id" });
    }

    if (req.user.id == req.body.receiver) {
      return res.status(400).json({ message: "cannot add yourself" });
    }

    const receiverUser = await usermodel.findById(req.body.receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: "receiver user not found" });
    }

    const isfriendshipexists = await friendshipmodel.findOne({
      $or: [
        { requester: req.user.id, receiver: req.body.receiver },
        { requester: req.body.receiver, receiver: req.user.id },
      ],
    });

    if (isfriendshipexists) {
      if (isfriendshipexists.status == "pending") {
        return res.status(400).json({ message: "request already exists" });
      }

      if (isfriendshipexists.status == "accepted") {
        return res.status(400).json({ message: "already friends" });
      }

      if (isfriendshipexists.status == "rejected") {
        isfriendshipexists.status = "pending";
        isfriendshipexists.requester = req.user.id;
        isfriendshipexists.receiver = req.body.receiver;

        await isfriendshipexists.save();
        return res.status(200).json({ message: "friend request sent" });
      }

      if (isfriendshipexists.status == "blocked") {
        return res.status(400).json({ message: "cannot add, maybe blocked!" });
      }
    }

    await friendshipmodel.create({
      requester: req.user.id,
      receiver: req.body.receiver,
    });

    return res
      .status(200)
      .json({ message: "friend request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/viewfriends", verifytoken, async (req, res) => {
  try {
    const usersexceptme = await usermodel.find({
      _id: { $ne: req.user.id },
    });
    let friends = [];

    for (const user of usersexceptme) {
      const isfriend = await checkisfriend(req.user.id, user._id);

      if (isfriend) {
        user.friendshipdate = isfriend.friendshipdate;
        friends.push(user);
      }
    }

    return res.status(200).json(friends);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/removefriend", verifytoken, async (req, res) => {
  try {
    if (!req.body.friendid) {
      return res.status(400).json({ message: "friend id haven't provided " });
    }
    const user = await usermodel.findById(req.body.friendid);

    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }

    await friendshipmodel.deleteOne({
      $or: [
        { requester: req.user.id, receiver: req.body.friendid },
        {
          requester: req.body.friendid,
          receiver: req.user.id,
        },
      ],
      status: "accepted",
    });
    res.status(200).json({ message: "friend deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/blockuser", verifytoken, async (req, res) => {
  try {
    if (!req.body.userid) {
      return res.status(400).json({ message: "user id not provided in body" });
    }
    if (req.body.userid == req.user.id) {
      return res.status(400).json({ message: "cannot block yourself" });
    }
    const user = await usermodel.findById(req.body.userid);
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    const friendship = await friendshipmodel.findOne({
      $or: [
        { requester: req.user.id, receiver: req.body.userid },
        {
          requester: req.body.userid,
          receiver: req.user.id,
        },
      ],
    });
    if (friendship) {
      friendship.requester = req.user.id;
      friendship.receiver = req.body.userid;
      friendship.status = "blocked";
      friendship.friendshipdate = null;
      await friendship.save();
      return res.status(200).json({ message: "blocked successfully" });
    }
    await friendshipmodel.create({
      requester: req.user.id,
      receiver: req.body.userid,
      status: "blocked",
    });
    return res.status(200).json({ message: "blocked successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/incomingrequests", verifytoken, async (req, res) => {
  try {
    const usersexceptme = await usermodel.find({ _id: { $ne: req.user.id } });

    const users = [];
    for (const user of usersexceptme) {
      const truth = await isincomingrequest(req.user.id, user._id);

      if (truth) {
        users.push(user);
      }
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/acceptuser", verifytoken, async (req, res) => {
  try {
    if (!req.body.userid) {
      return res.status(400).json({ message: "user id not provided in body" });
    }
    if (req.body.userid == req.user.id) {
      return res.status(400).json({ message: "cannot accept yourself" });
    }
    const user = await usermodel.findById(req.body.userid);
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    const friendship = await friendshipmodel.findOne({
      requester: req.body.userid,
      receiver: req.user.id,
      status: "pending",
    });
    if (friendship) {
      friendship.status = "accepted";
      friendship.friendshipdate = new Date();
      await friendship.save();
      const receiver = await usermodel.findById(friendship.receiver);

      const notification = await notificationmodel.create({
        type: "friend request accepted",
        message: `${receiver.username} accepted your friend request`,
        receiver: req.body.userid,
      });
      const io = req.app.get("io");
      io.to(`${req.body.userid}`).emit("request_accepted", notification);
      return res.status(200).json({ message: "friend request accepted" });
    }

    return res.status(404).json({ message: "there must be a request first " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/rejectuser", verifytoken, async (req, res) => {
  try {
    if (!req.body.userid) {
      return res.status(400).json({ message: "user id not provided in body" });
    }
    if (req.body.userid == req.user.id) {
      return res.status(400).json({ message: "cannot reject yourself" });
    }
    const user = await usermodel.findById(req.body.userid);
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    const friendship = await friendshipmodel.findOne({
      requester: req.body.userid,
      receiver: req.user.id,
      status: "pending",
    });
    if (friendship) {
      friendship.status = "rejected";
      friendship.friendshipdate = null;
      await friendship.save();
      return res.status(200).json({ message: "friend request rejected" });
    }

    return res.status(404).json({ message: "there must be a request first " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/outgoingrequests", verifytoken, async (req, res) => {
  try {
    const usersexceptme = await usermodel.find({ _id: { $ne: req.user.id } });

    const users = [];
    for (const user of usersexceptme) {
      const truth = await isoutgoingrequest(req.user.id, user._id);

      if (truth) {
        users.push(user);
      }
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.delete("/undorequest", verifytoken, async (req, res) => {
  try {
    if (!req.body.userid) {
      return res
        .status(400)
        .json({ message: "user id must be provided within body " });
    }
    const friendship = await friendshipmodel.findOne({
      requester: req.user.id,
      receiver: req.body.userid,
      status: "pending",
    });
    if (!friendship) {
      return res.status(404).json({ message: "no request found " });
    }
    await friendshipmodel.findByIdAndDelete(friendship._id);
    return res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/blockedusers", verifytoken, async (req, res) => {
  try {
    const usersexceptme = await usermodel.find({ _id: { $ne: req.user.id } });
    const users = [];
    for (const user of usersexceptme) {
      const truth = await isblocked(req.user.id, user._id);
      if (truth) {
        users.push(user);
      }
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.delete("/unblockuser", verifytoken, async (req, res) => {
  try {
    if (!req.body.userid) {
      return res
        .status(400)
        .json({ message: "user id must be provided within body " });
    }
    const friendship = await friendshipmodel.findOne({
      requester: req.user.id,
      receiver: req.body.userid,
      status: "blocked",
    });
    if (!friendship) {
      return res.status(404).json({ message: "no block found " });
    }
    await friendshipmodel.findByIdAndDelete(friendship._id);
    return res.status(200).json({ message: "blocked removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
