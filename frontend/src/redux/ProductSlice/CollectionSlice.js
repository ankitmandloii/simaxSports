// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { createSelector } from '@reduxjs/toolkit';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export const fetchCollections = createAsyncThunk(
//   'collections/fetchCollections',
//   async ({ cursor, limit = 20 }) => {
//     const response = await fetch(`${BASE_URL}products/collectionList`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ limit, cursor }),
//     });

//     const data = await response.json();
//     return data.result;
//   }
// );

// const collectionSlice = createSlice({
//   name: "collections",
//   initialState: {
//     collections: [],
//     loading: false,
//     hasNextPage: false,
//     cursor: "",
//   },
//   reducers: {
//     resetCollections: (state) => {
//       state.collections = [];
//       state.cursor = "";
//       state.hasNextPage = false;
//     },
//     restoreDesignCollectionSlice(state, action) {
//       return { ...state, ...action.payload };
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCollections.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCollections.fulfilled, (state, action) => {
//         state.loading = false;

//         const { collections = [], pageInfo = {} } = action.payload;

//         const newCollections = collections.filter(
//           (newCol) =>
//             !state.collections.some((existing) => existing.id === newCol.id)
//         );

//         state.collections = [...state.collections, ...newCollections];
//         state.cursor = pageInfo.endCursor || "";
//         state.hasNextPage = pageInfo.hasNextPage ?? false;
//       })
//       .addCase(fetchCollections.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// // ============ MEMOIZED SELECTORS ============
// // Base selector
// const selectCollectionsState = (state) => state.collections;

// // Simple selectors
// export const selectCollections = (state) => state.collections.collections;
// export const selectLoading = (state) => state.collections.loading;
// export const selectHasNextPage = (state) => state.collections.hasNextPage;
// export const selectCursor = (state) => state.collections.cursor;

// // Memoized selector for brand collections
// export const selectBrandCollections = createSelector(
//   [selectCollections],
//   (collections) => {
//     return collections
//       .filter(collection =>
//         !collection.handle.includes('category') &&
//         !collection.handle.includes('subcategory')
//       )
//       .map(collection => ({
//         id: collection.id,
//         title: collection.title
//       }));
//   }
// );

// // Memoized selector for category collections
// export const selectCategoryCollections = createSelector(
//   [selectCollections],
//   (collections) => {
//     return collections
//       .filter(collection =>
//         collection.handle.includes('category') &&
//         !collection.handle.includes('subcategory')
//       )
//       .map(collection => ({
//         id: collection.id,
//         title: collection.title
//       }));
//   }
// );

// // Memoized selector for subcategory groups
// export const selectSubcategoryGroups = createSelector(
//   [selectCollections],
//   (collections) => {
//     const subcategoryGroups = {};

//     collections
//       .filter(collection => collection.handle.startsWith('subcategory-'))
//       .forEach(collection => {
//         const type = collection.handle
//           .replace('subcategory-', '')
//           .replace(/-/g, ' ')
//           .replace(/\b\w/g, l => l.toUpperCase());

//         if (!subcategoryGroups[type]) {
//           subcategoryGroups[type] = [];
//         }

//         subcategoryGroups[type].push({
//           id: collection.id,
//           title: collection.title
//         });
//       });

//     return subcategoryGroups;
//   }
// );

// // Memoized selector for complete categories array
// export const selectCategories = createSelector(
//   [selectBrandCollections, selectCategoryCollections, selectSubcategoryGroups],
//   (brandCollections, categoryCollections, subcategoryGroups) => {
//     return [
//       {
//         title: 'Featured Brands',
//         subcategories: brandCollections,
//       },
//       {
//         title: 'Category',
//         subcategories: categoryCollections,
//       },
//       ...Object.entries(subcategoryGroups).map(([type, subcats]) => ({
//         title: type,
//         subcategories: subcats,
//       })),
//     ];
//   }
// );

// export const { resetCollections, restoreDesignCollectionSlice } = collectionSlice.actions;
// export default collectionSlice.reducer;
// ------

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ cursor, limit = 80 }) => {
    const response = await fetch(`${BASE_URL}products/collectionList`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, cursor }),
    });

    const data = await response.json();
    return data.result;
  }
);

