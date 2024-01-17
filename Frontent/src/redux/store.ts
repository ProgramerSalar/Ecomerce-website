import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducers/userReducer";
import { productAPI } from "./api/productAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [userReducer.name]: userReducer.reducer,

  },
  // middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware],
  // middleware: (mid) => mid().concat(userAPI.middleware),
  middleware: (mid) => mid().concat([userAPI.middleware, productAPI.middleware])
});

