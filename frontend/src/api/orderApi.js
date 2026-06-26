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

/**
 * Lấy danh sách đơn hàng được đặt của một người bán
 * @param {number} sellerId - ID người bán
 * @returns {Promise}
 */
export const getSellerOrders = async (sellerId) => {
  const response = await apiClient.get(`/api/orders/seller?sellerId=${sellerId}`);
  return response.data;
};

/**
 * Phê duyệt đơn hàng (người bán đồng ý bán)
 * @param {number|string} orderId - ID đơn hàng
 * @param {number} sellerId - ID người bán
 * @returns {Promise}
 */
export const acceptOrder = async (orderId, sellerId) => {
  const response = await apiClient.put(`/api/orders/${orderId}/accept?sellerId=${sellerId}`);
  return response.data;
};

/**
 * Từ chối đơn hàng (người bán từ chối bán)
 * @param {number|string} orderId - ID đơn hàng
 * @param {number} sellerId - ID người bán
 * @returns {Promise}
 */
export const rejectOrder = async (orderId, sellerId) => {
  const response = await apiClient.put(`/api/orders/${orderId}/reject?sellerId=${sellerId}`);
  return response.data;
};

/**
 * Xác nhận đã nhận hàng (Người mua)
 * @param {number|string} orderId - ID đơn hàng
 * @param {number} userId - ID người mua
 * @returns {Promise}
 */
export const confirmReceipt = async (orderId, userId) => {
  const response = await apiClient.put(`/api/orders/${orderId}/confirm-receipt?userId=${userId}`);
  return response.data;
};

/**
 * Yêu cầu hoàn tiền (Người mua)
 * @param {number|string} orderId - ID đơn hàng
 * @param {number} userId - ID người mua
 * @returns {Promise}
 */
export const requestRefund = async (orderId, userId) => {
  const response = await apiClient.put(`/api/orders/${orderId}/request-refund?userId=${userId}`);
  return response.data;
};

/**
 * Người bán xử lý yêu cầu hoàn tiền (chấp nhận/từ chối)
 * @param {number|string} orderId - ID đơn hàng
 * @param {number} sellerId - ID người bán
 * @param {string} action - 'approve' hoặc 'reject'
 * @returns {Promise}
 */
export const sellerHandleRefund = async (orderId, sellerId, action) => {
  const response = await apiClient.put(`/api/orders/${orderId}/seller-handle-refund?sellerId=${sellerId}&action=${action}`);
  return response.data;
};

/**
 * Admin phân xử hoàn tiền (duyệt/hoàn tất cưỡng chế)
 * @param {number|string} orderId - ID đơn hàng
 * @param {string} action - 'approve' hoặc 'complete'
 * @returns {Promise}
 */
export const adminHandleRefund = async (orderId, action) => {
  const response = await apiClient.put(`/api/orders/${orderId}/admin-handle-refund?action=${action}`);
  return response.data;
};


