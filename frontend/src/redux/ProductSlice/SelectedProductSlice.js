// src/store/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const selectedProductSlice = createSlice({
  name: 'selectedProducts',
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
    setActiveProduct(state, action) {
      state.activeProduct = action.payload;
    },
      restoreDesignSelectedProductSlice(state, action) {
      return { ...state, ...action.payload };
    },  
  },
});

export const {restoreDesignSelectedProductSlice, setSelectedProducts, addProduct, updateProduct, deleteProduct , setActiveProduct} = selectedProductSlice.actions;
export default selectedProductSlice.reducer;
