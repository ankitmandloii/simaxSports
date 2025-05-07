// import { createSlice, nanoid } from '@reduxjs/toolkit';

// const initialState = {
//   selectedTextId: null,
//   texts: []
// };

// const TextFrontendDesignSlice = createSlice({
//   name: 'TextFrontendDesignSlice',
//   initialState,
//   reducers: {
//     addTextState: (state, action) => {
//       const {value,id} = action.payload;
//       console.log(value,id,action.payload);
//       state.texts.push({
//         id: id,
//         content: value || 'New Text',
//         fontFamily: 'Arial',
//         textColor: '#000000',
//         outline: 'none',
//         size: 16,
//         rotate:0,
//         spacing:10,
//         arc:0,
//         outLineColor:"",
//         outLineSize:0,
//         center:"left",
//         flipX:1,
//         flipY:1,
//         width: 200,  // ✅ Add default width
//         height: 50,  // ✅ Add default height
//         position: { x: 300, y: 100 },
//         locked: false,
//         layerIndex: state.texts.length
//       });
//     },

//     setSelectedTextState: (state, action) => {
//       state.selectedTextId = action.payload;
//       console.log(state.selectedTextId,"selected item id")
//     },
//     updateTextState: (state, action) => {
//       const { id, changes } = action.payload;
//       const text = state.texts.find(t => t.id === id);
//       if (text) Object.assign(text, changes); // ✅ No change needed here
//     },

//     moveTextForwardState: (state, action) => {
//       const text = state.texts.find(t => t.id === action.payload);
//       if (text) text.layerIndex++;
//     },
//     moveTextBackwardState: (state, action) => {
//       const text = state.texts.find(t => t.id === action.payload);
//       if (text && text.layerIndex > 0) text.layerIndex--;
//     },
//     toggleLockState: (state, action) => {
//       const text = state.texts.find(t => t.id === action.payload);
//       if (text) text.locked = !text.locked;
//     },
//     deleteTextState: (state, action) => {
//       state.texts = state.texts.filter(t => t.id !== action.payload);
//     }
//   }
// });

// export const {
//   addTextState, setSelectedTextState, updateTextState,
//   moveTextForwardState, moveTextBackwardState,
//   toggleLockState, deleteTextState
// } = TextFrontendDesignSlice.actions;

// export default TextFrontendDesignSlice.reducer;
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
  outLineSize: 0,
  center: "left",
  flipX: 1,
  flipY: 1,
  width: 200,
  height: 50,
  position: { x: 300, y: 100 },
  locked: false,
  layerIndex: length
});

// ---- Initial State with history tracking ----
const initialState = {
  past: [],
  present: {
    selectedTextId: null,
    texts: []
  },
  future: []
};

const TextFrontendDesignSlice = createSlice({
  name: 'TextFrontendDesignSlice',
  initialState,
  reducers: {
    // ------ Core Actions (wrapped as "performAction" in UI) ------
    addTextState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const { value, id } = action.payload;
      state.present.texts.push(createNewText({ value, id }, state.present.texts.length));
      state.future = [];
    },

    updateTextState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      const { id, changes } = action.payload;
      const text = state.present.texts.find(t => t.id === id);
      if (text) Object.assign(text, changes);
      state.future = [];
    },

    deleteTextState: (state, action) => {
      state.past.push(JSON.parse(JSON.stringify(state.present)));
      state.present.texts = state.present.texts.filter(t => t.id !== action.payload);
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
      state.present.selectedTextId = action.payload;
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
  resetCanvasState
} = TextFrontendDesignSlice.actions;

export default TextFrontendDesignSlice.reducer;
