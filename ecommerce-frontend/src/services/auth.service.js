import api from './api';

export const authService = {
    // ✅ Đăng ký - Endpoint đúng
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    // ✅ Đăng nhập - Endpoint đúng
    login: async (credentials) => {
        return await api.post('/auth/login', credentials);
    },

    // ✅ Đăng xuất
    logout: async () => {
        return await api.post('/auth/logout');
    },

    // ✅ Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        return await api.get('/auth/me');
    },

    // ✅ Đổi mật khẩu
    changePassword: async (data) => {
        return await api.put('/auth/change-password', data);
    },

    // ✅ Cập nhật profile
    updateProfile: async (data) => {
        return await api.put('/auth/profile', data);
    },

    // ✅ Quên mật khẩu
    forgotPassword: async (email) => {
        return await api.post('/auth/forgot-password', { email });
    },

    // ✅ Reset mật khẩu
    resetPassword: async (data) => {
        return await api.post('/auth/reset-password', data);
    }
};