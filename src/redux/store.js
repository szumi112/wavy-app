import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./apiData";

export const store = configureStore({
  reducer: {
    api: dataReducer,
  },
});
