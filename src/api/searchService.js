import axios from "axios";

const API_BASE_URL = "http://103.200.22.89:8080/api/v1/search";

export const searchCamping = async (payload) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/camping`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error searching camping:", error);
    throw error;
  }
};
