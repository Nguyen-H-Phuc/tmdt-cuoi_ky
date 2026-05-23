import apiClient from './apiClient';

/**
 * Lấy danh sách đơn hàng đã mua của một người dùng
 * @param {number} buyerId - ID của người mua
 * @returns {Promise} - Trả về danh sách đơn hàng
 */
export const getBuyerOrders = async (buyerId) => {
  const response = await apiClient.get(`/api/orders/buyer?buyerId=${buyerId}`);
  return response.data;
};

/**
 * Hủy đơn hàng
 * @param {number|string} orderId - ID của đơn hàng cần hủy
 * @param {number} userId - ID của người thực hiện hủy đơn (để xác thực quyền sở hữu đơn hàng)
 * @returns {Promise} - Trả về thông tin đơn hàng sau khi hủy
 */
export const cancelOrder = async (orderId, userId) => {
  const response = await apiClient.put(`/api/orders/${orderId}/cancel?userId=${userId}`);
  return response.data;
};

/**
 * Gửi hoặc cập nhật đánh giá cho sản phẩm
 * @param {number} productId - ID sản phẩm được đánh giá
 * @param {number} userId - ID người đánh giá
 * @param {number} rating - Số sao đánh giá (1-5)
 * @param {string} content - Nhận xét đánh giá
 * @returns {Promise}
 */
export const submitReview = async (productId, userId, rating, content) => {
  const response = await apiClient.post('/api/reviews', {
    productId,
    userId,
    rating,
    content
  });
  return response.data;
};

/**
 * Kiểm tra điều kiện đánh giá sản phẩm của người dùng
 * @param {number} productId - ID sản phẩm
 * @param {number} userId - ID người dùng
 * @returns {Promise}
 */
export const checkReviewEligibility = async (productId, userId) => {
  const response = await apiClient.get(`/api/reviews/eligibility?productId=${productId}&userId=${userId}`);
  return response.data;
};

