// models/ActivityLog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.INTEGER, allowNull: true },
    commentId: { type: DataTypes.INTEGER, allowNull: true }, 
    action: { type: DataTypes.STRING, allowNull: false }, // e.g. TASK_ADDED, COMMENT_UPDATED
    message: { type: DataTypes.TEXT, allowNull: false }, // readable message
  },
  {
    timestamps: true,
  }
);

module.exports = ActivityLog;
