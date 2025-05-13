import { createSlice, nanoid } from '@reduxjs/toolkit';

// Helper to create a new text object
const createNewText = ({ value, id }, length) => ({
  id: id,
  content: value || 'New Text',
  fontFamily: 'Arial',
  textColor: '#000000',
  outline: 'none',
  size: 1,
  scaleX: 1,
  scaleY: 1,
  originalScaleX: 1,
  originalScaleY: 1,
  scaledValue: 1,
  rotate: 0,
  spacing: 10,
  arc: 0,
  outLineColor: "",
  outLineSize: 0.5,
  center: "center",
  flipX: false,
  flipY: false,
  width: 150,
  height: 50,
  position: { x: 320, y: 300 },
  locked: false,
  layerIndex: length
});

// ---- Initial State with per-side history tracking ----
const initialState = {
  activeSide: 'front',
  past: {
    front: [],
    back: [],
    leftSleeve: [],
    rightSleeve: []
  },
  present: {
    front: { selectedTextId: null, texts: [], setRendering: false },
    back: { selectedTextId: null, texts: [], setRendering: false },
    leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
    rightSleeve: { selectedTextId: null, texts: [], setRendering: false }
  },
  future: {
    front: [],
    back: [],
    leftSleeve: [],
    rightSleeve: []
  }
};

const TextFrontendDesignSlice = createSlice({
  name: 'TextFrontendDesignSlice',
  initialState,
  reducers: {
    // Set the current editing side
    setActiveSide: (state, action) => {
      state.activeSide = action.payload;
    },

    // Add a new text object
    addTextState: (state, action) => {
      const { value, id, side = state.activeSide } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const newText = createNewText({ value, id }, state.present[side].texts.length);
      state.present[side].texts.push(newText);
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // Duplicate an existing text object
    duplicateTextState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
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
          layerIndex: state.present[side].texts.length
        };
        state.present[side].texts.push(newText);
        state.future[side] = [];
      }
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // Update a text object
    updateTextState: (state, action) => {
      const { id, changes, side = state.activeSide, isRenderOrNot } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const text = state.present[side].texts.find(t => t.id === id);
      if (text && !text.locked) Object.assign(text, changes);
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }
      state.future[side] = [];
    },

    // Delete a text object
    deleteTextState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      state.present[side].texts = state.present[side].texts.filter(t => t.id !== action.payload);
      state.future[side] = [];
    },

    // Move text object forward (up layer)
    moveTextForwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const texts = state.present[side].texts;
      const index = texts.findIndex(t => t.id === action.payload);
      if (index !== -1 && index < texts.length - 1) {
        [texts[index], texts[index + 1]] = [texts[index + 1], texts[index]];
      }
      texts.forEach((text, i) => text.layerIndex = i);
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Move text object backward (down layer)
    moveTextBackwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const texts = state.present[side].texts;
      const index = texts.findIndex(t => t.id === action.payload);
      if (index > 0) {
        [texts[index], texts[index - 1]] = [texts[index - 1], texts[index]];
      }
      texts.forEach((text, i) => text.layerIndex = i);
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Lock or unlock a text object
    toggleLockState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const text = state.present[side].texts.find(t => t.id === action.payload);
      if (text) text.locked = !text.locked;
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Set which text is currently selected
    setSelectedTextState: (state, action) => {
      const side = state.activeSide;
      state.present[side].selectedTextId = action.payload;
    },

    // ----------- Undo / Redo per side ------------
    undo: (state) => {
      const side = state.activeSide;
      if (state.past[side].length === 0) return;
      const previous = state.past[side].pop();
      state.future[side].unshift(JSON.parse(JSON.stringify(state.present[side])));
      state.present[side] = previous;
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    redo: (state) => {
      const side = state.activeSide;
      if (state.future[side].length === 0) return;
      const next = state.future[side].shift();
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      state.present[side] = next;
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // Reset canvas state for all sides
    resetCanvasState: (state) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      state.present = {
        front: { selectedTextId: null, texts: [], setRendering: false },
        back: { selectedTextId: null, texts: [], setRendering: false },
        leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
        rightSleeve: { selectedTextId: null, texts: [], setRendering: false }
      };
      state.future = {
        front: [],
        back: [],
        leftSleeve: [],
        rightSleeve: []
      };
       state.present[side].setRendering = !(state.present[side].setRendering);
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
