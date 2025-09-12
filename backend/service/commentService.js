const { Comment, Task, User } = require("../models");
const logActivity = require("../config/logActivity");

class CommentService {
  // ---------------- Add Comment ----------------
  static async addComment({ taskId, text, userId }) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const comment = await Comment.create({
      taskId,
      userId,
      text,
    });

     await logActivity({
  userId,
  taskId,
  commentId: comment.id,
  action: "COMMENT_ADDED",
  message: `User (id:${userId}) added a comment on task "${task.title}": "${text}"`,
});
    return comment;
  }

  // ---------------- Get Comments by Task ----------------
  static async getCommentsByTask(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const comments = await Comment.findAll({
      where: { taskId },
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "ASC"]],
    });


    return comments;
  }

  // ---------------- Delete Comment ----------------
  static async deleteComment(commentId, currentUser) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (currentUser.role !== "admin" && comment.userId !== currentUser.id) {
      throw new Error("Forbidden");
    }

    await comment.destroy();

    await logActivity({
  userId: currentUser.id,
  taskId: comment.taskId,
  commentId: comment.id,
  action: "COMMENT_DELETED",
  message: `${currentUser.name} (id:${currentUser.id}) deleted a comment on task "${comment.task.title}"`,
});
    return true;
  }

  // ---------------- Update Comment ----------------
  static async updateComment(commentId, text, currentUser) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (currentUser.role !== "admin" && comment.userId !== currentUser.id) {
      throw new Error("Forbidden");
    }

    comment.text = text || comment.text;
    await comment.save();

   await logActivity({
  userId: currentUser.id,
  taskId: comment.taskId,
  commentId: comment.id,
  action: "COMMENT_UPDATED",
  message: `${currentUser.name} (id:${currentUser.id}) updated a comment on task "${comment.task.title}"`,
});

    return comment;
  }
}

module.exports = CommentService;
