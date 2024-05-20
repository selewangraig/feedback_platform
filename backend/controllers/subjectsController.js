const Subject = require("../models/Subject");
const User = require("../models/User");

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("teacher students");
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res
      .status(500)
      .json({ message: "Error fetching subjects", error: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "teacher students"
    );
    res.json(subject);
  } catch (error) {
    console.error("Error fetching subject by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching subject by ID", error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  const { name, description, teacher, students } = req.body;
  const newSubject = new Subject({
    name,
    description,
    teacher,
    students,
  });
  try {
    const subject = await newSubject.save();
    res.status(201).json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    res
      .status(400)
      .json({ message: "Error creating subject", error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, description, teacher, students } = req.body;
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    subject.name = name;
    subject.description = description;
    subject.teacher = teacher;
    subject.students = students;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res
      .status(400)
      .json({ message: "Error updating subject", error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Error deleting subject:", err);
    res
      .status(400)
      .json({ message: "Error deleting subject", error: err.message });
  }
};

exports.addStudentToSubject = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select(
      "-password"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (subject.students.includes(req.params.studentId)) {
      return res.status(400).json({ message: "Student already in subject" });
    }
    subject.students.push(req.params.studentId);
    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error("Error adding student to subject:", error);
    res
      .status(500)
      .json({
        message: "Error adding student to subject",
        error: error.message,
      });
  }
};

exports.removeStudentFromSubject = async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).select(
      "-password"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (!subject.students.includes(req.params.studentId)) {
      return res.status(400).json({ message: "Student not in subject" });
    }
    subject.students = subject.students.filter(
      (studentId) => studentId != req.params.studentId
    );
    await subject.save();
    res.json(subject);
  } catch (error) {
    console.error("Error removing student from subject:", error);
    res
      .status(500)
      .json({
        message: "Error removing student from subject",
        error: error.message,
      });
  }
};

exports.findSubjectsByTeacher = async (req, res) => {
  try {
    const subjects = await Subject.find({
      teacher: req.params.teacherId,
    }).populate("students");
    res.json(subjects);
  } catch (error) {
    console.error("Error finding subjects by teacher:", error);
    res
      .status(500)
      .json({
        message: "Error finding subjects by teacher",
        error: error.message,
      });
  }
};

exports.findSubjectsByStudent = async (req, res) => {
  try {
    const subjects = await Subject.find({ students: req.params.studentId });
    res.json(subjects);
  } catch (error) {
    console.error("Error finding subjects by student:", error);
    res
      .status(500)
      .json({
        message: "Error finding subjects by student",
        error: error.message,
      });
  }
};

exports.findSubjectsWithoutTeacher = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: null });
    res.json(subjects);
  } catch (error) {
    console.error("Error finding subjects without teacher:", error);
    res
      .status(500)
      .json({
        message: "Error finding subjects without teacher",
        error: error.message,
      });
  }
};

exports.findSubjectsWithoutStudent = async (req, res) => {
  try {
    const subjects = await Subject.find({ students: { $size: 0 } });
    res.json(subjects);
  } catch (error) {
    console.error("Error finding subjects without student:", error);
    res
      .status(500)
      .json({
        message: "Error finding subjects without student",
        error: error.message,
      });
  }
};
