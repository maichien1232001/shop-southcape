import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'staff' | 'admin' | 'superadmin';
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setCredentials, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;
