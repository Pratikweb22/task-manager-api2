const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const UserService = require("../service/userService");
// ✅ Register User

const registerUser = async (req, res) => {
  try {
     const user = await UserService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = registerUser;



// ✅ Login User
const loginUser = async (req, res) => {
  try {
     const data = await UserService.loginUser(req.body);
    res.json({
      success: true,
      message: "Login successful",
      token: data.token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get Current User
const getCurrentUser = async (req, res) => {
  try {
     const user = await UserService.getCurrentUser(req.user.id);
    res.json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error("Get Current User Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await UserService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Only admin can access all users
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const users = await UserService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getCurrentUser, deleteUser, getAllUsers };