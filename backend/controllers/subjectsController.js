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
    res.status(400).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
};

// exports.deleteSubject = async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id);
//     if (!subject) {
//       return res.status(404).json({ message: "Subject not found" });
//     }
//     await subject.remove();
//     res.json({ message: "Subject deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

exports.findSubjectsByTeacher = async (req, res) => {
  try {
    const subjects = await Subject.find({
      teacher: req.params.teacherId,
    }).populate("students");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findSubjectsByStudent = async (req, res) => {
  try {
    const subjects = await Subject.find({ students: req.params.studentId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findSubjectsWithoutTeacher = async (req, res) => {
  try {
    const subjects = await Subject.find({ teacher: null });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findSubjectsWithoutStudent = async (req, res) => {
  try {
    const subjects = await Subject.find({ students: { $size: 0 } });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
