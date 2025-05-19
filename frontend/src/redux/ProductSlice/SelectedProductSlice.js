// src/store/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedProductSlice = createSlice({
  name: 'products',
  initialState: {
    selectedProducts: [],
  },
  reducers: {
    setSelectedProducts(state, action) {
      state.selectedProducts = action.payload;
    },
    addProduct(state, action) {
      state.selectedProducts.push(action.payload);
    },
    updateProduct(state, action) {
      const { index, product } = action.payload;
      state.selectedProducts[index] = product;
    },
    deleteProduct(state, action) {
      state.selectedProducts = state.selectedProducts.filter(
        (_, idx) => idx !== action.payload
      );
    },
  },
});

export const { setSelectedProducts, addProduct, updateProduct, deleteProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;
