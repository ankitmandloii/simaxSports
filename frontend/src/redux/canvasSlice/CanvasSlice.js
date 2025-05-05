// canvasSlice.js
import { createSlice } from '@reduxjs/toolkit';

const canvasSlice = createSlice({
  name: 'canvas',
  initialState: {
    text: "",
    textColor: "#000000",
    fontFamily: "Inter",
    size: 40,
    arc: 150,
    rotate: 360,
    spacing: 10,
    outLineColor: "#000000",
    outLineSize: 1,
    center: "left",
    flipXY: 1,
    
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setTextColorState: (state, action) => {
      state.textColor = action.payload;
    },
    setFontFamilyState: (state, action) => {
      state.fontFamily = action.payload;
    },
    setRangeState: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setOutLineColorState: (state, action) => {
      state.outLineColor = action.payload;
    },
    setOutLineSizeState: (state, action) => {
      state.outLineSize = action.payload;
    },
    setCenterState: (state, action) => {
     state.center = action.payload;
    },
    setFlipXYState: (state,action) => {
      state.flipXY = action.payload;
    }
    


  },
});

export const { setText , setTextColorState, setFontFamilyState, setRangeState, setOutLineColorState, setOutLineSizeState, setCenterState, setFlipXYState } = canvasSlice.actions;
export default canvasSlice.reducer;
