const express = require("express");
const router = express.Router();
const passport = require("../passport");
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/admin/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
