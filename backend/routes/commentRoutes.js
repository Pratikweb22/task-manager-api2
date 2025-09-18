const express = require("express");
const router = express.Router();

// Import controller functions
const {
  addComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const auth = require("../middleware/authMiddlewares"); 


// Add a comment to a task
router.post("/add", auth, addComment);

// Get all comments for a task
router.get("/task/:taskId", auth, getCommentsByTask);

// Update a comment
router.put("/:commentId", auth, updateComment);

// Delete a comment
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
