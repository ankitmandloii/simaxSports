import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAddProductOpen: false,
    isChangeProductOpen: false,
    editingProductIndex: null,
    isAddingProduct: false,
    isAddNamesPopupOpen: false
};

const productPopupSlice = createSlice({
    name: 'productPopup',
    initialState,
    reducers: {
        openAddProduct: (state) => {
            state.isAddProductOpen = true;
            state.isAddingProduct = true;
            state.editingProductIndex = null;
        },
        openChangeProduct: (state, action) => {
            console.log("======actionnnn", action.payload)
            state.isChangeProductOpen = true;
            state.isAddingProduct = action.payload.isAdd;
            state.editingProductIndex = action.payload.index ?? null;
        },
        closeAddProduct: (state) => {
            state.isAddProductOpen = false;

            // state.isAddingProduct = false;
            state.editingProductIndex = null;
        },
        closeChangeProduct: (state) => {
            state.isChangeProductOpen = false;
            state.isAddingProduct = false;
            state.editingProductIndex = null;
        },
        resetProductPopup: (state) => {
            return initialState;
        },
        openAddNamesPopup: (state) => {
            state.isAddNamesPopupOpen = true;
        },
        closeAddNamesPopup: (state) => {
            state.isAddNamesPopupOpen = false;
        }
    },
});

export const {
    openAddProduct,
    openChangeProduct,
    closeAddProduct,
    closeChangeProduct,
    resetProductPopup,
    openAddNamesPopup,
    closeAddNamesPopup
} = productPopupSlice.actions;

export default productPopupSlice.reducer;