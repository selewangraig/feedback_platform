const Feedback = require("../models/Feedback");
const User = require("../models/User");
const Subject = require("../models/Subject");

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
  try {
    // Lookup the student by name and role
    const student = await User.findOne({
      name: req.body.User,
      role: "student",
    });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const teacher = await User.findOne({
      name: req.body.User,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // Lookup the subject by name
    const subject = await Subject.findOne({ name: req.body.subject });
    if (!subject) {
      return res.status(400).json({ message: "Subject not found" });
    }

    // Create the feedback with ObjectId references
    const feedback = new Feedback({
      title: req.body.title,
      content: req.body.content,
      rating: req.body.rating,
      teacher: teacher._id,
      student: student._id,
      subject: subject._id,
    });

    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

exports.getFeedbackByTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      username: req.params.username,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const feedbacks = await Feedback.find({ teacher: teacher._id }).populate(
      "subject student"
    );
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackByTeacherId = async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.teacherId,
      role: "teacher",
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const feedbacks = await Feedback.find({ teacher: teacher._id }).populate(
      "subject student"
    );
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackByStudentUsername = async (req, res) => {
  try {
    const student = await User.findOne({
      username: req.params.username,
      role: "student",
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const feedbacks = await Feedback.find({ student: student._id }).populate(
      "subject teacher"
    );
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
