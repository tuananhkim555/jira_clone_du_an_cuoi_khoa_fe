import { configureStore, createSlice } from "@reduxjs/toolkit";

// Tạo một slice đơn giản
const exampleSlice = createSlice({
  name: 'example',
  initialState: {},
  reducers: {
    exampleAction: (state, action) => {
      // Xử lý hành động ở đây
    },
  },
});

// Xuất reducer từ slice
const { reducer: exampleReducer } = exampleSlice;

// Cấu hình store với reducer
export const store = configureStore({
  reducer: {
    example: exampleReducer, // Thêm reducer vào store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
