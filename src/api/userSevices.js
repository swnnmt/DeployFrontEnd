import axios from "axios";

const API_BASE_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/user";
export const register = async (
  firstName,
  lastName,
  phoneNumber,
  address,
  department,
  email,
  gender,
  password,
  role
) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/register`, {
      firstName,
      lastName,
      phoneNumber,
      address,
      department,
      email,
      gender,
      password,
      role,
    });

    console.log("Register success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Register failed:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

export const activeAccount = async (otp) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/activate-account`, {
      params: { validOtp: otp }, // gửi OTP qua query param
    });

    console.log("Active account success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Active account failed:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

export const resendOTP = async (email) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/resend-otp`, { email });
    console.log("Resend OTP success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Resend OTP failed:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

export const updateProfile = async (
  firstName,
  lastName,
  phoneNumber,
  address,
  department,
  gender,
  avatarUrl
) => {
  try {
    const token = localStorage.getItem("token"); // hoặc Redux store nếu bạn đang lưu JWT

    const res = await axios.put(
      `${API_BASE_URL}/updateProfile`, // gợi ý endpoint đặt RESTful
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        department,
        gender,
        avatarUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Update profile success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Update profile failed:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    console.log("Forgot password success:", res.data);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("Forgot password failed:", error.response.data);
      throw error.response.data;
    } else {
      console.error("Error:", error.message);
      throw error;
    }
  }
};

export const verifyForgotOTP = async (email, otp) => {
  try {
    // Gọi API verify-forgot-password
    const res = await axios.post(`${API_BASE_URL}/verify-forgot-password`, {
      email,
      otp,
    });
    return res.data;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
};

export const changePassword = async (
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_BASE_URL}/change-password`,
      {
        // ✅ phải dùng đúng tên key theo backend DTO
        currentPassword: oldPassword,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    throw err;
  }
};
