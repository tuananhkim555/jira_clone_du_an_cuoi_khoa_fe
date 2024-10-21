import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Định nghĩa kiểu dữ liệu cho user
interface User {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
}

// Định nghĩa kiểu dữ liệu cho state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Tạo initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Tạo auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Cấu hình persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Chỉ lưu trữ state của auth
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// Tạo store
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    // Thêm các reducer khác nếu cần
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Export các action
export const { setUser, clearUser } = authSlice.actions;

// Export kiểu dữ liệu cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
