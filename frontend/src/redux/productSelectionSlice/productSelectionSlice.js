// store/productSelectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: {
    // example:
    // "7434523443334": {
    //   name: "Comfort Colors 1467 - Black",
    //   color: "Black",
    //   imgurl: "...",
    //   selections: {
    //     S: 2,
    //     M: 1,
    //     XL: 0
    //   }
    // }
  },
  CollegiateLicense: false

};

const productSelectionSlice = createSlice({
  name: 'productSelection',
  initialState,
  reducers: {
    addProduct(state, action) {
      const { id, name, color, imgurl, sizes, title, allImages, allVariants, variantId, price, sku, inventory_quantity } = action.payload;
      if (!state.products[id]) {
        state.products[id] = {
          name,
          title,
          color,
          imgurl,
          selections: {},
          allVariants,
          allImages,
          variantId,
          price,
          sku,
          inventory_quantity,
          sizes
        };
        // sizes.forEach(size => {
        //   state.products[id].selections[size.size] = 0;
        // });
      }
    },
    updateSizeQuantity(state, action) {
      const { productId, size, quantity } = action.payload;
      if (state.products[productId]) {
        state.products[productId].selections[size] = quantity;
      }
    },
    incrementSize(state, action) {
      const { productId, size } = action.payload;
      if (state.products[productId]) {
        state.products[productId].selections[size]++;
      }
    },
    decrementSize(state, action) {
      const { productId, size } = action.payload;
      if (state.products[productId] && state.products[productId].selections[size] > 0) {
        state.products[productId].selections[size]--;
      }
    },
    removeProduct(state, action) {
      delete state.products[action.payload];
    },
    resetSelections(state, action) {
      const { productId } = action.payload;
      if (state.products[productId]) {
        Object.keys(state.products[productId].selections).forEach(size => {
          state.products[productId].selections[size] = 0;
        });
      }
    },
    setCollegiateLicense(state, action) {
      state.CollegiateLicense = action.payload;
    }
  }
});

export const {
  addProduct,
  updateSizeQuantity,
  incrementSize,
  decrementSize,
  removeProduct,
  resetSelections,
  setCollegiateLicense
} = productSelectionSlice.actions;

export default productSelectionSlice.reducer;
