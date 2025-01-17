import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import adminReducer  from "./adminSlice"

const store = configureStore({
    reducer: {
        users: userReducer,
        admin: adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
