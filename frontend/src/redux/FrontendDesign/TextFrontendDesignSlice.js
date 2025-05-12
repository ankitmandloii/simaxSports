import { createSlice, nanoid } from '@reduxjs/toolkit';

const createNewText = ({ value, id }, length) => ({
  id: id,
  content: value || 'New Text',
  fontFamily: 'Arial',
  textColor: '#000000',
  outline: 'none',
  size: 16,
  rotate: 0,
  spacing: 10,
  arc: 0,
  outLineColor: "",
  outLineSize: 0.5,
  center: "center",
  flipX: false,
  flipY: false,
  width: 200,
  height: 50,
  position: { x: 300, y: 100 },
  locked: false,
  layerIndex: length
});

// ---- Initial State with history tracking ----
const initialState = {
  activeSide: 'front',
  past: [],
  present: {
    front: { selectedTextId: null, texts: [] ,setRendering:false},
    back: { selectedTextId: null, texts: [],setRendering:false },
    leftSleeve: { selectedTextId: null, texts: [] ,setRendering:false},
    rightSleeve: { selectedTextId: null, texts: [] ,setRendering:false}
  },
  future: []
};

const TextFrontendDesignSlice = createSlice({
  name: 'TextFrontendDesignSlice',
  initialState,
  reducers: {
    // ------ Core Actions (wrapped as "performAction" in UI) ------
    setActiveSide: (state, action) => {
      // const side = state.activeSide
      // state.present[side].setRendering = !(state.present[side].setRendering);
      state.activeSide = action.payload;
    },

    addTextState: (state, action) => {
      const { value, id, side = state.activeSide } = action.payload;
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const newText = createNewText({ value, id }, state.present[side].texts.length);
      state.present[side].texts.push(newText);
      state.future = [];
      state.present[side].setRendering = !(state.present[side].setRendering);
      //console.log(state.present[side].setRendering);
    },

    duplicateTextState: (state, action) => {
       const side = state.activeSide
       state.past.push(JSON.parse(JSON.stringify(state.present)));
       const idToDuplicate = action.payload;
       const textToDuplicate = state.present[side].texts.find(t => t.id === idToDuplicate);
       if (textToDuplicate) {
         const newText = {
           ...JSON.parse(JSON.stringify(textToDuplicate)),
           id: nanoid(),
           position: {
             x: textToDuplicate.position.x + 20, 
             y: textToDuplicate.position.y + 20
            },
            layerIndex: state.present[side].texts.length // bring to top
          };
          state.present[side].texts.push(newText);
          state.future = [];
        }
        state.present[side].setRendering = !(state.present[side].setRendering);
    },

    updateTextState: (state, action) => {
      //console.log(action.payload,"updateTextState")
      const { id, changes, side = state.activeSide,isRenderOrNot } = action.payload;
      // //console.log(id,changes,"updateTextState")
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const text = state.present[side].texts.find(t => t.id === id);
      if (text && !text.locked) Object.assign(text, changes);
      //console.log(isRenderOrNot,"isRenderOrNot")
      if(isRenderOrNot){
        state.present[side].setRendering = !(state.present[side].setRendering);
      }
      state.future = [];
    },

    deleteTextState: (state, action) => {
      const side = state.activeSide;
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      state.present[side].texts = state.present[side].texts.filter(t => t.id !== action.payload);
      state.future = [];
    },

    moveTextForwardState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const text = state.present.texts.find(t => t.id === action.payload);
      if (text) text.layerIndex++;
      state.future = [];
    },

    moveTextBackwardState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const text = state.present.texts.find(t => t.id === action.payload);
      if (text && text.layerIndex > 0) text.layerIndex--;
      state.future = [];
    },

    toggleLockState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const text = state.present.texts.find(t => t.id === action.payload);
      if (text) text.locked = !text.locked;
      state.future = [];
    },

    setSelectedTextState: (state, action) => {
      const side = state.activeSide;
      //console.log(action.payload,"setSelectedTextState")
      state.present[side].selectedTextId = action.payload;
    },

    // ------ Undo / Redo -------
    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past.pop();
      state.future.unshift(JSON.parse(JSON.stringify(state.present)));
      state.present = previous;
    },

    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future.shift();
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      state.present = next;
    },

    // resetCanvasState: (state) => {
    //   state.past.push(JSON.parse(JSON.stringify(state.present)));
    //   state.present = {
    //     selectedTextId: null,
    //     texts: []
    //   };
    //   state.future = [];
    // }
      resetCanvasState: (state) => {
  state.past.push(JSON.parse(JSON.stringify(state.present)));
  state.present = {
    front: { selectedTextId: null, texts: [], setRendering: false },
    back: { selectedTextId: null, texts: [], setRendering: false },
    leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
    rightSleeve: { selectedTextId: null, texts: [], setRendering: false }
  };
  state.future = [];
  console.log("---state",state.present)
}


  }
});

export const {
  addTextState,
  setSelectedTextState,
  updateTextState,
  moveTextForwardState,
  moveTextBackwardState,
  toggleLockState,
  deleteTextState,
  undo,
  redo,
  resetCanvasState,
  duplicateTextState,
  setActiveSide
} = TextFrontendDesignSlice.actions;

export default TextFrontendDesignSlice.reducer;
