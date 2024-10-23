import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: string;
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
  tokenExpiration: number;
}

// Định nghĩa kiểu dữ liệu cho state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Tạo initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('authToken'),
};

// Tạo auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      localStorage.setItem('authToken', action.payload.accessToken);
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    clearToken: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('authToken');
    },
    checkTokenExpiration: (state) => {
      if (state.user && state.user.tokenExpiration) {
        if (Date.now() > state.user.tokenExpiration) {
          state.user = null;
          state.isAuthenticated = false;
          state.token = null;
          localStorage.removeItem('authToken');
        }
      }
    },
  },
});

// Cấu hình persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserReducer = persistReducer(persistConfig, userReducer);


// Tạo store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Export các action
export const { setUser, clearUser, clearToken, checkTokenExpiration } = authSlice.actions;

// Export kiểu dữ liệu cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
