import { Router, Request, Response } from "express";
import { Task } from "../models/Task";
import { verifytoken } from "../middlewares/verifytoken";
import { validatenewtask } from "../joivalidate";
import { createLog } from "../models/Log";

const router = Router();

router.get("/done", verifytoken, async (req: Request, res: Response) => {
  try {
    const donetasks = await Task.find({ userId: (req as any).user.id, isDone: true, taskType: "personal" }).sort({ dueDate: 1 });
    if (donetasks.length === 0) { res.status(404).json({ message: "No Done Tasks Available" }); return; }
    res.status(200).json(donetasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/undone", verifytoken, async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ userId: (req as any).user.id, isDone: false, taskType: "personal" }).sort({ dueDate: 1 });
    if (tasks.length === 0) { res.status(404).json({ message: "No Done Tasks Available" }); return; }
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifytoken, async (req: Request, res: Response) => {
  try {
    const alltasks = await Task.find({ userId: (req as any).user.id, taskType: "personal" }).sort({ dueDate: 1 });
    if (alltasks.length === 0) { res.status(404).json({ message: "no tasks found" }); return; }
    res.status(200).json(alltasks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", verifytoken, async (req: Request, res: Response) => {
  const { error } = validatenewtask(req.body);
  if (error) { res.status(400).json({ message: error.details[0].message }); return; }
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || "low",
      userId: (req as any).user.id,
      starthour: req.body.starthour,
      endhour: req.body.endhour,
    });
    await createLog((req as any).user.id, `You added a new task: "${task.title}"`);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/updatetask/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const updatedtask = await Task.findByIdAndUpdate(req.params.taskid, { $set: req.body }, { new: true });
    if (!updatedtask) { res.status(404).json({ message: "task not found" }); return; }
    res.status(200).json({ message: "updated succesfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) { res.status(404).json({ message: "task not found" }); return; }
    if (task.userId?.toString() === (req as any).user.id) {
      await Task.findByIdAndUpdate(req.params.taskid, {
        completedAt: task.isDone ? null : new Date(),
        isDone: !task.isDone,
      });
      if (!task.isDone) {
        await createLog((req as any).user.id, `You completed task: "${task.title}"`);
      } else {
        await createLog((req as any).user.id, `You marked task "${task.title}" as pending`);
      }
      res.status(200).json({ message: "update sucessfully" });
    } else {
      res.status(403).json({ message: "Cannot Change Task Not Yours" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (task) {
      if (task.userId?.toString() === (req as any).user.id) {
        await createLog((req as any).user.id, `You deleted task: "${task.title}"`);
        await Task.findByIdAndDelete(req.params.taskid);
        res.status(200).json({ message: "deleted sucesfully" });
      } else {
        res.status(403).json({ message: "Cannot Delete Task Not Yours" });
      }
    } else {
      res.status(404).json({ message: "Task Not Found" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/singletask/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) { res.status(404).json({ message: "task not found" }); return; }
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/edittask/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) { res.status(404).json({ message: "task not found" }); return; }
    if (task.userId?.toString() !== (req as any).user.id) { res.status(403).json({ message: "Not allowed" }); return; }
    const updated = await Task.findByIdAndUpdate(req.params.taskid, { $set: req.body }, { new: true });
    res.status(200).json({ message: "updated successfully", task: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/analysis", verifytoken, async (req: Request, res: Response) => {
  try {
    const uid = (req as any).user.id;
    const total = await Task.countDocuments({ userId: uid, taskType: "personal" });
    const done = await Task.countDocuments({ userId: uid, isDone: true, taskType: "personal" });
    const undone = await Task.countDocuments({ userId: uid, isDone: false, taskType: "personal" });
    const now = new Date();
    const expired = await Task.countDocuments({ userId: uid, isDone: false, taskType: "personal", dueDate: { $lt: now.toISOString().slice(0, 10) } });
    res.status(200).json({ total, done, undone, expired });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/membertasks/:memberid", verifytoken, async (req: Request, res: Response) => {
  try {
    const { User } = await import("../models/User");
    const member = await User.findById(req.params.memberid);
    if (!member) { res.status(404).json({ message: "member not found" }); return; }
    const tasks = await Task.find({ userId: req.params.memberid, taskType: "personal" }).sort({ dueDate: 1 });
    if (tasks.length === 0) { res.status(404).json({ message: "no tasks" }); return; }
    res.status(200).json({ tasks, username: member.username });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) { res.status(404).json({ message: "task not found" }); return; }
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
