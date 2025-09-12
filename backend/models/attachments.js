const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // your sequelize instance
const Task = require("./taskModel");

const Attachment = sequelize.define("Attachment", {
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
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "attachments",
  timestamps: true // adds createdAt and updatedAt
});


module.exports = Attachment;
