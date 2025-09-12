const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddlewares"); // your auth middleware
const { ActivityLog, User, Task, Comment } = require("../models");

// GET /api/activity?taskId=&userId=&action=&page=&limit=
router.get("/all", auth, async (req, res) => {
  try {
    // Only admins can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { page = 1, limit = 50, taskId, userId, action } = req.query;

    // Build filter conditions
    const where = {};
    if (taskId) where.taskId = taskId;
    if (userId) where.userId = userId;
    if (action) where.action = action;

    // Fetch activity logs with pagination
    const logs = await ActivityLog.findAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Task, as: "task", attributes: ["id", "title"] },
        { model: Comment, as: "comment", attributes: ["id", "text"] },
      ],
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit: parseInt(limit, 10),
    });

    res.json({ success: true, data: logs });
  } catch (err) {
    console.error("Activity logs error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
