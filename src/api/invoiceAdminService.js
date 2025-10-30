import axios from "axios";

const API_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/admin/invoices";

// Lấy danh sách hóa đơn phân trang
export const getAllInvoices = async (page = 0, size = 10) => {
  const res = await axios.get(`${API_URL}?page=${page}&size=${size}`);
  return res.data;
};

// Tìm kiếm hóa đơn (bookingId, start, end, phân trang)
export const searchInvoices = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await axios.get(`${API_URL}/search?${query}`);
  return res.data;
};

// Lấy chi tiết hóa đơn theo ID
export const getInvoiceById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Cập nhật trạng thái hóa đơn
export const updateInvoiceStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/${id}/status?status=${status}`);
  return res.data;
};
