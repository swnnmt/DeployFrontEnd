import axios from "axios";

const API_BASE_URL = "https://semiopen-felicia-unsimular.ngrok-free.dev/api/v1/admin/partners";

/**
 * Lấy danh sách partner đang chờ duyệt (phân trang)
 * @param {number} page 
 * @param {number} size 
 * @returns {Promise<Page<PartnerResponse>>}
 */
export const getPendingPartners = async (page = 0, size = 10) => {
  const response = await axios.get(`${API_BASE_URL}/pending`, {
    params: { page, size },
  });
  return response.data;
};

/**
 * Lấy chi tiết 1 partner theo ID
 * @param {string} partnerId 
 * @returns {Promise<PartnerResponse>}
 */
export const getPartnerDetail = async (partnerId) => {
  const response = await axios.get(`${API_BASE_URL}/${partnerId}`);
  return response.data;
};

/**
 * Phê duyệt partner (approve)
 * @param {string} partnerId 
 */
export const approvePartner = async (partnerId) => {
  const response = await axios.post(`${API_BASE_URL}/${partnerId}/approve`);
  return response.data;
};

/**
 * Từ chối partner (reject)
 * @param {string} partnerId 
 */
export const rejectPartner = async (partnerId) => {
  const response = await axios.post(`${API_BASE_URL}/${partnerId}/reject`);
  return response.data;
};
