// src/services/dashboardService.js
import axios from "axios";

// Base URL cho tất cả API dashboard
const API_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/admin/dashboard";

// 🟢 Lấy dữ liệu tổng quan (tổng booking, revenue, reviews, invoices...)
export const getDashboardData = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// 🟢 Lấy top N khu cắm trại theo số lượt đặt
export const getTopCampingSites = async (year, limit = 6) => {
  const res = await axios.get(`${API_URL}/top-camping-sites`, {
    params: { year, limit },
  });
  return res.data;
};

// 🟢 Lấy doanh thu & số booking theo từng tháng trong năm
export const getMonthlyRevenue = async (year) => {
  const res = await axios.get(`${API_URL}/monthly-revenue`, {
    params: { year },
  });
  return res.data;
};

// 🟢 Lấy top 5 user có nhiều booking nhất tháng trước
export const getTopUsers = async () => {
  const res = await axios.get(`${API_URL}/top-users`);
  return res.data;
};

// 🟢 Lấy 5 hóa đơn mới nhất
export const getLatestInvoices = (limit = 5) =>
  axios
    .get(`${API_URL}/latest-invoices`, {
      params: { limit },
    })
    .then(res => res.data);
