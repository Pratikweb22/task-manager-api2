import { axiosInstance } from "./index";


export const GetAllActivities = async () => {
  try {
    const response = await axiosInstance.get("/api/activity/all");
    return response.data;
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch activities",
    };
  }
};