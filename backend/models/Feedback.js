const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  title: String,
  content: String,
  rating: Number,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
