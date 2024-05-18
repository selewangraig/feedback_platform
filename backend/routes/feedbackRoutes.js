const express = require("express");
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByTeacher,
  getFeedbackByStudentUsername,
} = require("../controllers/feedbackController");

router.get("/", getAllFeedback);
router.get("/get-feedback-by-id/:id", getFeedbackById);
router.post("/create-feedback", createFeedback);
router.put("/update-feedback/:id", updateFeedback);
router.delete("/delete-feedback/:id", deleteFeedback);
router.get("/feedback-by-teacher/:teacherId", getFeedbackByTeacher);
router.get("/feedback-by-student/:username", getFeedbackByStudentUsername);

module.exports = router;
