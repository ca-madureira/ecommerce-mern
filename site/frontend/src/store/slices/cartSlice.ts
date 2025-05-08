import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API from "../../services/cartAPI";

interface ProductCart {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
}

interface CartItem {
    product: ProductCart;
    quantity: number;
    size: string;
    idItem: string;
}

interface CartState {
    cart: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    updatingItemId: string | null;
    itemErrors: Record<string, string>;
}

const initialState: CartState = {
    cart: [],
    status: 'idle',
    error: null,
    updatingItemId: null,
    itemErrors: {},
};

// Fetch cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.error || err.message);
    }
});

// Add item
export const addItemToCart = createAsyncThunk(
    'cart/addItem',
    async ({ productId, quantity, size }: { productId: string; quantity: number; size?: string }, { rejectWithValue }) => {
        try {
            const response = await API.post("/add", { productId, quantity, size });
            return response.data.cart;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// Remove item
export const removeItemFromCart = createAsyncThunk(
    'cart/removeItem',
    async (itemId: string, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/${itemId}`);
            return { removedItemId: itemId };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

// Update quantity
export const updateItemQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ idItem, operation }: { idItem: string; operation: 'increment' | 'decrement' }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/${idItem}`, { operation });
            return { idItem, operation };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateQuantityOptimistic: (state, action: PayloadAction<{ idItem: string; operation: 'increment' | 'decrement' }>) => {
            const { idItem, operation } = action.payload;
            const itemIndex = state.cart.findIndex(item => item.idItem === idItem);

            if (itemIndex !== -1) {
                const item = state.cart[itemIndex];
                let newQuantity = operation === 'increment' ? item.quantity + 1 : item.quantity - 1;

                if (newQuantity < 1) {
                    newQuantity = 1;
                }

                state.cart[itemIndex] = {
                    ...item,
                    quantity: newQuantity
                };
            }
        },
        setItemUpdating: (state, action: PayloadAction<string | null>) => {
            state.updatingItemId = action.payload;
        },
        setItemError: (state, action: PayloadAction<{ idItem: string; error: string }>) => {
            const { idItem, error } = action.payload;
            state.itemErrors = { ...state.itemErrors, [idItem]: error };
        },
        clearItemError: (state, action: PayloadAction<string>) => {
            const idItem = action.payload;
            const { [idItem]: _, ...rest } = state.itemErrors; // Remove a propriedade do erro
            state.itemErrors = rest;
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const payload = action.payload;

                if (payload && Array.isArray(payload.items)) {
                    state.cart = payload.items.map((item: any) => ({
                        product: item.productId,
                        quantity: item.quantity,
                        size: item.size,
                        idItem: item._id
                    }));
                } else {
                    state.cart = [];
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Falha ao carregar carrinho';
            })

            // ADD
            .addCase(addItemToCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const payload = action.payload;

                if (payload && Array.isArray(payload.items)) {
                    state.cart = payload.items.map((item: any) => ({
                        product: item.productId,
                        quantity: item.quantity,
                        size: item.size,
                        idItem: item._id
                    }));
                } else {
                    state.cart = [];
                }
            })
            .addCase(addItemToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Falha ao adicionar item';
            })

            // REMOVE
            .addCase(removeItemFromCart.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeItemFromCart.fulfilled, (state, action: PayloadAction<{ removedItemId: string }>) => {
                state.status = 'succeeded';
                state.cart = state.cart.filter(item => item.idItem !== action.payload.removedItemId);
            })
            .addCase(removeItemFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Falha ao remover item';
            })

            // UPDATE QUANTITY
            .addCase(updateItemQuantity.pending, (state, action) => {
                state.updatingItemId = action.meta.arg.idItem;
                state.itemErrors = { ...state.itemErrors }; // Preserva erros existentes
            })
            .addCase(updateItemQuantity.fulfilled, (state, action) => {
                state.updatingItemId = null;
                state.itemErrors = { ...state.itemErrors }; // Mantém outros erros
            })
            .addCase(updateItemQuantity.rejected, (state, action) => {
                state.updatingItemId = null;
                const idItem = action.meta.arg.idItem;
                const error = action.payload as string || 'Falha ao atualizar quantidade';
                state.itemErrors = { ...state.itemErrors, [idItem]: error };
            });
    }
});

export const { updateQuantityOptimistic, setItemUpdating, setItemError, clearItemError } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartStatus = (state: { cart: CartState }) => state.cart.status;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartItemCount = (state: { cart: CartState }) =>
    Array.isArray(state.cart.cart)
        ? state.cart.cart.reduce((total, item) => total + item.quantity, 0)
        : 0;
export const selectUpdatingItemId = (state: { cart: CartState }) => state.cart.updatingItemId;
export const selectItemErrors = (state: { cart: CartState }) => state.cart.itemErrors;

export const selectCartItemById = (state: { cart: CartState }, idItem: string) => {
    const item = state.cart.cart.find(item => item.idItem === idItem);
    return item ? item.quantity : 0;
};
