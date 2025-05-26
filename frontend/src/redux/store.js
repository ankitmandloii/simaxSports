// store.js
import { configureStore } from '@reduxjs/toolkit';
import TextFrontendDesignSlice from "./FrontendDesign/TextFrontendDesignSlice.js"
import ProductReducer from './ProductSlice/ProductSlice.js'
import collectionReducer from './ProductSlice/CollectionSlice.js'
import selectedProductsReducer from './ProductSlice/SelectedProductSlice.js'
import ContinueDesignReducer from './ContinueDesign/ContinueDesignSlice.js'
// import TextBackendDesignSlice from "./BackendDesign/TextBackendDesignSlice.js";

export const store = configureStore({
  reducer: {
    // canvas: canvasReducer,
    TextFrontendDesignSlice: TextFrontendDesignSlice,
    products: ProductReducer,
    collections: collectionReducer,
    selectedProducts: selectedProductsReducer,
    ContinueDesign: ContinueDesignReducer,
    // TextBackendDesignSlice: TextBackendDesignSlice
  },
});
