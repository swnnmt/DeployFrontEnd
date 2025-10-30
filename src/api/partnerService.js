import axios from "axios";

const API_BASE_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/partner";

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
