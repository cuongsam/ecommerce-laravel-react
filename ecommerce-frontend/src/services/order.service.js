import api from './api';

export const orderService = {
    // Lấy danh sách orders của user
    getOrders: async () => {
        return await api.get('/orders');
    },

    // Tạo order mới
    createOrder: async (orderData) => {
        return await api.post('/orders', orderData);
    },

    // Lấy chi tiết order
    getOrder: async (id) => {
        return await api.get(`/orders/${id}`);
    }
};