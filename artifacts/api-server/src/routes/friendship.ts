import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { Friendship } from "../models/Friendship";
import { Notification } from "../models/Notification";
import { verifytoken } from "../middlewares/verifytoken";
import mongoose from "mongoose";
import { createLog } from "../models/Log";

const router = Router();

const checkisfriend = async (myid: string, userid: string) => {
  return await Friendship.findOne({
    $or: [{ requester: myid, receiver: userid }, { requester: userid, receiver: myid }],
    status: "accepted",
  });
};

const checkfriendship = async (myid: string, userid: string) => {
  const f = await Friendship.findOne({
    $or: [{ requester: myid, receiver: userid }, { requester: userid, receiver: myid }],
    status: { $in: ["accepted", "pending", "blocked"] },
  });
  return !!f;
};

const isincomingrequest = async (myid: string, userid: string) => {
  const f = await Friendship.findOne({ requester: userid, receiver: myid, status: "pending" });
  return !!f;
};

const isoutgoingrequest = async (myid: string, userid: string) => {
  const f = await Friendship.findOne({ requester: myid, receiver: userid, status: "pending" });
  return !!f;
};

const isblocked = async (myid: string, userid: string) => {
  const f = await Friendship.findOne({ requester: myid, receiver: userid, status: "blocked" });
  return !!f;
};

