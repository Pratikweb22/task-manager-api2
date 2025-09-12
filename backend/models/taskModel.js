const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // your sequelize instance
const User = require("./userModel");


const Task = sequelize.define("Task", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  status: { 
    type: DataTypes.ENUM("pending", "in-progress", "completed"), 
    allowNull: false, 
    defaultValue: "pending" 
  },
  dueDate: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  userId: { // creator of the task
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    onDelete: "CASCADE"
  }
}, {
  tableName: "tasks",
  timestamps: true // adds createdAt and updatedAt automatically
});



module.exports = Task;
