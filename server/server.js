//List of all the middleware and routes used in the application
require("dotenv").config();
const express = require("express");
const logger = require("./middleware/logger");
const corsHandler = require("./middleware/corsHandler");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
connectDB();    

const PORT = process.env.PORT || 3000;

app.use(logger);  // 1. custom middleware
app.use(corsHandler); // 2. CORS middleware
app.use(express.json()); // 3. body parsers

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        time: new Date()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes); //routes for students

app.use(notFoundHandler); // 5. 404 catch-all
app.use(errorHandler); // 6. error handler (4 args, always last)

app.listen(PORT, () => { // 7. start server
  console.log(`Server running on http://localhost:${PORT}`);
});
