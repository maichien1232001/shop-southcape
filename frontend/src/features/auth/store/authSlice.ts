import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../../constants/storage.constant';

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
}

const getSavedToken = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    return null;
  }
};

const getSavedUser = (): UserInfo | null => {
  try {
    const saved = localStorage.getItem('southcape_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const savedToken = getSavedToken();
const savedUser = getSavedUser();

const initialState: AuthState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
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
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem('southcape_user', JSON.stringify(user));
      } catch (e) {
        console.error('Lỗi lưu thông tin xác thực:', e);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem('southcape_user');
      } catch (e) {
        console.error('Lỗi xóa thông tin xác thực:', e);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
