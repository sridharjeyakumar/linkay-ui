import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ekycReducer from '../features/ekyc/ekycSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ekyc: ekycReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
