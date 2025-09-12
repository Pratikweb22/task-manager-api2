// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/authMiddlewares"); // JWT auth middleware
const upload = require("../config/multer");
const { addTask, updateTask,deleteTask,getAllTasks,getTasksByStatusForUser,getTasksByAssignee, getAllTasksByUser } = require("../controllers/taskController");


//  Add a new task
// Accept multiple files with field name "files"
router.post(
  "/add",
  auth, 
  upload.array("attachments", 5),
  addTask
);

//  Update a task
// Accept multiple files (optional)
router.put(
  "/update/:id",
  auth,
  upload.array("attachments", 5),
  updateTask
);

//  Delete a task
router.delete("/delete/:id", auth, deleteTask);

//  Get all tasks
router.get("/all", auth, getAllTasks);

//  Get tasks by status (pending, inprogress, completed)
router.get("/status/:status", auth, getTasksByStatusForUser);

// Get task by assigned user (Admin only)
router.get("/assignee/:userId", auth, getTasksByAssignee);

// Get all tasks for logged-in user (creator or assignee)
router.get("/user/:id", auth, getAllTasksByUser);

module.exports = router;
