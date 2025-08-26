import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import buylistSlice from './slices/buylistSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    buylists: buylistSlice,
  },
});