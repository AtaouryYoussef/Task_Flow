import { configureStore } from '@reduxjs/toolkit';
import { setAuthToken } from './api/axios';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

setAuthToken(store.getState().auth.token);

store.subscribe(() => {
  setAuthToken(store.getState().auth.token);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;