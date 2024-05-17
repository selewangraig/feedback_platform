const User = require("../models/User");

User.plugin(require("passport-local-mongoose"));

module.exports = User;
