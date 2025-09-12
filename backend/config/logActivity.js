// utils/logActivity.js
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
    // never throw from logger; just print so it won't break main flow
    console.error("ActivityLog Error:", err);
  }
}

module.exports = logActivity;
