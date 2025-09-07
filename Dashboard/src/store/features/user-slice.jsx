import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  isLogin: false,
  email: "",
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.data = action.payload;
      state.isLogin = true;
      // Store token in Redux state
      if (action.payload.user && action.payload.user.token) {
        state.token = action.payload.user.token;
      }
    },
    removeUser: (state) => {
      state.data = {};
      state.isLogin = false;
      state.token = null;
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