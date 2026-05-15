import { Router, Request, Response } from "express";
import { Feedback } from "../models/Feedback";
import { verifytoken } from "../middlewares/verifytoken";
import { verifyadmin } from "../middlewares/verifyadmin";
import { validatecreatefeedback } from "../joivalidate";

const router = Router();

router.post("/", verifytoken, async (req: Request, res: Response) => {
  const { error } = validatecreatefeedback(req.body);
  if (error) { res.status(400).json({ message: error.details[0].message }); return; }
  try {
    const feedback = await Feedback.create({ userId: (req as any).user.id, rating: req.body.rating, message: req.body.message });
    res.status(201).json(feedback);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifytoken, verifyadmin, async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "email username");
    if (feedbacks.length === 0) { res.status(404).json({ message: "no feedbacks found" }); return; }
    res.status(200).json(feedbacks);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
