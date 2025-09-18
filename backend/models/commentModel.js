const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // your sequelize instance
const User = require("./userModel");
const Task = require("./taskModel");

const Comment = sequelize.define("Comment", {
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
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "comments",
  timestamps: true 
});

module.exports = Comment;
