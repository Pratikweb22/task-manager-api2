const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, deleteUser,getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddlewares");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/currentuser", authMiddleware, getCurrentUser);
router.delete("/delete/:id", authMiddleware, deleteUser);
router.get("/all", authMiddleware, getAllUsers);

module.exports = router;
