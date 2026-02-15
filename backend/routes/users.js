const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  validatelogin,
  validatesignup,
  validateupdateprofile,
} = require("../joivalidate");
const jwt = require("jsonwebtoken");
const dotenvv = require("dotenv");
dotenvv.config();
const usermodel = require("../models/User.js");
const verifytoken = require("../middlwares/verifytoken.js");
const verifyadmin = require("../middlwares/verifyadmin.js");
const taskmodel = require("../models/Task.js");
router.post("/login", async (req, res) => {
  const { error } = validatelogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Not Found " });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ message: "email or password is wrong " });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
    );
    user.isActive = true;
    user.lastseen = null;
    await user.save();
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const { error } = validatesignup(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User With This Email Already Exists " });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newuser = await usermodel.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });
    const token = jwt.sign(
      { id: newuser._id, role: newuser.role },
      process.env.JWT_KEY,
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/profile", verifytoken, async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const { username, email } = user._doc;
    res.status(200).json({ username, email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/profile", verifytoken, async (req, res) => {
  const { error } = validateupdateprofile(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ message: "cannot update ,email already exists " });
    }
    await usermodel.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json({ message: "update succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/logout", verifytoken, async (req, res) => {
  //3mlt hyde l7ata e3ml isActive false y3ne offline
  await usermodel.findByIdAndUpdate(req.user.id, {
    $set: {
      isActive: false,
      lastseen: Date.now(),
    },
  });
  res.status(200).json({ message: "succesfully logout " });
});
router.get("/checkrole", verifytoken, async (req, res) => {
  try {
    const user = await usermodel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    return res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/", verifytoken, verifyadmin, async (req, res) => {
  //njeb kl users wkl tasks  lentba3on bl table
  try {
    const alluserswithtasksinfo = await usermodel.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "userId",
          as: "tasks",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          isActive: 1,
          role: 1,
          lastseen: 1,
          createdAt: 1,
          isbanned: 1,

          nballtasks: { $size: "$tasks" },

          nbdonetasks: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.isDone", true] },
              },
            },
          },

          nbundonetasks: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.isDone", false] },
              },
            },
          },
        },
      },
    ]);
    if (alluserswithtasksinfo.length == 0) {
      return res.status(404).json({ message: "no users available" });
    }
    res.status(200).json(alluserswithtasksinfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