const collectionSlice = createSlice({
  name: "collections",
  initialState: {
    collections: [],
    loading: false,
    loadingCategorization: true,
    hasNextPage: false,
    cursor: "",
  },
  reducers: {
    resetCollections: (state) => {
      state.collections = [];
      state.cursor = "";
      state.hasNextPage = false;
      state.loadingCategorization = true;
    },
    restoreDesignCollectionSlice(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.loadingCategorization = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        const { collections = [], pageInfo = {} } = action.payload;
        const newCollections = collections.filter(
          (newCol) =>
            !state.collections.some((existing) => existing.id === newCol.id)
        );
        state.collections = [...state.collections, ...newCollections];
        state.cursor = pageInfo.endCursor || "";
        state.hasNextPage = pageInfo.hasNextPage ?? false;

        // Check if all categorization data is loaded
        if (selectCategories(state).brands.length > 0) {
          state.loadingCategorization = false;
        }
      })
      .addCase(fetchCollections.rejected, (state) => {
        state.loading = false;
        state.loadingCategorization = false;
      });
  },
});

// ============ MEMOIZED SELECTORS ============

const selectCollectionsState = (state) => state.collections;

// Simple selectors
export const selectCollections = (state) => state.collections.collections || [];
export const selectLoading = (state) => state.collections.loading;
export const selectHasNextPage = (state) => state.collections.hasNextPage;
export const selectCursor = (state) => state.collections.cursor;
export const selectLoadingCategorization = (state) => state.collections.loadingCategorization;

// Helper function to format category title from handle
const formatCategoryTitle = (handle) => {
  return handle
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Memoized selector for categorized collections
export const selectCategories = createSelector(
  [selectCollections],
  (collections) => {
    const categorized = {
      brands: [],
      tShirts: [],
      sweatshirtsHoodies: [],
      polos: [],
      activewear: [],
      zips: [],
      promotionalProducts: [],
      new: [],
      tops: [],  // New category for Tops
      jackets: [],  // New category for Jackets
      usamade: [],
      others: [],
    };

    (collections || []).forEach((collection) => {
      const handle = collection.handle;
      const collectionData = {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      };

      if (handle.startsWith('brand-')) {
        categorized.brands.push(collectionData);
      } else if (handle.startsWith('tshirts-')) {
        categorized.tShirts.push(collectionData);
      } else if (handle.startsWith('sweatshirtshoodies-')) {
        categorized.sweatshirtsHoodies.push(collectionData);
      } else if (handle.startsWith('polos-')) {
        categorized.polos.push(collectionData);
      } else if (handle.startsWith('activewear-')) {
        categorized.activewear.push(collectionData);
      } else if (handle.startsWith('zips-')) {
        categorized.zips.push(collectionData);
      } else if (handle.startsWith('promotionalproducts-')) {
        categorized.promotionalProducts.push(collectionData);
      } else if (handle.startsWith('new-')) {
        categorized.new.push(collectionData);
      } else if (handle.startsWith('others-')) {
        categorized.others.push(collectionData);
      }
      else if (handle.startsWith('tops-')) {  // New check for Tops category
        categorized.tops.push(collectionData);
      } else if (handle.startsWith('jackets')) {
        console.log("------jackets", collectionData) // New check for Jackets category
        categorized.jackets.push(collectionData);
      } else if (handle.startsWith('usamade')) {  // New check for USA Made category
        categorized.usamade.push(collectionData);
      }
    });

    return categorized;
  }
);

// Alternative selector that returns an array format for easier rendering
export const selectCategoriesArray = createSelector(
  [selectCategories],
  (categorized) => {
    const categoryMapping = [
      { key: 'brands', title: 'Featured Brands', subcategories: categorized.brands },
      { key: 'tShirts', title: 'T-Shirts', subcategories: categorized.tShirts },
      { key: 'sweatshirtsHoodies', title: 'Sweatshirts & Hoodies', subcategories: categorized.sweatshirtsHoodies },
      { key: 'polos', title: 'Polos', subcategories: categorized.polos },
      { key: 'activewear', title: 'Activewear', subcategories: categorized.activewear },
      { key: 'zips', title: 'Zips', subcategories: categorized.zips },
      { key: 'promotionalProducts', title: 'Promotional Products', subcategories: categorized.promotionalProducts },
      { key: 'new', title: 'New Arrivals', subcategories: categorized.new },
      { key: 'tops', title: 'Tops', subcategories: categorized.tops },  // Added Tops category
      { key: 'jackets', title: 'Jackets', subcategories: categorized.jackets },  // Added Jackets category
      { key: 'usaMade', title: 'USA Made', subcategories: categorized.usamade },  // Added USA Made category
      { key: 'others', title: 'Others', subcategories: categorized.others },


    ];

    // Filter out empty categories
    return categoryMapping.filter(cat => cat.subcategories.length > 0);
  }
);

export const { resetCollections, restoreDesignCollectionSlice } = collectionSlice.actions;
export default collectionSlice.reducer;