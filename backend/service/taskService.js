const transporter = require("../config/mail");
const path = require("path");
const upload = require("../config/multer");
const { User, Task, Comment, TaskAssignee, Attachment,ActivityLog } = require("../models");
const { Op } = require("sequelize");
const Module = require("module");
const logActivity = require("../config/logActivity");

class TaskService {
  // ------------------- Add Task -------------------
  static async addTask(data, files, currentUser) {
    const { title, description, status, dueDate, assignedTo } = data;

    // Normalize assignedTo into an array of integers
    let assigneeIds = [];
    if (assignedTo) {
      if (typeof assignedTo === "string") {
        try {
          assigneeIds = JSON.parse(assignedTo);
        } catch {
          assigneeIds = [parseInt(assignedTo, 10)];
        }
      } else if (Array.isArray(assignedTo)) {
        assigneeIds = assignedTo.map((id) => parseInt(id, 10));
      } else {
        assigneeIds = [parseInt(assignedTo, 10)];
      }
    }

    // Only admin can assign tasks to multiple users
    if (currentUser.role !== "admin" && assigneeIds.length > 1) {
      throw new Error("Access denied. Users can only assign tasks to themselves.");
    }

    // Create the task
    const newTask = await Task.create({
      title,
      description,
      status,
      dueDate,
      userId: currentUser.id,
    });

    // Handle file attachments
    if (files?.length > 0) {
      const attachmentsData = files.map(file => ({
        taskId: newTask.id,
        filename: file.originalname,
        filepath: `/uploads/${file.filename}`,
      }));
      await Attachment.bulkCreate(attachmentsData);
    }

    // Handle assignees
    if (assigneeIds.length > 0) {
      if (currentUser.role === "admin") {
        await newTask.addAssignees(assigneeIds);
      } else {
        if (assigneeIds.includes(currentUser.id)) {
          await newTask.addAssignees([currentUser.id]);
        } else {
          throw new Error("Users can only assign tasks to themselves");
        }
      }
    } else {
      // Default: assign to self
      await newTask.addAssignees([currentUser.id]);
    }

    // Fetch with relationships
    const taskWithAssignees = await Task.findByPk(newTask.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignees", attributes: ["id", "name", "email"] },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
        { 
          model: Comment, 
          as: "comments",
          attributes: ["id", "text", "createdAt"], 
          include: [
            { model: User, as: "author", attributes: ["id", "name", "email"] }
          ]
        },
      ],
    });
   // 🔹 Log activity (task created)
    try{
        await logActivity({
  userId: currentUser.id,
  taskId: taskWithAssignees.id,
  action: "TASK_ADDED",
  message: `${currentUser?.name || "User"} (id:${currentUser.id}) created task "${taskWithAssignees.title}".`,
});
    }
    catch(err){
      console.error("Logging activity in create task failed:", err);
    }


    // Send email notifications
    for (const user of taskWithAssignees.assignees) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `New Task Assigned: ${title}`,
        text: `
          Hello ${user.name},

           You have been assigned a new task.

           Title: ${title}
           Description: ${description}
           Due Date: ${dueDate}
           Status: ${status || "pending"}

           Please check your dashboard for more details.
          `,
          };
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error("Email error:", err);
      });
    }

    return taskWithAssignees;
  }

  
  // ------------------- Update Task -------------------
  static async updateTask(taskId, data, currentUser) {
    const { title, description, status, dueDate, assignedTo } = data;
    const task = await Task.findByPk(taskId, {
      include: [{ model: User, as: "assignees", attributes: ["id", "name", "email"] }],
    });

    if (!task) throw new Error("Task not found");

    // Only creator or admin can update
    if (currentUser.id !== task.userId && currentUser.role !== "admin") {
      throw new Error("Forbidden");
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    await task.save();

    // Update assignees if admin
    if (currentUser.role === "admin" && assignedTo) {
      let assignees = [];
      if (Array.isArray(assignedTo)) assignees = assignedTo;
      else if (typeof assignedTo === "string") {
        try { assignees = JSON.parse(assignedTo); } catch { assignees = []; }
      }
      assignees = assignees.map(id => Number(id)).filter(Boolean);
      await task.setAssignees(assignees);
    }

    // 🔹 Log activity (task updated)
    try{
      await logActivity({
  userId: currentUser.id,
  taskId: task.id,
  action: "TASK_UPDATED",
  message: `${currentUser?.name || "User"} (id:${currentUser.id}) updated task "${task.title}".`,
});
    }
    catch(err){
      console.error("Logging activity in update task failed:", err);
    }

    return task;
  }

  // ------------------- Delete Task -------------------
  static async deleteTask(taskId, currentUser) {
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error("Task not found");

    // Only creator or admin can delete
    if (currentUser.id !== task.userId && currentUser.role !== "admin") {
      throw new Error("Forbidden");
    }
    const title = task.title;
    await task.destroy();
    // 🔹 Log activity (task deleted)
   try{
      await logActivity({
        userId: currentUser.id,
        taskId: task.id,
        action: "TASK_DELETED",
        message: `${currentUser?.name || "User"} (id:${currentUser.id}) deleted task "${title}".`,
      });
    }catch(err){
      console.error("Logging activity in delete task failed:", err);
    }

    return { message: "Task deleted successfully" };
  }

  // ------------------- Get All Tasks -------------------
static async getAllTasks(currentUser) {
  let tasks;

  if (currentUser.role === "admin") {
    // Admin: fetch all tasks
    tasks = await Task.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignees", attributes: ["id", "name", "email"] },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
      ],
      order: [["createdAt", "DESC"]],
    });
  } else {
    tasks = await Task.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        {
          model: User,
          as: "assignees",
          attributes: ["id", "name", "email"],
          required: false, // include tasks even if user is not assigned
        },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
      ],
      where: {
        [Op.or]: [
          { userId: currentUser.id },            
          { "$assignees.id$": currentUser.id }, 
        ],
      },
      distinct: true,
      order: [["createdAt", "DESC"]],
    });
  }

  return tasks;
}


  // ------------------- Get Tasks by Status (for User) -------------------
  static async getTasksByStatusForUser(status, currentUser) {
    const userId = currentUser.id;
    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const tasks = await Task.findAll({
      where: { status },
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        {
          model: User,
          as: "assignees",
          attributes: ["id", "name", "email"],
          where: { id: userId },
          required: false,
        },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "text", "createdAt"],
          include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
        },
      ],
    });

    return tasks.filter(
      task => task.userId === userId || (task.assignees && task.assignees.length > 0)
    );
  }

  // ------------------- Get Tasks by Assignee (Admin only) -------------------
  static async getTasksByAssignee(assigneeId, currentUser) {
    if (currentUser.role !== "admin") {
      throw new Error("Forbidden");
    }

    return await Task.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignees", where: { id: assigneeId }, attributes: ["id", "name", "email"] },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
      ],
    });
  }

  // ------------------- Get All Tasks by Logged-In User -------------------
  static async getAllTasksByUser(currentUser) {
    const userId = currentUser.id;

    const tasks = await Task.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignees", attributes: ["id", "name", "email"], where: { id: userId }, required: false },
        { model: Attachment, as: "attachments", attributes: ["id", "filename", "filepath"] },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "text", "createdAt"],
          include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
        },
      ],
    });

    return tasks.filter(
      task => task.userId === userId || (task.assignees && task.assignees.length > 0)
    );
  }
}



module.exports = TaskService;