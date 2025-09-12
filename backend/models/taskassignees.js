const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // your sequelize instance
const User = require("./userModel");
const Task = require("./taskModel");


const TaskAssignee = sequelize.define("TaskAssignee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: "id"
    },
    onDelete: "CASCADE"
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    onDelete: "CASCADE"
  }
}, {
  tableName: "taskassignees",
  timestamps: true // adds createdAt and updatedAt
});


module.exports = TaskAssignee;
