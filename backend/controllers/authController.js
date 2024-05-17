const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      req.session.userId = user._id;
      req.session.userRole = user.role;

      // Include the user's role in the response
      res.status(200).json({
        message: "User logged in successfully",
        role: req.session.userRole, // Send the user's role in the response
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("subjects").exec();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.status(200).json({ message: "User logged out successfully" });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      user.passwprd = await bcrypt.hash(password, 10);
    }
    user.username = username;
    user.role = role;
    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id name");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("_id name");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
