import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductCart {
    _id: string;
    name: string;
    description: string;
    image: string;
}

interface CartItem {
    product: ProductCart;
    quantity: number;
    size: string;
}

interface Cart {
    cart: CartItem[];
}

const initialState: Cart = {
    cart: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const index = state.cart.findIndex(
                (item) =>
                    item.product._id === action.payload.product._id &&
                    item.size === action.payload.size
            );

            if (index !== -1) {
                state.cart[index].quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
        },

        updateCart: (state, action: PayloadAction<CartItem>) => {
            const index = state.cart.findIndex(
                (item) =>
                    item.product._id === action.payload.product._id &&
                    item.size === action.payload.size
            );

            if (index !== -1) {
                state.cart[index] = action.payload;
            }
        },

        removeFromCart: (state, action: PayloadAction<{ _id: string; size: string }>) => {
            state.cart = state.cart.filter(
                (item) =>
                    !(item.product._id === action.payload._id && item.size === action.payload.size)
            );
        },
    }
});

export const { addToCart, updateCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
