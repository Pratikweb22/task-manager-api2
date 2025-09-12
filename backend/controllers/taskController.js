const transporter = require("../config/mail");
const path = require("path");
const upload = require("../config/multer");
const { User, Task, Comment, TaskAssignee, Attachment } = require("../models");
const { Op } = require("sequelize");
const TaskService = require("../service/taskService");
// ✅ Add Task
const addTask = async (req, res) => {
  try {
    const task = await TaskService.addTask(req.body, req.files, req.user);
    res.json({
      success: true,
      message: "Task added successfully",
      data: task,
    });
  } catch (err) {
    console.error("Error in addTask:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


//update task
const updateTask = async (req, res) => {
  try {
   const task = await TaskService.updateTask(req.params.id, req.body, req.user);
    res.json({ success: true, message: "Task updated successfully", data: task });
  } catch (err) {
    console.error("Error in updateTask:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// delete task
const deleteTask = async (req, res) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user);
    res.json({ success: true, message: "Task deleted successfully", data: result });
  } catch (err) {
    console.error("Error in deleteTask:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// getall tasks

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasks(req.user);
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Error in getAllTasks:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//get task by status for logged in user (creator or assignee)
const getTasksByStatusForUser = async (req, res) => {
  try {
    const tasks = await TaskService.getTasksByStatusForUser(req.params.status, req.user);
    res.status(200).json({ success: true, message: tasks });
  } catch (err) {
    console.error("Error in getTasksByStatusForUser:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//get task by assigned user(Admin only)
const getTasksByAssignee = async (req, res) => {
    try {
        const tasks = await TaskService.getTasksByAssignee(req.params.userId, req.user);
        res.json({ success: true, message: tasks });
    } catch (err) {
        console.error("Error in getTasksByAssignee:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// get all tasks for logged in user (creator or assignee)
const getAllTasksByUser = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasksByUser(req.user);
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (err) {
    console.error("Error in getAllTasksByUser:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = {
  addTask,
  updateTask,
  deleteTask,
  getTasksByAssignee,
  getAllTasksByUser,
    getAllTasks,
    getTasksByStatusForUser
};
