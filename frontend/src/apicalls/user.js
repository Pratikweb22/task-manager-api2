import { axiosInstance } from "./index";
// Register
export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (err) {
    // Clean error response
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

// Login
export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/currentuser");
    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/users/delete/${id}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    console.error("DeleteUser error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/all");
    return {
      success: true,
      data: response.data.data,
    };
  } catch (err) {
    console.error("GetAllUsers error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
};
