const express = require("express");
const router = express.Router();
const {
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackByTeacher,
} = require("../controllers/feedbackController");

router.get("/", getAllFeedback);
router.get("/:id", getFeedbackById);
router.post("/", createFeedback);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);
router.get("/feedback-by-teacher/:teacherId", getFeedbackByTeacher);

module.exports = router;
