import api from './api';

export const cartService = {
    // Lấy giỏ hàng
    getCart: async () => {
        return await api.get('/cart');
    },

    // Thêm sản phẩm vào giỏ
    addToCart: async (productId, quantity) => {
        return await api.post('/cart/items', {
            product_id: productId,
            quantity
        });
    },

    // Cập nhật số lượng
    updateCartItem: async (itemId, quantity) => {
        return await api.put(`/cart/items/${itemId}`, { quantity });
    },

    // Xóa sản phẩm khỏi giỏ
    removeFromCart: async (itemId) => {
        return await api.delete(`/cart/items/${itemId}`);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async () => {
        return await api.delete('/cart');
    }
};