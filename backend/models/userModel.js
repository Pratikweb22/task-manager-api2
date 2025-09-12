const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: { 
    type: DataTypes.ENUM("user", "admin"), // only allow these two values
    allowNull: false, 
    defaultValue: "user" 
  },
  designation: { 
    type: DataTypes.ENUM(
        "Software Intern",
        "Junior Software Engineer",
        "Senior Software Engineer",
        "Manager",
        "Senior Manager"
      ),
      allowNull: true,
      defaultValue: "Software Intern"
  }
}, {
  tableName: "users",
  timestamps: false
});



module.exports = User;

