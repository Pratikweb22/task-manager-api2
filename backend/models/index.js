const User = require("./userModel");
const Task = require("./taskModel");
const Comment = require("./commentModel");
const TaskAssignee = require("./taskassignees");
const Attachment = require("./attachments");
const ActivityLog = require("./activitylog");

// =======================
// User ↔ Task
// =======================

User.hasMany(Task, { foreignKey: "userId", as: "createdTasks" });

User.belongsToMany(Task, { through: TaskAssignee, foreignKey: "userId", as: "assignedTasks" });

Task.belongsTo(User, { foreignKey: "userId", as: "creator" });

Task.belongsToMany(User, { through: TaskAssignee, foreignKey: "taskId", as: "assignees" });

// =======================
// Task ↔ Comment
// =======================

Task.hasMany(Comment, { foreignKey: "taskId", as: "comments", onDelete: "CASCADE" });


Comment.belongsTo(Task, { foreignKey: "taskId", as: "task", onDelete: "CASCADE" });

// =======================
// User ↔ Comment
// =======================

User.hasMany(Comment, { foreignKey: "userId", as: "userComments", onDelete: "CASCADE" });

Comment.belongsTo(User, { foreignKey: "userId", as: "author", onDelete: "CASCADE" });

// =======================
// Task ↔ Attachment
// =======================


Task.hasMany(Attachment, { foreignKey: "taskId", as: "attachments", onDelete: "CASCADE" });

Attachment.belongsTo(Task, { foreignKey: "taskId", as: "task", onDelete: "CASCADE" });


ActivityLog.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ActivityLog, { foreignKey: "userId", as: "activityLogs" });

ActivityLog.belongsTo(Task, { foreignKey: "taskId", as: "task" });
Task.hasMany(ActivityLog, { foreignKey: "taskId", as: "activityLogs" });

ActivityLog.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });
Comment.hasMany(ActivityLog, { foreignKey: "commentId", as: "activityLogs" });

// Export all models with associations
module.exports = { User, Task, Comment, TaskAssignee, Attachment, ActivityLog };
