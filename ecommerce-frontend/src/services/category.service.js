import api from './api';

export const categoryService = {
    // Lấy tất cả categories
    getCategories: async () => {
        return await api.get('/categories');
    },

    // Lấy chi tiết category
    getCategory: async (id) => {
        return await api.get(`/categories/${id}`);
    }
};