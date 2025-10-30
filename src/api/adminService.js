// src/services/UserService.js
import axios from "axios";

const API_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/admin";

// Lấy danh sách user theo role
export const getUsersByRole = (role, page = 0, size = 10) =>
  axios.get(`${API_URL}/list${role.toLowerCase()}s`, { params: { page, size } });

// Xem chi tiết user
export const getUserDetail = (id) =>
  axios.get(`${API_URL}/${id}`);

// Update user
export const updateUser = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

// Ban / Unban user
export const banUser = (id, ban) =>
  axios.put(`${API_URL}/${id}/ban`, null, { params: { ban } });
