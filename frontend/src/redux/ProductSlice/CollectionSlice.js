import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.REACT_APP_BASE_URL;
// Async thunk to fetch collections with pagination
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ cursor, limit = 50 }) => {
    const response = await fetch(`${BASE_URL}products/collectionList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit, cursor }),
    });

    const data = await response.json();
    return data.result; // return only the 'result' part
  }
);


// Collection slice
export const collectionSlice = createSlice({
  name: 'collections',
  initialState: {
    collections: [],
    loading: false,
    hasNextPage: false,
    cursor: '',
  },
  reducers: {
    resetCollections: (state) => {
      state.collections = [];
      state.cursor = '';
      state.hasNextPage = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = [...state.collections, ...action.payload.collections];
        state.cursor = action.payload.pageInfo.endCursor;
        state.hasNextPage = action.payload.pageInfo.hasNextPage;
      })

      .addCase(fetchCollections.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetCollections } = collectionSlice.actions;
export default collectionSlice.reducer;
