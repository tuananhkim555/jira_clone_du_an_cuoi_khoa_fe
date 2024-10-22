import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
}

interface UserState {
  tempUser: User | null;
}

const initialState: UserState = {
  tempUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTempUser: (state, action: PayloadAction<User>) => {
      state.tempUser = action.payload;
    },
    clearTempUser: (state) => {
      state.tempUser = null;
    },
  },
});

export const { setTempUser, clearTempUser } = userSlice.actions;
export default userSlice.reducer;
