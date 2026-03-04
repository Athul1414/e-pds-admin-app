// app/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/authSlice';
import printerReducer from '@/redux/printerSlice';
import notificationsReducer from '@/redux/notificationsSlice';
import cartReducer from '@/redux/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    printer: printerReducer,
    notifications: notificationsReducer,
    cart: cartReducer,
  },
});

export default store;
