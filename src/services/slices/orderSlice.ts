import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type OrderState = {
  order: TOrder | null;
  orders: TOrder[];
  isLoading: boolean;
  isOrdersLoading: boolean;
  error: string | null;
  ordersError: string | null;
};

const initialState: OrderState = {
  order: null,
  orders: [],
  isLoading: false,
  isOrdersLoading: false,
  error: null,
  ordersError: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  return await getOrdersApi();
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })

      .addCase(fetchOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.ordersError =
          action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
