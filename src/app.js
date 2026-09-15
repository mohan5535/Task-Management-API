const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
}));
app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Task Management API is running.",
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Route not found.",
  })
);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Request body must contain valid JSON.",
    });
  }

  return next(err);
});

app.use((err, req, res, next) =>
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  })
);

module.exports = app;