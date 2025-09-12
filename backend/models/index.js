const User = require("./userModel");
const Task = require("./taskModel");
const Comment = require("./commentModel");
const TaskAssignee = require("./taskassignees");
const Attachment = require("./attachments");
const ActivityLog = require("./activitylog");

// =======================
// User ↔ Task
// =======================

// A User can create many tasks
User.hasMany(Task, { foreignKey: "userId", as: "createdTasks" });

// A User can be assigned to many tasks (many-to-many)
User.belongsToMany(Task, { through: TaskAssignee, foreignKey: "userId", as: "assignedTasks" });

// Each Task belongs to a creator (User)
Task.belongsTo(User, { foreignKey: "userId", as: "creator" });

// A Task can have many assignees (many-to-many)
Task.belongsToMany(User, { through: TaskAssignee, foreignKey: "taskId", as: "assignees" });

// =======================
// Task ↔ Comment
// =======================

// A Task can have many comments
Task.hasMany(Comment, { foreignKey: "taskId", as: "comments", onDelete: "CASCADE" });

// Each Comment belongs to a Task
Comment.belongsTo(Task, { foreignKey: "taskId", as: "task", onDelete: "CASCADE" });

// =======================
// User ↔ Comment
// =======================

// A User can write many comments
User.hasMany(Comment, { foreignKey: "userId", as: "userComments", onDelete: "CASCADE" });

// Each Comment belongs to a User
Comment.belongsTo(User, { foreignKey: "userId", as: "author", onDelete: "CASCADE" });

// =======================
// Task ↔ Attachment
// =======================

// A Task can have many attachments
Task.hasMany(Attachment, { foreignKey: "taskId", as: "attachments", onDelete: "CASCADE" });

// Each Attachment belongs to a Task
Attachment.belongsTo(Task, { foreignKey: "taskId", as: "task", onDelete: "CASCADE" });


ActivityLog.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ActivityLog, { foreignKey: "userId", as: "activityLogs" });

ActivityLog.belongsTo(Task, { foreignKey: "taskId", as: "task" });
Task.hasMany(ActivityLog, { foreignKey: "taskId", as: "activityLogs" });

ActivityLog.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });
Comment.hasMany(ActivityLog, { foreignKey: "commentId", as: "activityLogs" });

// Export all models with associations
module.exports = { User, Task, Comment, TaskAssignee, Attachment, ActivityLog };
