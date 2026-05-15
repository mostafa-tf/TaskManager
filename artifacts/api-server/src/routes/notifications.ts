import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { Notification } from "../models/Notification";
import { verifytoken } from "../middlewares/verifytoken";

const router = Router();

router.get("/", verifytoken, async (req: Request, res: Response) => {
  const now = new Date();
  const after48hours = new Date();
  after48hours.setHours(now.getHours() + 48);
  try {
    const tasksexpiring = await Task.find({
      $or: [{ taskType: "personal", userId: (req as any).user.id }, { taskType: "project", assignedTo: (req as any).user.id }],
      dueDate: { $gte: now, $lte: after48hours },
      isDone: false,
    });
    for (const task of tasksexpiring) {
      const existing = await Notification.findOne({ taskid: task._id });
      if (!existing) {
        let str = "";
        if (task.projectId) {
          const proj = await Project.findById(task.projectId);
          str = `the task :${task.title} of project ${proj?.name} will expire soon`;
        } else {
          str = `the personal task ${task.title} will expire soon`;
        }
        await Notification.create({ type: "task expiration", message: str, receiver: (req as any).user.id, taskid: task._id });
      }
    }
    const before48hours = new Date();
    before48hours.setHours(now.getHours() - 48);
    const notifications = await Notification.find({ receiver: (req as any).user.id, createdAt: { $gte: before48hours } }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/newtasksnotification", verifytoken, async (req: Request, res: Response) => {
  const newtasksnotify: any[] = [];
  const now = new Date();
  const after48hours = new Date();
  after48hours.setHours(now.getHours() + 48);
  try {
    const tasksexpiring = await Task.find({
      $or: [{ taskType: "personal", userId: (req as any).user.id }, { taskType: "project", assignedTo: (req as any).user.id }],
      dueDate: { $gte: now, $lte: after48hours },
      isDone: false,
    });
    for (const task of tasksexpiring) {
      const existing = await Notification.findOne({ taskid: task._id });
      if (!existing) {
        let str = "";
        if (task.projectId) {
          const proj = await Project.findById(task.projectId);
          str = `the task :${task.title} of project ${proj?.name} will expire soon`;
        } else {
          str = `the personal task ${task.title} will expire soon`;
        }
        const n = await Notification.create({ type: "task expiration", message: str, receiver: (req as any).user.id, taskid: task._id });
        newtasksnotify.push(n);
      }
    }
    res.status(200).json(newtasksnotify);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/markread/:notificationid", verifytoken, async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationid, receiver: (req as any).user.id },
      { isRead: true },
      { new: true },
    );
    if (!notification) { res.status(404).json({ message: "notification not found" }); return; }
    res.status(200).json(notification);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:notificationid/read", verifytoken, async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationid, receiver: (req as any).user.id },
      { isRead: true },
      { new: true },
    );
    if (!notification) { res.status(404).json({ message: "notification not found" }); return; }
    res.status(200).json(notification);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:notificationid", verifytoken, async (req: Request, res: Response) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.notificationid, receiver: (req as any).user.id });
    res.status(200).json({ message: "deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
