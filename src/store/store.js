import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import configuratoreReducer from "./configuratoreSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    configuratore: configuratoreReducer,
  },
});

export default store;
