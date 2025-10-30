import axios from "axios";

const API_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/bookings";

export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(API_URL, bookingData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // { bookingId, status }
  } catch (error) {
    console.error("Lỗi tạo booking:", error.response?.data || error.message);
    throw error;
  }
};
