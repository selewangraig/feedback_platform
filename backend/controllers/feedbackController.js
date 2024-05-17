const Feedback = require("../models/Feedback");
// const { v4: uuidv4 } = require("uuid");

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFeedback = async (req, res) => {
  const feedback = new Feedback({
    // _id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
    rating: req.body.rating,
  });
  try {
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    feedback.title = req.body.title;
    feedback.content = req.body.content;
    feedback.rating = req.body.rating;

    const updatedFeedback = await feedback.save();
    res.json(updatedFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    await feedback.remove();
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
