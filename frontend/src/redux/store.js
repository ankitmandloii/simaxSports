// store.js
import { configureStore } from '@reduxjs/toolkit';
import TextFrontendDesignSlice from "./FrontendDesign/TextFrontendDesignSlice.js"
import ProductReducer from './ProductSlice/ProductSlice.js'
import collectionReducer from './ProductSlice/CollectionSlice.js'
import selectedProductsReducer from './ProductSlice/SelectedProductSlice.js'
import ContinueDesignReducer from './ContinueDesign/ContinueDesignSlice.js'
import canvasExportReducer from './CanvasExportDesign/canvasExportSlice.js'
import settingsReducer from './SettingsSlice/SettingsSlice.js'
import hoverReducer from './ProductSlice/HoverSlice.js'
import productSelectionReducer from './productSelectionSlice/productSelectionSlice.js';
// import TextBackendDesignSlice from "./BackendDesign/TextBackendDesignSlice.js";

export const store = configureStore({
  reducer: {
    // canvas: canvasReducer,
    TextFrontendDesignSlice: TextFrontendDesignSlice,
    products: ProductReducer,
    collections: collectionReducer,
    selectedProducts: selectedProductsReducer,
    ContinueDesign: ContinueDesignReducer,
    canvasExport: canvasExportReducer,
    settingsReducer: settingsReducer,
    hoverReducer:hoverReducer,
    productSelection: productSelectionReducer
    // TextBackendDesignSlice: TextBackendDesignSlice
  },
});
