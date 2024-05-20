require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./passport");

const app = express();
const authRoutes = require("./routes/authRoutes");
const subjectsRoutes = require("./routes/subjectsRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
app.use(express.json());
app.use(cors());

// Configure express-session middleware
const store = new MongoDBStore(
  {
    uri: process.env.MONGO_URI,
    collection: "sessions",
  },
  (error) => {
    if (error) {
      console.error("Error setting up MongoDBStore:", error);
    }
  }
);

store.on("error", (error) => {
  console.error("Session store error:", error);
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/feedback", feedbackRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB database connection established successfully")
  )
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with failure
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});
