// // redux/slices/productSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async thunk to fetch products using fetch
// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async (_, thunkAPI) => {
//     try {
//       const response = await fetch("https://f9f2-49-249-2-6.ngrok-free.app/api/products/list", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ limit: 8 }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }

//       const data = await response.json();

//       const edges = data.result.data.products.edges;
//       const products = edges.map((edge) => {
//         const variant = edge.node.variants.edges[0]?.node;
//         return {
//           name: edge.node.title || variant?.title,
//           imgurl: variant?.image?.originalSrc,
//           colors: edge.node.options.find(opt => opt.name === "Color")?.values || [],
//         };
//       });

//       return products;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
// redux/slices/productSlice.js
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
