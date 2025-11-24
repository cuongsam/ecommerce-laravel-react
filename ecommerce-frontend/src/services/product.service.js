import api from './api';

const productService = {
    // Lấy danh sách sản phẩm với filters
    getAllProducts: async (params = {}) => {
        try {
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    // Lấy sản phẩm nổi bật
    getFeaturedProducts: async () => {
        try {
            const response = await api.get('/products/featured');
            return response.data;
        } catch (error) {
            console.error('Error fetching featured products:', error);
            throw error;
        }
    },

    // Lấy reviews của sản phẩm
    getProductReviews: async (productId) => {
        try {
            const response = await api.get(`/products/${productId}/reviews`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            throw error;
        }
    },

    // Tìm kiếm sản phẩm
    searchProducts: async (searchTerm, filters = {}) => {
        try {
            const params = {
                search: searchTerm,
                ...filters
            };
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
};

export default productService;
