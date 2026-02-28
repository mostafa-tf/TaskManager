const mongoose = require("mongoose");

const verifytoken = require("../middlwares/verifytoken");
const verifyadmin = require("../middlwares/verifyadmin");
const express = require("express");
const router = express.Router();
const feedbackmodel = require("../models/Feedback");
const { validatecreatefeedback } = require("../joivalidate");
router.post("/", verifytoken, async (req, res) => {
  const { error } = validatecreatefeedback(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const feedback = await feedbackmodel.create({
      userId: req.user.id,
      rating: req.body.rating,
      message: req.body.message,
    });
    res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/", verifytoken, verifyadmin, async (req, res) => {
  try {
    const feedbacks = await feedbackmodel
      .find()
      .populate("userId", "email username");
    if (feedbacks.length == 0) {
      return res.status(404).json({ message: "no feedbacks found " });
    }
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
