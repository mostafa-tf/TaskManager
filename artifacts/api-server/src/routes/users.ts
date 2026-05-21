import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/User";
import { Task } from "../models/Task";
import { verifytoken } from "../middlewares/verifytoken";
import { verifyadmin } from "../middlewares/verifyadmin";
import { resetpasswordtoken } from "../middlewares/resetpasswordtoken";
import {
  validatelogin,
  validatesignup,
  validateupdateprofile,
  validateupdateuser,
} from "../joivalidate";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { error } = validatelogin(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { res.status(404).json({ message: "Not Found" }); return; }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) { res.status(400).json({ message: "email or password is wrong" }); return; }
    if (user.isbanned) { res.status(403).json({ message: "Cannot login! You Are Banned" }); return; }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY as string);
    user.isActive = true;
    user.lastseen = null;
    await user.save();
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const { error } = validatesignup(req.body);
  if (error) { res.status(400).json({ message: error.details[0].message }); return; }
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) { res.status(400).json({ message: "User With This Email Already Exists" }); return; }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newuser = await User.create({ username: req.body.username, password: req.body.password, email: req.body.email });
    const token = jwt.sign({ id: newuser._id, role: newuser.role }, process.env.JWT_KEY as string);
    res.status(201).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getmyid", verifytoken, async (req: Request, res: Response) => {
  try {
    res.status(200).json({ myid: (req as any).user.id });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile", verifytoken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) { res.status(404).json({ message: "User Not Found" }); return; }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", verifytoken, async (req: Request, res: Response) => {
  const { error } = validateupdateprofile(req.body);
  if (error) { res.status(400).json({ message: error.details[0].message }); return; }
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) { res.status(400).json({ message: "cannot update, email already exists" }); return; }
    await User.findByIdAndUpdate((req as any).user.id, { $set: req.body });
    res.status(200).json({ message: "update succesfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/logout", verifytoken, async (req: Request, res: Response) => {
  await User.findByIdAndUpdate((req as any).user.id, { $set: { isActive: false, lastseen: Date.now() } });
  res.status(200).json({ message: "succesfully logout" });
});

router.put("/changepassword", verifytoken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) { res.status(400).json({ message: "Both passwords are required" }); return; }
    if (newPassword.length < 6) { res.status(400).json({ message: "New password must be at least 6 characters" }); return; }
    const user = await User.findById((req as any).user.id);
    if (!user) { res.status(404).json({ message: "User not found" }); return; }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) { res.status(400).json({ message: "Current password is incorrect" }); return; }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(user._id, { $set: { password: hashed } });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Your password has been changed",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;border:1px solid #e0e0e0">
        <h2 style="color:#1b5e20;margin-bottom:8px">Password Changed</h2>
        <p style="color:#333">Hi <strong>${user.username}</strong>,</p>
        <p style="color:#333">Your TaskFlow account password was successfully changed.</p>
        <p style="color:#333">If you did not make this change, please reset your password immediately or contact support.</p>
        <p style="color:#888;font-size:13px;margin-top:24px">— The TaskFlow Team</p>
      </div>`,
    });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/checkrole", verifytoken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    res.status(200).json({ role: user.role });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/allusers", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const allusers = await User.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: { userId: "$_id" },
          pipeline: [{ $match: { $expr: { $and: [{ $eq: ["$userId", "$$userId"] }, { $eq: ["$assignedTo", null] }] } } }],
          as: "tasks",
        },
      },
      {
        $project: {
          username: 1, email: 1, isActive: 1, role: 1, lastseen: 1, createdAt: 1, isbanned: 1,
          nballtasks: { $size: "$tasks" },
          nbdonetasks: { $size: { $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.isDone", true] } } } },
          nbundonetasks: { $size: { $filter: { input: "$tasks", as: "task", cond: { $eq: ["$$task.isDone", false] } } } },
        },
      },
    ]).sort({ nbdonetasks: -1 });
    if (allusers.length === 0) { res.status(404).json({ message: "no users available" }); return; }
    res.status(200).json(allusers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/updaterole", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    user.role = req.body.role;
    await user.save();
    res.status(200).json({ message: "role updated successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:userid", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userid);
    if (user) await Task.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.userid);
    res.status(200).json({ message: "delete succesfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/toggleblock/:useremail", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.useremail });
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    user.isbanned = !user.isbanned;
    if (user.isbanned) user.isActive = false;
    await user.save();
    res.status(200).json({ message: "updated succesfully" });
  } catch (err: any) {
    res.status(500).json({ message: "error in server" });
  }
});

router.get("/userinfo/:userid", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userid);
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/updateuser/:userid", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const { error } = validateupdateuser(req.body);
    if (error) { res.status(400).json({ message: error.details[0].message }); return; }
    const updateduser = await User.findByIdAndUpdate(req.params.userid, { $set: req.body }, { new: true });
    if (!updateduser) { res.status(400).json({ message: "user not found" }); return; }
    res.status(200).json({ message: "updated" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/forgotpassword", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { res.status(404).json({ message: "user not found" }); return; }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY as string, { expiresIn: "15m" });
    const domains = process.env.REPLIT_DOMAINS?.split(",")[0];
    const resetLink = domains
      ? `https://${domains}/resetpassword?token=${token}`
      : `http://localhost:5173/resetpassword?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Reset Your Password",
      html: `<h3>Password Reset</h3><p>You requested to reset your password.</p><p>This link will expire in 15 minutes.</p><a href="${resetLink}">Reset Password</a>`,
    });
    res.status(200).json({ message: "reset link send to your email checkit" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/resetpassword", resetpasswordtoken, async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(req.body.password, salt);
    await User.findByIdAndUpdate((req as any).user.id, { password: hashedpass });
    res.status(200).json({ message: "updated sucesfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
