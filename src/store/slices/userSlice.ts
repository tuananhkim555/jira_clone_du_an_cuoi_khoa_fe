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
      console.log('Setting tempUser in userSlice:', action.payload);
      state.tempUser = action.payload;
    },
    clearTempUser: (state) => {
      console.log('Clearing tempUser in userSlice');
      state.tempUser = null;
    },
  },
});

export const { setTempUser, clearTempUser } = userSlice.actions;
export default userSlice.reducer;
