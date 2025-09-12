require("dotenv").config(); // load .env variables
const express = require("express");
const app = express();
const port = 8080;
const { connectDB } = require("./config/db");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const commentRouter = require("./routes/commentRoutes");
const activityRouter = require("./routes/activityRoutes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve static files from uploads directory


//Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/comments", commentRouter);
app.use("/api/activity", activityRouter);


// Connect to the database and start the server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    })
});