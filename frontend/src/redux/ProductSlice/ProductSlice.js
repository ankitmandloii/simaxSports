// redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post("https://f9f2-49-249-2-6.ngrok-free.app/api/products/list", {
        limit: 8,
      });

      const edges =  response.data.result.data.products.edges;
      console.log("---ed",edges)
      const products = edges.map((edge) => {
        const variant = edge.node.variants.edges[0]?.node;
        return {
          name: edge.node.title || variant?.title,
          imgurl: variant?.image?.originalSrc,
          colors: edge.node.options.find(opt => opt.name === "Color")?.values || [],
        };
      });
  console.log("---pr",products)
      return products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
