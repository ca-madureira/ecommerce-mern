import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './slices/searchSlice'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;