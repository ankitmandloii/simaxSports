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
  async ({ cursor, limit = 50 }) => {
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
    collections: [],  // Ensure this is always an empty array initially
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
        if (selectCategories(state).length > 0) {
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
export const selectCollections = (state) => state.collections.collections || [];  // Ensure it defaults to an empty array
export const selectLoading = (state) => state.collections.loading;
export const selectHasNextPage = (state) => state.collections.hasNextPage;
export const selectCursor = (state) => state.collections.cursor;
export const selectLoadingCategorization = (state) => state.collections.loadingCategorization;

// Memoized selector for brand collections
export const selectBrandCollections = createSelector(
  [selectCollections],
  (collections) => {
    return (collections || [])
      .filter(
        (collection) =>
          !collection.handle.includes('category') &&
          !collection.handle.includes('subcategory')
      )
      .map((collection) => ({
        id: collection.id,
        title: collection.title,
      }));
  }
);

// Memoized selector for category collections
// export const selectCategoryCollections = createSelector(
//   [selectCollections],
//   (collections) => {
//     return (collections || [])
//       .filter(
//         (collection) =>
//           collection.handle.includes('category') &&
//           !collection.handle.includes('subcategory')
//       )
//       .map((collection) => ({
//         id: collection.id,
//         title: collection.title,
//       }));
//   }
// );

// Memoized selector for subcategory groups
export const selectSubcategoryGroups = createSelector(
  [selectCollections],
  (collections) => {
    const subcategoryGroups = {};

    (collections || [])
      .filter((collection) => collection.handle.startsWith('subcategory-'))
      .forEach((collection) => {
        const type = collection.handle
          .replace('subcategory-', '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        if (!subcategoryGroups[type]) {
          subcategoryGroups[type] = [];
        }

        subcategoryGroups[type].push({
          id: collection.id,
          title: collection.title,
        });
      });

    return subcategoryGroups;
  }
);

// Memoized selector for complete categories array
// export const selectCategories = createSelector(
//   [selectBrandCollections, selectSubcategoryGroups],
//   (brandCollections, subcategoryGroups) => {
//     return [
//       {
//         title: 'Featured Brands',
//         subcategories: brandCollections,
//       },
//       // {
//       //   title: 'Category',
//       //   subcategories: categoryCollections,
//       // },
//       ...Object.entries(subcategoryGroups).map(([type, subcats]) => ({
//         // title: type,
//         subcategories: subcats,
//       })),
//     ];
//   }
// );
export const selectCategories = createSelector(
  [selectBrandCollections, selectSubcategoryGroups],
  (brandCollections, subcategoryGroups) => {
    return {
      categories: Object.entries(subcategoryGroups).map(([type, subcats]) => ({
        // title: type,
        subcategories: subcats,
      })),
      featuredBrands: brandCollections,

    };
  }
);


export const { resetCollections, restoreDesignCollectionSlice } = collectionSlice.actions;
export default collectionSlice.reducer;
