import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  accessToken: string;
  tokenExpiration: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    checkTokenExpiration: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return;
      }

      if (state.user?.tokenExpiration) {
        if (Date.now() > state.user.tokenExpiration) {
          state.user = null;
          state.isAuthenticated = false;
          state.status = 'idle';
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    }
  },
});

export const { setUser, clearUser, setStatus } = authSlice.actions;
export default authSlice.reducer;
