import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore actions and paths that might have non-serializable values
        ignoredActions: ["api/executeQuery/fulfilled"],
        ignoredPaths: ["api.queries.readFile.data.blob"],
      },
    }).concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

export default store;
