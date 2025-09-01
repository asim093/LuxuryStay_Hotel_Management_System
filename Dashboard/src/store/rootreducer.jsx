import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/user-slice";

const rootReducer = combineReducers({
    user: userReducer,
});

export default rootReducer;