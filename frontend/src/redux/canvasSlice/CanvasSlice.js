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
    flipX: 1,
    flipY: 1
    
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
    setFlipXState: (state,action) => {
      state.flipX = action.payload;
    },
    setFlipYState: (state, action) =>{
      state.flipY = action.payload;
    }
    


  },
});

export const { setText , setTextColorState, setFontFamilyState, setRangeState, setOutLineColorState, setOutLineSizeState, setCenterState, setFlipXState, setFlipYState } = canvasSlice.actions;
export default canvasSlice.reducer;
