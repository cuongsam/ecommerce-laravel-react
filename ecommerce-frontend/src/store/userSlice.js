// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';

// Async thunks
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userInfo: null, 
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.userInfo = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user_data');
            if (token) {
                state.token = token;
                state.isAuthenticated = true;
            }
            if (userData) {
                try {
                    state.userInfo = JSON.parse(userData);
                } catch (e) {
                    console.error('Failed to parse user data');
                }
            }
        }
    },
   extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data?.user;
                state.userInfo = action.payload.data?.user;  // ← THÊM
                state.token = action.payload.data?.token;
                if (state.token) {
                    localStorage.setItem('auth_token', state.token);
                    localStorage.setItem('user_data', JSON.stringify(state.userInfo));
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data?.user;
                state.userInfo = action.payload.data?.user;  // ← THÊM
                state.token = action.payload.data?.token;
                if (state.token) {
                    localStorage.setItem('auth_token', state.token);
                    localStorage.setItem('user_data', JSON.stringify(state.userInfo));
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, initializeAuth } = userSlice.actions;
export default userSlice.reducer;