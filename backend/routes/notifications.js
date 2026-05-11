const express = require("express");
const mongoose = require("mongoose");
const verifytoken = require("../middlwares/verifytoken");
const usermodel = require("../models/User");
const taskmodel = require("../models/Task");
const projectmodel = require("../models/Project");
const notificationmodel = require("../models/Notification");
const router = express.Router();

router.get("/", verifytoken, async (req, res) => {
  const now = new Date();
  const after48hours = new Date();
  after48hours.setHours(now.getHours() + 48);
  try {
    const tasksexpireafter48hours = await taskmodel.find({
      $or: [
        {
          taskType: "personal",
          userId: req.user.id,
        },
        {
          taskType: "project",
          assignedTo: req.user.id,
        },
      ],
      dueDate: { $gte: now, $lte: after48hours },
      isDone: false,
    });
    for (const task of tasksexpireafter48hours) {
      const taskk = await notificationmodel.findOne({ taskid: task._id });
      if (!taskk) {
        let str = "";
        if (task.projectId) {
          const proj = await projectmodel.findById(task.projectId);
          str += `the task :${task.title} of project ${proj.name} will expire soon`;
        } else {
          str += `the personal task ${task.title} will expire soon `;
        }

        await notificationmodel.create({
          type: "task expiration",
          message: str,
          receiver: req.user.id,
          taskid: task._id,
        });
      }
    }

    const before48hours = new Date();
    before48hours.setHours(now.getHours() - 48);
    const notifications = await notificationmodel
      .find({
        receiver: req.user.id,
        createdAt: { $gte: before48hours },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/newtasksnotification", verifytoken, async (req, res) => {
  let newtasksnotify = [];
  const now = new Date();
  const after48hours = new Date();
  after48hours.setHours(now.getHours() + 48);
  try {
    const tasksexpireafter48hours = await taskmodel.find({
      $or: [
        {
          taskType: "personal",
          userId: req.user.id,
        },
        {
          taskType: "project",
          assignedTo: req.user.id,
        },
      ],
      dueDate: { $gte: now, $lte: after48hours },
      isDone: false,
    });
    for (const task of tasksexpireafter48hours) {
      const taskk = await notificationmodel.findOne({ taskid: task._id });
      if (!taskk) {
        let str = "";
        if (task.projectId) {
          const proj = await projectmodel.findById(task.projectId);
          str += `the task :${task.title} of project ${proj.name} will expire soon`;
        } else {
          str += `the personal task ${task.title} will expire soon `;
        }

        const newtasknotifyy = await notificationmodel.create({
          type: "task expiration",
          message: str,
          receiver: req.user.id,
          taskid: task._id,
        });
        newtasksnotify.push(newtasknotifyy);
      }
    }

    return res.status(200).json(newtasksnotify);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/markread/:notificationid", verifytoken, async (req, res) => {
  try {
    const notification = await notificationmodel.findOneAndUpdate(
      {
        _id: req.params.notificationid,
        receiver: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({ message: "notification not found" });
    }

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = router;
