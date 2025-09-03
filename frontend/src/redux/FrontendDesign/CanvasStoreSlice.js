import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
    canvasWidth: 800, // Default width
    canvasHeight: 600, // Default height
};

// Create the slice
const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setCanvasDimensions: (state, action) => {
            // console.log("setting canvas dimension", action.payload.height)
            state.canvasWidth = action.payload.width;
            state.canvasHeight = action.payload.height;
        },
    },
});

// Export the action
export const { setCanvasDimensions } = canvasSlice.actions;

// Export the reducer
export default canvasSlice.reducer;