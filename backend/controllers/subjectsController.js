const Subject = require("../models/Subject");
const User = require("../models/User");

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher students");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "teacher students"
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  const { name, description } = req.body;
  const newSubject = new Subject({
    name,
    description,
  });
  try {
    const subject = await newSubject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    subject.name = req.body.name;
    subject.description = req.body.description;
    subject.teacher = req.body.teacher;
    subject.students = req.body.students;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    await subject.remove();
    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignSubjectToStudent = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const { studentId, subjectId } = req.body;
    const student = await User.findById(studentId);
    const subject = await Subject.findById(subjectId);
    if (!student || !subject) {
      return res.status(404).json({ message: "Student or subject not found" });
    }
    student.subjects.push(subjectId);
    subject.students.push(studentId);
    await student.save();
    await subject.save();
    res
      .status(200)
      .json({ message: "Subject assigned to student successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignSubjectToTeacher = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const { teacherId, subjectId } = req.body;
    const teacher = await User.findById(teacherId);
    const subject = await Subject.findById(subjectId);
    if (!teacher || !subject) {
      return res.status(404).json({ message: "Teacher or subject not found" });
    }
    teacher.subjects.push(subjectId);
    subject.teacher = teacherId;
    await teacher.save();
    await subject.save();
    res
      .status(200)
      .json({ message: "Subject assigned to teacher successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
