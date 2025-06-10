
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Use environment variable for base URL
// REACT_APP_BASE_URL='http://localhost:3000/'
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunk to fetch products using fetch
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}products/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: 8 }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const edges = data.result.data.products.edges;
      const products = edges.map(({ node }) => {
        const variants = node.variants.edges.map((v) => v.node);
        const productID = node.id;
        // Build color → image mapping
        const colorMap = {};
        variants.forEach((variant) => {
          const color = variant.selectedOptions.find((opt) => opt.name === "Color")?.value;
          if (color && !colorMap[color]) {
            colorMap[color] = {
              name: color,
              img: variant.image?.originalSrc || "", // fallback to empty
              variant, // store full variant if needed
            };
          }
        });

        return {
          name: node.title,
          imgurl: variants[0]?.image?.originalSrc,
          colors: Object.values(colorMap), // [{ name, img, variant }]
          allVariants: variants,
          id: productID
        };
      });

      return products;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Redux slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    restoreDesignProductSlice(state, action) {
      return { ...state, ...action.payload };
    },
  },
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
