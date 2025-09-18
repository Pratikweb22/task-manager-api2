import { axiosInstance } from "./index";

// ------------------- Add Task -------------------
export const AddTask = async (formData) => {
  try {
    const response = await axiosInstance.post("/api/tasks/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add task",
    };
  }
};

// ------------------- Update Task -------------------
export const UpdateTask = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/api/tasks/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update task",
    };
  }
};

// ------------------- Delete Task -------------------
export const DeleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/tasks/delete/${id}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete task",
    };
  }
};

// ------------------- Get All Tasks -------------------
export const GetAllTasks = async () => {
  try {
    const response = await axiosInstance.get("/api/tasks/all");
    return response.data.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch tasks",
    };
  }
};

// ------------------- Get Tasks By Status -------------------
export const GetTasksByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/status/${status}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch tasks by status",
    };
  }
};

// ------------------- Get Tasks By Assignee (Admin only) -------------------
export const GetTasksByAssignee = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/assignee/${userId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch tasks by assignee",
    };
  }
};

// ------------------- Get All Tasks For Logged-in User -------------------
export const GetAllTasksByUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/user/${id}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch user tasks",
    };
  }
};
