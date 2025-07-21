import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/apiSlice";
import authSlice from "./slices/authSlice";
import themeSlice from "./slices/themeSlice";
import tenantSlice from "./slices/tenantSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    tenant: tenantSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [api.util.getRunningQueriesThunk.fulfilled],
        ignoredPaths: [api.reducerPath],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

if (import.meta.hot) {
  import.meta.hot.accept(
    ["./slices/authSlice", "./slices/themeSlice", "./slices/tenantSlice"],
    (modules) => {
      store.replaceReducer({
        auth: modules[0].default,
        theme: modules[1].default,
        tenant: modules[2].default,
      });
    }
  );
}
