import axios from "axios";

const API_BASE_URL = "http://103.200.22.89:8080/api/v1/camping-sites";
const API_BASE_URL2 = "http://103.200.22.89:8080/api/v1/camping";

export const getCampingSites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campinginfor`);
    console.log("Camping sites fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching camping sites:", error);
    throw error;
  }
};

export const getCampingInforById = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL2}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching camping info:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};
