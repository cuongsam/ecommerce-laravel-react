import axios from 'axios';

// ✅ Base URL từ environment variable hoặc fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT || 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false 
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('📤 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasToken: !!token
        });
        
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ✅ Response Interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        console.log('📥 API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        // Chỉ xử lý lỗi từ API của chúng ta
        const isOurAPI = error.config?.url?.includes('api');
        
        if (!isOurAPI) {
            return Promise.reject(error);
        }

        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const isAuthPage = ['/login', '/register'].some(path => 
                currentPath.includes(path)
            );
            
            if (!isAuthPage) {
                console.log('🔐 Session expired, redirecting to login...');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                
                // Redirect với message
                setTimeout(() => {
                    window.location.href = '/login?session_expired=true';
                }, 500);
            }
        }

        // Handle 422 Validation Errors
        if (error.response?.status === 422) {
            console.log('⚠️ Validation errors:', error.response.data.errors);
        }

        return Promise.reject(error);
    }
);

export default api;