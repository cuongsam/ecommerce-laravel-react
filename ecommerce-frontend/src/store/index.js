import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from '../hooks/userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  }
});

export default store;