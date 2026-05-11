const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const resetpasswordtoken = require("../middlwares/resetpasswordtoken.js");

const {
  validatelogin,
  validatesignup,
  validateupdateprofile,
  validateupdateuser,
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
    if (user.isbanned) {
      return res.status(403).json({ message: "Cannot login! You Are Banned " });
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

router.get("/getmyid", verifytoken, async (req, res) => {
  try {
    return res.status(200).json({ myid: req.user.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
  try {
    const alluserswithtasksinfo = await usermodel
      .aggregate([
        {
          $lookup: {
            from: "tasks",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", "$$userId"] },
                      { $eq: ["$assignedTo", null] },
                    ],
                  },
                },
              },
            ],
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
      ])
      .sort({ nbdonetasks: -1 });

    if (alluserswithtasksinfo.length == 0) {
      return res.status(404).json({ message: "no users available" });
    }

    res.status(200).json(alluserswithtasksinfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete("/:useremail", verifytoken, verifyadmin, async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.params.useremail });
    await taskmodel.deleteMany({ userId: user._id });
    await usermodel.deleteOne({ email: req.params.useremail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.status(200).json({ message: "delete succesfully" });
});
router.put(
  "/toggleblock/:useremail",
  verifytoken,
  verifyadmin,
  async (req, res) => {
    try {
      const user = await usermodel.findOne({ email: req.params.useremail });
      user.isbanned = !user.isbanned;
      if (user.isbanned) {
        user.isActive = false;
      }

      await user.save();
      return res.status(200).json({ message: "updated succesfully " });
    } catch (error) {
      res.status(500).json({ message: "error in server" });
    }
  },
);
router.get("/userinfo/:userid", verifytoken, verifyadmin, async (req, res) => {
  //hwn l admin 3m yjeb user info
  const userid = req.params.userid;
  try {
    const user = await usermodel.findOne({ _id: userid });
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put(
  "/updateuser/:userid",
  verifytoken,
  verifyadmin,
  async (req, res) => {
    try {
      const { error } = validateupdateuser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const updateduser = await usermodel.findByIdAndUpdate(
        req.params.userid,
        { $set: req.body },
        { new: true },
      );
      if (!updateduser) {
        return res.status(400).json({ message: "user not found " });
      }

      res.status(200).json({ message: "updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

router.post("/forgotpassword", async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "user not  found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "15m" },
    );

    const resetLink = `http://localhost:5173/resetpassword?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>You requested to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
             <a href="${resetLink}">Reset Password</a>
      `,
    });
    res.status(200).json({ message: "reset link send to your email checkit" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/resetpassword", resetpasswordtoken, async (req, res) => {
  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashedpass = await bcrypt.hash(password, salt);

  try {
    await usermodel.findByIdAndUpdate(req.user.id, {
      password: hashedpass,
    });
    res.status(200).json({ message: "updated sucesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
