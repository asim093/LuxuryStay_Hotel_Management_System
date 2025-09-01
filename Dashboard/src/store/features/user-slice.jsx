import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  isLogin: false,
  email: "",
  
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
      state.isLogin = true;
    },
    removeUser: (state) => {
      state.data = {};
      state.isLogin = false;
    },
    AddData: (state, action) => {
      state.data = action.payload;
    },
    RemoveData: (state, action) => {
      state.data = {};
    },
  },
});

export const { addUser, removeUser, AddData , RemoveData } = userSlice.actions;

export default userSlice.reducer;