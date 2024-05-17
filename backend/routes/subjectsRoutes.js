const express = require("express");
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectsController");

router.get("/", getAllSubjects);
router.get("/get-subject-by-id/:id", getSubjectById);
router.post("/create-subject", createSubject);
router.put("/update-subject/:id", updateSubject);
router.delete("/delete-subject/:id", deleteSubject);

module.exports = router;
