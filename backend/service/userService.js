const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

class UserService {
  // ---------------- Register ----------------
  static async registerUser({ name, email, password, role, designation }) {

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      designation: designation || "Software Intern",
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
  }

  // ---------------- Login ----------------
  static async loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

   
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  }

  // ---------------- Get Current User ----------------
  static async getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // ---------------- Delete User ----------------
  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
    return true;
  }

  // ---------------- Get All Users (Admin only) ----------------
static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "designation"],
      });
      return users;
    } catch (error) {
      throw new Error("Database error while fetching users");
    }
  }
}


module.exports = UserService;
