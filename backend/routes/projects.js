const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const verifytoken = require("../middlwares/verifytoken");
const projectmodel = require("../models/Project.js");
const taskmodel = require("../models/Task.js");
const usermodel = require("../models/User.js");
const notificationmodel = require("../models/Notification");
router.post("/", verifytoken, async (req, res) => {
  let contributers = req.body.contributers || [];

  contributers = [req.user.id, ...contributers];

  let projmembers = [];

  projmembers[0] = {
    userId: req.user.id,
    role: "owner",
  };

  for (let i = 1; i < contributers.length; i++) {
    projmembers[i] = {
      userId: contributers[i],
      role: "member",
    };
  }

  try {
    const project = await projectmodel.create({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
      members: projmembers,
    });

    const owner = await usermodel.findById(req.user.id);

    const io = req.app.get("io");

    for (let i = 1; i < contributers.length; i++) {
      const notification = await notificationmodel.create({
        type: "assigned project",
        message: `${owner.username} added you to project ${project.name}`,
        receiver: contributers[i],
      });

      io.to(`${contributers[i]}`).emit("project_invitation", notification);
    }

    return res.status(201).json({
      message: "project created",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", verifytoken, async (req, res) => {
  try {
    const userprojects = await projectmodel.find({
      $or: [{ owner: req.user.id }, { "members.userId": req.user.id }],
    });

    return res
      .status(200)
      .json({ projects: userprojects, userid: req.user.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/projectinfo/:projectid", verifytoken, async (req, res) => {
  try {
    const project = await projectmodel
      .findById(req.params.projectid)
      .populate("members.userId", "username isActive");

    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }

    // if (project.owner.toString() !== req.user.id) {
    //   return res.status(403).json({
    //     message: "permission denied you are not owner!",
    //   });
    // }

    const result = [];

    for (const member of project.members) {
      const user = member.userId;

      // count tasks
      const tasks = await taskmodel.find({
        assignedTo: user._id,
        projectId: project._id,
        taskType: "project",
      });

      const stats = {
        todo: 0,
        inprogress: 0,
        done: 0,
      };

      tasks.forEach((task) => {
        if (task.status === "todo") stats.todo++;
        if (task.status === "inprogress") stats.inprogress++;
        if (task.status === "done") stats.done++;
      });

      result.push({
        userId: user._id,
        username: user.username,
        isActive: user.isActive,
        totalTasks: tasks.length,
        ...stats,
      });
    }

    return res.status(200).json({
      projectId: project._id,
      projectName: project.name,
      projectDescription: project.description,
      members: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.post("/assigntask", verifytoken, async (req, res) => {
  try {
    const task = await taskmodel.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || "low",
      userId: req.user.id,
      assignedTo: req.body.assignedto,
      projectId: req.body.projectid,
      taskType: req.body.taskType,
    });
    const owner = await usermodel.findById(req.user.id);
    const project = await projectmodel.findById(req.body.projectid);
    const notification = await notificationmodel.create({
      type: "assigned task",
      message: `${owner.username} assigned you a  task for project ${project.name} `,
      receiver: req.body.assignedto,
    });
    const io = req.app.get("io");
    io.to(`${req.body.assignedto}`).emit("assigned_task", notification);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get(
  "/membertasks/:projectid/:memberid",
  verifytoken,
  async (req, res) => {
    try {
      const project = await projectmodel.findById(req.params.projectid);
      const member = await usermodel.findById(req.params.memberid);
      if (!project) {
        return res
          .status(404)
          .json({ message: "project with provided id not found " });
      }
      if (!member) {
        return res
          .status(404)
          .json({ message: "member with provided id not found " });
      }
      if (project.owner != req.user.id) {
        return res.status(403).json({ message: "access denied " });
      }
      const inprogresstasks = await taskmodel.find({
        assignedTo: req.params.memberid,
        taskType: "project",
        projectId: req.params.projectid,
        status: "inprogress",
      });
      const todotasks = await taskmodel.find({
        assignedTo: req.params.memberid,
        taskType: "project",
        projectId: req.params.projectid,
        status: "todo",
      });
      const donetasks = await taskmodel.find({
        assignedTo: req.params.memberid,
        taskType: "project",
        projectId: req.params.projectid,
        status: "done",
      });
      return res.status(200).json({
        todo: todotasks,
        inprogress: inprogresstasks,
        done: donetasks,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);
router.get("/contributertasks/:projectid", verifytoken, async (req, res) => {
  try {
    const contributer = await usermodel.findById(req.user.id);
    if (!contributer) {
      return res.status(404).json({ message: "user not found " });
    }
    const project = await projectmodel.findById(req.params.projectid);
    if (!project) {
      return res.status(404).json({ message: "project not found " });
    }

    const isMember = project.members.some((m) => m.userId.equals(req.user.id));
    if (!isMember) {
      return res.status(403).json({
        message: "access denied you must be a member of this project",
      });
    }
    const inprogresstasks = await taskmodel.find({
      assignedTo: req.user.id,
      taskType: "project",
      projectId: req.params.projectid,
      status: "inprogress",
    });
    const todotasks = await taskmodel.find({
      assignedTo: req.user.id,
      taskType: "project",
      projectId: req.params.projectid,
      status: "todo",
    });
    const donetasks = await taskmodel.find({
      assignedTo: req.user.id,
      taskType: "project",
      projectId: req.params.projectid,
      status: "done",
    });
    return res.status(200).json({
      todo: todotasks,
      inprogress: inprogresstasks,
      done: donetasks,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/updatetask/:taskid", verifytoken, async (req, res) => {
  try {
    let task = await taskmodel.findById(req.params.taskid);
    if (!task) {
      return res.status(400).json({ message: "task not found " });
    }
    if (!task.assignedTo.equals(req.user.id)) {
      return res.status(403).json({ message: "cannot update task /forbidden" });
    }
    if (req.body.status == "done") {
      task.isDone = true;
      task.status = "done";
    } else if (req.body.status == "inprogress") {
      task.isDone = false;
      task.status = "inprogress";
    } else if (req.body.status == "todo") {
      task.isDone = false;
      task.status = "todo";
    }
    await task.save();
    return res.status(200).json({ message: "updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
