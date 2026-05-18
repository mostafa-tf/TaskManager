import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { verifytoken } from "../middlewares/verifytoken";
import { createLog } from "../models/Log";

const router = Router();

router.post("/", verifytoken, async (req: Request, res: Response) => {
  let contributers: string[] = req.body.contributers || [];
  if (req.body.memberEmail) {
    const mUser = await User.findOne({ email: req.body.memberEmail });
    if (mUser) contributers.push(mUser._id.toString());
  }
  contributers = [(req as any).user.id, ...contributers];
  const projmembers: any[] = [{ userId: (req as any).user.id, role: "owner" }];
  for (let i = 1; i < contributers.length; i++) {
    projmembers.push({ userId: contributers[i], role: "member" });
  }
  try {
    const project = await Project.create({ name: req.body.title || req.body.name, description: req.body.description, owner: (req as any).user.id, members: projmembers });
    const owner = await User.findById((req as any).user.id);
    const io = req.app.get("io");
    for (let i = 1; i < contributers.length; i++) {
      const notification = await Notification.create({ type: "assigned project", message: `${owner?.username} added you to project ${project.name}`, receiver: contributers[i] });
      io.to(`${contributers[i]}`).emit("project_invitation", notification);
    }
    res.status(201).json({ message: "project created" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifytoken, async (req: Request, res: Response) => {
  try {
    const userprojects = await Project.find({ $or: [{ owner: (req as any).user.id }, { "members.userId": (req as any).user.id }] });
    if (userprojects.length === 0) { res.status(404).json({ message: "no projects found" }); return; }
    res.status(200).json({ projects: userprojects, userid: (req as any).user.id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/assigntask", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || "low",
      userId: (req as any).user.id,
      assignedTo: req.body.assignedto,
      projectId: req.body.projectid,
      taskType: req.body.taskType,
    });
    const owner = await User.findById((req as any).user.id);
    const project = await Project.findById(req.body.projectid);
    const notification = await Notification.create({
      type: "assigned task",
      message: `${owner?.username} assigned you a task for project ${project?.name}`,
      receiver: req.body.assignedto,
    });
    const io = req.app.get("io");
    io.to(`${req.body.assignedto}`).emit("assigned_task", notification);
    await createLog(req.body.assignedto, `${owner?.username} assigned you task "${task.title}" in project "${project?.name}"`, "user", (req as any).user.id);
    await createLog((req as any).user.id, `You assigned task "${task.title}" to a member in project "${project?.name}"`, "user");
    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/projectinfo/:projectid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid).populate("members.userId", "username isActive");
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    const result = [];
    for (const member of project.members as any[]) {
      const user = member.userId;
      const tasks = await Task.find({ assignedTo: user._id, projectId: project._id, taskType: "project" });
      const stats = { todo: 0, inprogress: 0, done: 0 };
      tasks.forEach((t) => {
        if (t.status === "todo") stats.todo++;
        if (t.status === "inprogress") stats.inprogress++;
        if (t.status === "done") stats.done++;
      });
      result.push({ userId: user._id, username: user.username, isActive: user.isActive, totalTasks: tasks.length, ...stats });
    }
    res.status(200).json({ projectId: project._id, projectName: project.name, projectDescription: project.description, members: result });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/membertasks/:projectid/:memberid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid);
    const member = await User.findById(req.params.memberid);
    if (!project) { res.status(404).json({ message: "project with provided id not found" }); return; }
    if (!member) { res.status(404).json({ message: "member with provided id not found" }); return; }
    if (project.owner?.toString() !== (req as any).user.id) { res.status(403).json({ message: "access denied" }); return; }
    const [todotasks, inprogresstasks, donetasks] = await Promise.all([
      Task.find({ assignedTo: req.params.memberid, taskType: "project", projectId: req.params.projectid, status: "todo" }),
      Task.find({ assignedTo: req.params.memberid, taskType: "project", projectId: req.params.projectid, status: "inprogress" }),
      Task.find({ assignedTo: req.params.memberid, taskType: "project", projectId: req.params.projectid, status: "done" }),
    ]);
    res.status(200).json({ todo: todotasks, inprogress: inprogresstasks, done: donetasks });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/contributertasks/:projectid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    const isMember = (project.members as any[]).some((m) => m.userId.equals((req as any).user.id));
    if (!isMember) { res.status(403).json({ message: "access denied you must be a member of this project" }); return; }
    const [todotasks, inprogresstasks, donetasks] = await Promise.all([
      Task.find({ assignedTo: (req as any).user.id, taskType: "project", projectId: req.params.projectid, status: "todo" }),
      Task.find({ assignedTo: (req as any).user.id, taskType: "project", projectId: req.params.projectid, status: "inprogress" }),
      Task.find({ assignedTo: (req as any).user.id, taskType: "project", projectId: req.params.projectid, status: "done" }),
    ]);
    res.status(200).json({ todo: todotasks, inprogress: inprogresstasks, done: donetasks });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/updatetask/:taskid", verifytoken, async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.taskid);
    if (!task) { res.status(400).json({ message: "task not found" }); return; }
    if (!(task.assignedTo as mongoose.Types.ObjectId).equals((req as any).user.id)) { res.status(403).json({ message: "cannot update task /forbidden" }); return; }
    if (req.body.status === "done") { task.isDone = true; task.status = "done"; }
    else if (req.body.status === "inprogress") { task.isDone = false; task.status = "inprogress"; }
    else if (req.body.status === "todo") { task.isDone = false; task.status = "todo"; }
    await task.save();
    res.status(200).json({ message: "updated" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:projectid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid).populate("members.userId", "username email isActive");
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    const members = (project.members as any[]).map((m) => ({
      _id: m.userId._id,
      username: m.userId.username,
      email: m.userId.email,
      isActive: m.userId.isActive,
      role: m.role,
    }));
    res.status(200).json({ _id: project._id, title: (project as any).name, description: project.description, owner: project.owner, members });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:projectid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    if (project.owner?.toString() !== (req as any).user.id) { res.status(403).json({ message: "only owner can delete" }); return; }
    await Project.findByIdAndDelete(req.params.projectid);
    res.status(200).json({ message: "project deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:projectid/members", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    if (project.owner?.toString() !== (req as any).user.id) { res.status(403).json({ message: "only owner can add members" }); return; }
    let user;
    if (req.body.userId) {
      user = await User.findById(req.body.userId);
    } else if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    }
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    const alreadyMember = (project.members as any[]).some((m) => m.userId.toString() === user!._id.toString());
    if (alreadyMember) { res.status(400).json({ message: "user already a member" }); return; }
    (project.members as any[]).push({ userId: user._id, role: "member" });
    await project.save();
    const owner = await User.findById((req as any).user.id);
    const notification = await Notification.create({
      type: "assigned project",
      message: `${owner?.username} added you to project "${project.name}"`,
      receiver: user._id,
      sender: (req as any).user.id,
      projectid: project._id,
    });
    const io = req.app.get("io");
    io.to(`${user._id}`).emit("project_invitation", notification);
    res.status(200).json({ message: "member added" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:projectid/members/:memberid", verifytoken, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.projectid);
    if (!project) { res.status(404).json({ message: "project not found" }); return; }
    if (project.owner?.toString() !== (req as any).user.id) { res.status(403).json({ message: "only owner can remove members" }); return; }
    project.members = (project.members as any[]).filter((m) => m.userId.toString() !== req.params.memberid) as any;
    await project.save();
    res.status(200).json({ message: "member removed" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
