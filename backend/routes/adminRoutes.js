const express = require("express");
const router = express.Router();
// const {
//   assignSubjectToStudent,
//   assignSubjectToTeacher,
// } = require("../controllers/subjectsController");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  registerUser,
  findTeachers,
  findStudents,
} = require("../controllers/authController");

// router.post("/assign-subject-to-student", assignSubjectToStudent);
// router.post("/assign-subject-to-teacher", assignSubjectToTeacher);
router.get("/users", getAllUsers);
router.put("/updateUsers/:id", updateUser);
router.delete("/deleteUsers/:id", deleteUser);
router.post("/registerUser", registerUser);
router.get("/findTeachers", findTeachers);
router.get("/findStudents", findStudents);

module.exports = router;
