import { axiosInstance } from "./index";

// ------------------- Add Comment -------------------
export const AddComment = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/comments/add", payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to add comment",
    };
  }
};

// ------------------- Get Comments by Task -------------------
export const GetCommentsByTask = async (taskId) => {
  try {
    const response = await axiosInstance.get(`/api/comments/task/${taskId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch comments",
    };
  }
};

// ------------------- Update Comment -------------------
export const UpdateComment = async (commentId, payload) => {
  try {
    const response = await axiosInstance.put(`/api/comments/${commentId}`, payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update comment",
    };
  }
};

// ------------------- Delete Comment -------------------
export const DeleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete comment",
    };
  }
};
