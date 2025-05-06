import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  selectedTextId: null,
  texts: []
};

const TextFrontendDesignSlice = createSlice({
  name: 'TextFrontendDesignSlice',
  initialState,
  reducers: {
    addTextState: (state, action) => {
      const {value,id} = action.payload;
      console.log(value,id,action.payload);
      state.texts.push({
        id: id,
        content: value || 'New Text',
        fontFamily: 'Arial',
        textColor: '#000000',
        outline: 'none',
        size: 16,
        rotate:0,
        spacing:10,
        arc:0,
        outLineColor:"",
        outLineSize:0,
        center:"left",
        flipX:1,
        flipY:1,
        width: 200,  // ✅ Add default width
        height: 50,  // ✅ Add default height
        position: { x: 300, y: 100 },
        locked: false,
        layerIndex: state.texts.length
      });
    },

    setSelectedTextState: (state, action) => {
      state.selectedTextId = action.payload;
      console.log(state.selectedTextId,"selected item id")
    },
    updateTextState: (state, action) => {
      const { id, changes } = action.payload;
      const text = state.texts.find(t => t.id === id);
      if (text) Object.assign(text, changes); // ✅ No change needed here
    },

    moveTextForwardState: (state, action) => {
      const text = state.texts.find(t => t.id === action.payload);
      if (text) text.layerIndex++;
    },
    moveTextBackwardState: (state, action) => {
      const text = state.texts.find(t => t.id === action.payload);
      if (text && text.layerIndex > 0) text.layerIndex--;
    },
    toggleLockState: (state, action) => {
      const text = state.texts.find(t => t.id === action.payload);
      if (text) text.locked = !text.locked;
    },
    deleteTextState: (state, action) => {
      state.texts = state.texts.filter(t => t.id !== action.payload);
    }
  }
});

export const {
  addTextState, setSelectedTextState, updateTextState,
  moveTextForwardState, moveTextBackwardState,
  toggleLockState, deleteTextState
} = TextFrontendDesignSlice.actions;

export default TextFrontendDesignSlice.reducer;
