import { Router, Request, Response } from "express";
import { Log } from "../models/Log";
import { User } from "../models/User";
import { verifytoken } from "../middlewares/verifytoken";

const router = Router();

router.get("/", verifytoken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    let logs;
    if (user?.role === "admin") {
      logs = await Log.find()
        .populate("receiver", "username")
        .populate("sender", "username")
        .sort({ createdAt: -1 });
    } else {
      logs = await Log.find({ receiver: (req as any).user.id })
        .populate("sender", "username")
        .sort({ createdAt: -1 });
    }
    if (logs.length === 0) { res.status(404).json({ message: "no logs found" }); return; }
    res.status(200).json(logs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
