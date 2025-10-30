import axios from "axios";

const API_BASE_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/payments";

export const payBooking = async (paymentData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API_BASE_URL}/booking`, paymentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Thanh toán thành công:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// export const payBooking = async (paymentReq) => {
//   console.log("Mock payBooking request:", paymentReq);
//   return {
//     id: "PAY_FAKE_001",
//     amount: 300000,
//     paymentStatus: "PENDING",
//     qrCode:
//       "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ThanhToanCampverse"
//   };
// };