router.get("/nonfriendsusers", verifytoken, async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findById((req as any).user.id);
    if (!currentUser) { res.status(404).json({ message: "No User With That id Found" }); return; }
    const usersExceptMe = await User.find({ _id: { $ne: (req as any).user.id } });
    const filteredusers = [];
    for (const u of usersExceptMe) {
      const friendship = await checkfriendship((req as any).user.id, u._id.toString());
      if (!friendship) filteredusers.push(u);
    }
    res.status(200).json(filteredusers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/addfriend", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.receiver) { res.status(400).json({ message: "you must provide receiver id" }); return; }
    if ((req as any).user.id == req.body.receiver) { res.status(400).json({ message: "cannot add yourself" }); return; }
    const receiverUser = await User.findById(req.body.receiver);
    if (!receiverUser) { res.status(404).json({ message: "receiver user not found" }); return; }
    const existing = await Friendship.findOne({
      $or: [{ requester: (req as any).user.id, receiver: req.body.receiver }, { requester: req.body.receiver, receiver: (req as any).user.id }],
    });
    if (existing) {
      if (existing.status === "pending") { res.status(400).json({ message: "request already exists" }); return; }
      if (existing.status === "accepted") { res.status(400).json({ message: "already friends" }); return; }
      if (existing.status === "rejected") {
        existing.status = "pending";
        existing.requester = new mongoose.Types.ObjectId((req as any).user.id);
        existing.receiver = new mongoose.Types.ObjectId(req.body.receiver);
        await existing.save();
        res.status(200).json({ message: "friend request sent" }); return;
      }
      if (existing.status === "blocked") { res.status(400).json({ message: "cannot add, maybe blocked!" }); return; }
    }
    await Friendship.create({ requester: (req as any).user.id, receiver: req.body.receiver });
    const senderUser = await User.findById((req as any).user.id);
    await createLog((req as any).user.id, `You sent a friend request to ${receiverUser.username}`, "user", req.body.receiver);
    await createLog(req.body.receiver, `${senderUser?.username} sent you a friend request`, "user", (req as any).user.id);
    res.status(200).json({ message: "friend request sent successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/viewfriends", verifytoken, async (req: Request, res: Response) => {
  try {
    const usersexceptme = await User.find({ _id: { $ne: (req as any).user.id } });
    const friends = [];
    for (const u of usersexceptme) {
      const isfriend = await checkisfriend((req as any).user.id, u._id.toString());
      if (isfriend) friends.push(u);
    }
    res.status(200).json(friends);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/removefriend", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.friendid) { res.status(400).json({ message: "friend id haven't provided" }); return; }
    const user = await User.findById(req.body.friendid);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    await Friendship.deleteOne({
      $or: [{ requester: (req as any).user.id, receiver: req.body.friendid }, { requester: req.body.friendid, receiver: (req as any).user.id }],
      status: "accepted",
    });
    res.status(200).json({ message: "friend deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/blockuser", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.userid) { res.status(400).json({ message: "user id not provided in body" }); return; }
    if (req.body.userid == (req as any).user.id) { res.status(400).json({ message: "cannot block yourself" }); return; }
    const user = await User.findById(req.body.userid);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    const friendship = await Friendship.findOne({
      $or: [{ requester: (req as any).user.id, receiver: req.body.userid }, { requester: req.body.userid, receiver: (req as any).user.id }],
    });
    if (friendship) {
      friendship.requester = new mongoose.Types.ObjectId((req as any).user.id);
      friendship.receiver = new mongoose.Types.ObjectId(req.body.userid);
      friendship.status = "blocked";
      friendship.friendshipdate = null;
      await friendship.save();
      res.status(200).json({ message: "blocked successfully" }); return;
    }
    await Friendship.create({ requester: (req as any).user.id, receiver: req.body.userid, status: "blocked" });
    res.status(200).json({ message: "blocked successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/incomingrequests", verifytoken, async (req: Request, res: Response) => {
  try {
    const usersexceptme = await User.find({ _id: { $ne: (req as any).user.id } });
    const users = [];
    for (const u of usersexceptme) {
      if (await isincomingrequest((req as any).user.id, u._id.toString())) users.push(u);
    }
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/acceptuser", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.userid) { res.status(400).json({ message: "user id not provided in body" }); return; }
    const user = await User.findById(req.body.userid);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    const friendship = await Friendship.findOne({ requester: req.body.userid, receiver: (req as any).user.id, status: "pending" });
    if (friendship) {
      friendship.status = "accepted";
      friendship.friendshipdate = new Date();
      await friendship.save();
      const receiver = await User.findById(friendship.receiver);
      const requesterUser = await User.findById(req.body.userid);
      const notification = await Notification.create({
        type: "friend request accepted",
        message: `${receiver?.username} accepted your friend request`,
        receiver: req.body.userid,
      });
      const io = req.app.get("io");
      io.to(`${req.body.userid}`).emit("request_accepted", notification);
      await createLog(req.body.userid, `${receiver?.username} accepted your friend request`, "user", (req as any).user.id);
      await createLog((req as any).user.id, `You accepted ${requesterUser?.username}'s friend request`, "user", req.body.userid);
      res.status(200).json({ message: "friend request accepted" }); return;
    }
    res.status(404).json({ message: "there must be a request first" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/rejectuser", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.userid) { res.status(400).json({ message: "user id not provided in body" }); return; }
    const user = await User.findById(req.body.userid);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    const friendship = await Friendship.findOne({ requester: req.body.userid, receiver: (req as any).user.id, status: "pending" });
    if (friendship) {
      friendship.status = "rejected";
      friendship.friendshipdate = null;
      await friendship.save();
      res.status(200).json({ message: "friend request rejected" }); return;
    }
    res.status(404).json({ message: "there must be a request first" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/outgoingrequests", verifytoken, async (req: Request, res: Response) => {
  try {
    const usersexceptme = await User.find({ _id: { $ne: (req as any).user.id } });
    const users = [];
    for (const u of usersexceptme) {
      if (await isoutgoingrequest((req as any).user.id, u._id.toString())) users.push(u);
    }
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/undorequest", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.userid) { res.status(400).json({ message: "user id must be provided within body" }); return; }
    const friendship = await Friendship.findOne({ requester: (req as any).user.id, receiver: req.body.userid, status: "pending" });
    if (!friendship) { res.status(404).json({ message: "no request found" }); return; }
    await Friendship.findByIdAndDelete(friendship._id);
    res.status(200).json({ message: "deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/blockedusers", verifytoken, async (req: Request, res: Response) => {
  try {
    const usersexceptme = await User.find({ _id: { $ne: (req as any).user.id } });
    const users = [];
    for (const u of usersexceptme) {
      if (await isblocked((req as any).user.id, u._id.toString())) users.push(u);
    }
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/unblockuser", verifytoken, async (req: Request, res: Response) => {
  try {
    if (!req.body.userid) { res.status(400).json({ message: "user id must be provided within body" }); return; }
    const friendship = await Friendship.findOne({ requester: (req as any).user.id, receiver: req.body.userid, status: "blocked" });
    if (!friendship) { res.status(404).json({ message: "no block found" }); return; }
    await Friendship.findByIdAndDelete(friendship._id);
    res.status(200).json({ message: "blocked removed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/request", verifytoken, async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    if (!email) { res.status(400).json({ message: "email required" }); return; }
    const receiverUser = await User.findOne({ email });
    if (!receiverUser) { res.status(404).json({ message: "user not found" }); return; }
    const receiverId = receiverUser._id.toString();
    if ((req as any).user.id === receiverId) { res.status(400).json({ message: "cannot add yourself" }); return; }
    const existing = await Friendship.findOne({
      $or: [{ requester: (req as any).user.id, receiver: receiverId }, { requester: receiverId, receiver: (req as any).user.id }],
    });
    if (existing) {
      if (existing.status === "pending") { res.status(400).json({ message: "request already exists" }); return; }
      if (existing.status === "accepted") { res.status(400).json({ message: "already friends" }); return; }
      if (existing.status === "blocked") { res.status(400).json({ message: "cannot add, user is blocked" }); return; }
      existing.status = "pending";
      existing.requester = new mongoose.Types.ObjectId((req as any).user.id);
      existing.receiver = new mongoose.Types.ObjectId(receiverId);
      await existing.save();
      res.status(200).json({ message: "friend request sent" }); return;
    }
    await Friendship.create({ requester: (req as any).user.id, receiver: receiverId });
    res.status(201).json({ message: "friend request sent successfully" });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.get("/friends", verifytoken, async (req: Request, res: Response) => {
  try {
    const myid = (req as any).user.id;
    const friendships = await Friendship.find({
      $or: [{ requester: myid }, { receiver: myid }],
      status: "accepted",
    });
    const friendIds = friendships.map((f) =>
      f.requester.toString() === myid ? f.receiver : f.requester
    );
    if (friendIds.length === 0) { res.status(404).json({ message: "no friends" }); return; }
    const friends = await User.find({ _id: { $in: friendIds } });
    res.status(200).json(friends);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.delete("/unfriend/:friendid", verifytoken, async (req: Request, res: Response) => {
  try {
    await Friendship.deleteOne({
      $or: [{ requester: (req as any).user.id, receiver: req.params.friendid }, { requester: req.params.friendid, receiver: (req as any).user.id }],
      status: "accepted",
    });
    res.status(200).json({ message: "unfriended successfully" });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.put("/block/:userid", verifytoken, async (req: Request, res: Response) => {
  try {
    const friendship = await Friendship.findOne({
      $or: [{ requester: (req as any).user.id, receiver: req.params.userid }, { requester: req.params.userid, receiver: (req as any).user.id }],
    });
    if (friendship) {
      friendship.requester = new mongoose.Types.ObjectId((req as any).user.id);
      friendship.receiver = new mongoose.Types.ObjectId(req.params.userid as string);
      friendship.status = "blocked";
      friendship.friendshipdate = null;
      await friendship.save();
      res.status(200).json({ message: "blocked successfully" }); return;
    }
    await Friendship.create({ requester: (req as any).user.id, receiver: req.params.userid as string, status: "blocked" });
    res.status(200).json({ message: "blocked successfully" });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.put("/respond", verifytoken, async (req: Request, res: Response) => {
  try {
    const { requestid, action } = req.body;
    const friendship = await Friendship.findById(requestid);
    if (!friendship) { res.status(404).json({ message: "request not found" }); return; }
    if (action === "accept") {
      friendship.status = "accepted";
      friendship.friendshipdate = new Date();
      await friendship.save();
      const receiver = await User.findById(friendship.receiver);
      const notification = await Notification.create({
        type: "friend request accepted",
        message: `${receiver?.username} accepted your friend request`,
        receiver: friendship.requester,
      });
      const io = req.app.get("io");
      io.to(`${friendship.requester}`).emit("request_accepted", notification);
      res.status(200).json({ message: "friend request accepted" });
    } else {
      friendship.status = "rejected";
      friendship.friendshipdate = null;
      await friendship.save();
      res.status(200).json({ message: "friend request rejected" });
    }
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.get("/incomingrequests", verifytoken, async (req: Request, res: Response) => {
  try {
    const requests = await Friendship.find({ receiver: (req as any).user.id, status: "pending" }).populate("requester", "username email");
    if (requests.length === 0) { res.status(404).json({ message: "no incoming requests" }); return; }
    res.status(200).json(requests);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.get("/outgoingrequests", verifytoken, async (req: Request, res: Response) => {
  try {
    const requests = await Friendship.find({ requester: (req as any).user.id, status: "pending" }).populate("receiver", "username email");
    if (requests.length === 0) { res.status(404).json({ message: "no outgoing requests" }); return; }
    res.status(200).json(requests);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.delete("/cancelrequest/:requestid", verifytoken, async (req: Request, res: Response) => {
  try {
    await Friendship.findOneAndDelete({ _id: req.params.requestid, requester: (req as any).user.id, status: "pending" });
    res.status(200).json({ message: "request cancelled" });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.get("/blockedusers", verifytoken, async (req: Request, res: Response) => {
  try {
    const blocked = await Friendship.find({ requester: (req as any).user.id, status: "blocked" }).populate("receiver", "username email");
    if (blocked.length === 0) { res.status(404).json({ message: "no blocked users" }); return; }
    const users = blocked.map((f: any) => f.receiver);
    res.status(200).json(users);
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

router.put("/unblock/:userid", verifytoken, async (req: Request, res: Response) => {
  try {
    await Friendship.findOneAndDelete({ requester: (req as any).user.id, receiver: req.params.userid, status: "blocked" });
    res.status(200).json({ message: "unblocked successfully" });
  } catch (err: any) { res.status(500).json({ message: err.message }); }
});

export default router;
