const express = require("express");
const router = express.Router();

// Import controller functions
const {
  addComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddlewares");


// Add a comment to a task
router.post("/add", authMiddleware, addComment);

// Get all comments for a task
router.get("/task/:taskId", authMiddleware, getCommentsByTask);

// Update a comment
router.put("/:commentId", authMiddleware, updateComment);

// Delete a comment
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
