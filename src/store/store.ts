import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ekycReducer from '../features/ekyc/ekycSlice';
import assetReducer from '../features/assets/assetSlice';
import tokenizationReducer from '../features/tokenization/tokenizationSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    ekyc:         ekycReducer,
    assets:       assetReducer,
    tokenization: tokenizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
