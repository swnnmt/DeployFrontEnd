import axios from "axios";

const API_BASE_URL = "http://103.200.22.89:8080/api/v1/partner";

export const registerPartner = async (partnerData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register`, partnerData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Register partner success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ Register partner failed:", error.response.data);
      throw error.response.data;
    } else {
      console.error("❌ Error:", error.message);
      throw error;
    }
  }
};
