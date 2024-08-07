require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoute = require("./routes/auth.route");
const noteRoute = require("./routes/notes.route");

// Database
connectDB();

// Port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/note", noteRoute);

// app listening
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`.bgMagenta.white)
);
