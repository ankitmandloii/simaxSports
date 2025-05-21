
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ cursor, limit = 20 }) => {
    // Use a small cursor or increase mock data to ensure enough items
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

        const { collections = [], pageInfo = {} } = action.payload;

        const newCollections = collections.filter(
          (newCol) =>
            !state.collections.some((existing) => existing.id === newCol.id)
        );

        state.collections = [...state.collections, ...newCollections];
        state.cursor = pageInfo.endCursor || ''; // fallback to empty
        state.hasNextPage = pageInfo.hasNextPage ?? false;
      })

      .addCase(fetchCollections.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetCollections } = collectionSlice.actions;
export default collectionSlice.reducer;
