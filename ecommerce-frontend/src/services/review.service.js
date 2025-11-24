import api from './api';

const reviewService = {
    // Lấy tất cả reviews với filters
    getAllReviews: async (params = {}) => {
        try {
            const response = await api.get('/reviews', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Lấy statistics của reviews
    getReviewStatistics: async () => {
        try {
            const response = await api.get('/reviews/statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching review statistics:', error);
            throw error;
        }
    },

    // Lấy reviews của 1 sản phẩm cụ thể
    getProductReviews: async (productId, params = {}) => {
        try {
            const response = await api.get(`/products/${productId}/reviews`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    },

    // Tạo review mới (cần authentication)
    createReview: async (productId, reviewData) => {
        try {
            const response = await api.post(`/products/${productId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    }
};

export default reviewService;
