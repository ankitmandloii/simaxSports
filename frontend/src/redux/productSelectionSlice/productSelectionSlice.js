// store/productSelectionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: {

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
    },
    resetProducts(state, action) {
      const selectedProducts = action.payload;
      if (!selectedProducts || selectedProducts.length === 0) return;

      // Get the IDs of the selected products
      console.log("resetProducts called with:", selectedProducts);
      const selectedIds = selectedProducts.flatMap(p => {
        const ids = [p?.id.split("/").reverse()[0]];
        if (p?.addedColors && p.addedColors.length > 0) {
          p.addedColors.forEach(variantProduct => {
            const id = variantProduct?.variant?.id?.split("/").reverse()[0];
            if (id) {
              ids.push(id);
            }
          });
        }
        return ids
      }
      )

      console.log(selectedIds, "selectedIds");


      // Keep only products whose id is in selectedIds
      state.products = Object.fromEntries(
        Object.entries(state.products).filter(([productId]) =>
          selectedIds.includes(productId)
        )
      );
      // state.products = {};
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
  setCollegiateLicense,
  resetProducts
} = productSelectionSlice.actions;

export default productSelectionSlice.reducer;
