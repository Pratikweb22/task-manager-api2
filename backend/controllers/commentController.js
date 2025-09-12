const { Comment, Task, User } = require("../models");
const CommentService = require("../service/commentService");
// Add Comment
const addComment = async (req, res) => {
  try {
     if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const comment = await CommentService.addComment({
      taskId: req.body.taskId,
      text: req.body.text,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, message: "Comment added", data: comment });
  } catch (err) {
    console.error("Error in addComment:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Comments for a Task
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await CommentService.getCommentsByTask(req.params.taskId);
    res.json({ success: true, data: comments });
  } catch (err) {
    console.error("Error in getCommentsByTask:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    await CommentService.deleteComment(req.params.commentId, req.user);
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Error in deleteComment:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Comment
const updateComment = async (req, res) => {
  try {
    const updatedComment = await CommentService.updateComment(
      req.params.commentId,
      req.body.text,
      req.user
    );

    res.json({ success: true, message: "Comment updated", data: updatedComment });
  } catch (err) {
    console.error("Error in updateComment:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addComment,
  getCommentsByTask,
  deleteComment,
  updateComment,
};
