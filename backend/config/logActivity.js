
const ActivityLog = require("../models/activitylog");

async function logActivity({ userId, taskId = null, commentId = null, action, message }) {
  try {
    await ActivityLog.create({
      userId,
      taskId,
      commentId,
      action,
      message,
    });
  } catch (err) {
    console.error("ActivityLog Error:", err);
  }
}

module.exports = logActivity;
