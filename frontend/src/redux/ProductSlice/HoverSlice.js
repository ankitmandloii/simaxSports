import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hoveredRoute: null,
  hasClickedDesignButton: {
    front: false,
    back: false,
    left: false,
    right: false,
  },
};

const hoverSlice = createSlice({
  name: "hover",
  initialState,
  reducers: {
    setHoveredRoute: (state, action) => {
      state.hoveredRoute = action.payload;
    },
    markDesignButtonClicked: (state, action) => {
      const side = action.payload;
      state.hasClickedDesignButton[side] = true;
    },
  },
});

export const { setHoveredRoute, markDesignButtonClicked } = hoverSlice.actions;
export default hoverSlice.reducer;
