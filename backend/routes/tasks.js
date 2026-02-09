const express = require("express");
const router = express.Router();
const taskmodel = require("../models/Task.js");
const usermodel = require("../models/Task.js");
const verifytokenmiddleware = require("../middlwares/verifytoken.js");
const verifyadminmiddleware = require("../middlwares/verifyadmin.js");
const { validatenewtask } = require("../joivalidate.js");
router.get("/", verifytokenmiddleware, async (req, res) => {
  try {
    const alltasks = await taskmodel.find({ userId: req.user.id });
    if (alltasks.length == 0) {
      return res.status(404).json({ message: "no tasks found " });
    }
    res.status(200).json(alltasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/", verifytokenmiddleware, async (req, res) => {
  const { error } = validatenewtask(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const task = await taskmodel.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority || "low",
      userId: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.put("/:taskid", verifytokenmiddleware, async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id);

    const task = await taskmodel.findById(req.params.taskid);
    if (!task) {
      return res.status(404).json({ message: "task not found " });
    }
    if (task.userId == req.user.id) {
      await taskmodel.findByIdAndUpdate(req.params.taskid, {
        completedAt: task.isDone ? null : Date.now(),
        isDone: !task.isDone,
      });
      return res.status(200).json({ message: "update sucessfully " });
    } else {
      return res.status(403).json({ message: "Cannot Change Task Not Yours " });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/done", verifytokenmiddleware, async (req, res) => {
  try {
    const donetasks = await taskmodel.find({
      userId: req.user.id,
      isDone: true,
    });
    if (donetasks.length == 0) {
      return res.status(404).json({ message: "No Done Tasks Available" });
    }
    res.status(200).json(donetasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/undone", verifytokenmiddleware, async (req, res) => {
  try {
    const undonetasks = await taskmodel.find({
      userId: req.user.id,
      isDone: false,
    });
    if (undonetasks.length == 0) {
      return res.status(404).json({ message: "No Done Tasks Available" });
    }
    res.status(200).json(undonetasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:taskid", verifytokenmiddleware, async (req, res) => {
  const user = await usermodel.findById(req.user.id);
  try {
    const task = await taskmodel.findById(req.params.taskid);
    if (task) {
      if (task.userId == req.user.id) {
        await taskmodel.findByIdAndDelete(req.params.taskid);
        res.status(200).json({ message: "deleted sucesfully " });
      } else {
        return res
          .status(403)
          .json({ message: "Cannot Delete Task Not Yours " });
      }
    } else {
      return res.status(404).json({ message: "Task Not Found " });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
