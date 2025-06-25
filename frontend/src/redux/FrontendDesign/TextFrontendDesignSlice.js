// import { createSlice, nanoid } from '@reduxjs/toolkit';

// // Helper to create a new text object
// const createNewText = ({ value, id }, length) => ({
//   id: id,
//   content: value || 'New Text',
//   fontFamily: 'Montserrat',
//   textColor: '#000000',
//   outline: 'none',
//   size: 1,
//   scaleX: 1,
//   scaleY: 1,
//   originalScaleX: 1,
//   originalScaleY: 1,
//   scaledValue: 1,
//   rotate: 0,
//   spacing: 1,
//   arc: 0,
//   outLineColor: "",
//   outLineSize: 0.5,
//   center: "center",
//   flipX: false,
//   flipY: false,
//   width: 150,
//   height: 50,
//   fontSize: 20,
//   position: { x: 320, y: 300 },
//   locked: false,
//   layerIndex: length
// });

// // ---- Initial State with per-side history tracking ----
// const initialState = {
//   activeSide: 'front',
//   past: {
//     front: [],
//     back: [],
//     leftSleeve: [],
//     rightSleeve: []
//   },
//   present: {
//     front: { selectedTextId: null, texts: [], setRendering: false },
//     back: { selectedTextId: null, texts: [], setRendering: false },
//     leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
//     rightSleeve: { selectedTextId: null, texts: [], setRendering: false }
//   },
//   future: {
//     front: [],
//     back: [],
//     leftSleeve: [],
//     rightSleeve: []
//   }
// };

// const TextFrontendDesignSlice = createSlice({
//   name: 'TextFrontendDesignSlice',
//   initialState,
//   reducers: {
//     // Set the current editing side
//     setActiveSide: (state, action) => {
//       state.activeSide = action.payload;
//     },

//     // Add a new text object
//     addTextState: (state, action) => {
//       const { value, id, side = state.activeSide } = action.payload;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       const newText = createNewText({ value, id }, state.present[side].texts.length);
//       state.present[side].texts.push(newText);
//       state.present[side].selectedTextId = newText.id;
//       state.future[side] = [];
//       state.present[side].setRendering = !state.present[side].setRendering;
//     },

//     // Duplicate an existing text object
//     duplicateTextState: (state, action) => {
//       const side = state.activeSide;
//       const idToDuplicate = action.payload;
//       const textToDuplicate = state.present[side].texts.find(t => t.id === idToDuplicate);

//       if (!textToDuplicate) return; // Exit early if text doesn't exist

//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

//       const newText = {
//         ...JSON.parse(JSON.stringify(textToDuplicate)),
//         id: nanoid(),
//         position: {
//           x: textToDuplicate.position.x + 20,
//           y: textToDuplicate.position.y + 20
//         },
//         layerIndex: state.present[side].texts.length
//       };

//       state.present[side].texts.push(newText);
//       state.present[side].selectedTextId = newText.id;
//       state.future[side] = [];
//       state.present[side].setRendering = !state.present[side].setRendering;
//     },

//     // Update a text object
//     updateTextState: (state, action) => {
//       const { id, changes, side = state.activeSide, isRenderOrNot } = action.payload;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       const text = state.present[side].texts.find(t => t.id === id);
//       if (text && !text.locked) Object.assign(text, changes);
//       if (isRenderOrNot) {
//         state.present[side].setRendering = !state.present[side].setRendering;
//       }
//       state.future[side] = [];
//     },

//     // Delete a text object
//     deleteTextState: (state, action) => {
//       const side = state.activeSide;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       state.present[side].texts = state.present[side].texts.filter(t => t.id !== action.payload);
//       state.future[side] = [];
//     },

//     // Move text object forward (up layer)
//     moveTextForwardState: (state, action) => {
//       const side = state.activeSide;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       const texts = state.present[side].texts;
//       const index = texts.findIndex(t => t.id === action.payload);
//       if (index !== -1 && index < texts.length - 1) {
//         [texts[index], texts[index + 1]] = [texts[index + 1], texts[index]];
//       }
//       texts.forEach((text, i) => text.layerIndex = i);
//       state.present[side].setRendering = !state.present[side].setRendering;
//       state.future[side] = [];
//     },

//     // Move text object backward (down layer)
//     moveTextBackwardState: (state, action) => {
//       const side = state.activeSide;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       const texts = state.present[side].texts;
//       const index = texts.findIndex(t => t.id === action.payload);
//       if (index > 0) {
//         [texts[index], texts[index - 1]] = [texts[index - 1], texts[index]];
//       }
//       texts.forEach((text, i) => text.layerIndex = i);
//       state.present[side].setRendering = !state.present[side].setRendering;
//       state.future[side] = [];
//     },

//     // Lock or unlock a text object
//     toggleLockState: (state, action) => {
//       const side = state.activeSide;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       const text = state.present[side].texts.find(t => t.id === action.payload);
//       if (text) text.locked = !text.locked;
//       state.present[side].setRendering = !state.present[side].setRendering;
//       state.future[side] = [];
//     },

//     // Set which text is currently selected
//     setSelectedTextState: (state, action) => {
//       const side = state.activeSide;
//       state.present[side].selectedTextId = action.payload;
//     },

//      setRendering:(state,action) =>{
//         const side = state.activeSide;
//         state.present[side].setRendering = !(state.present[side].setRendering);
//     },
//     // ----------- Undo / Redo per side ------------
//     undo: (state) => {
//       const side = state.activeSide;
//       if (state.past[side].length === 0) return;
//       const previous = state.past[side].pop();
//       state.future[side].unshift(JSON.parse(JSON.stringify(state.present[side])));
//       state.present[side] = previous;

//       state.present[side].setRendering = !state.present[side].setRendering;
//     },

//     redo: (state) => {
//       const side = state.activeSide;
//       if (state.future[side].length === 0) return;
//       const next = state.future[side].shift();
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       state.present[side] = next;
//       state.present[side].setRendering = !state.present[side].setRendering;
//     },

//     // Reset canvas state for all sides
//     resetCanvasState: (state) => {
//       const side = state.activeSide;
//       state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
//       state.present = {
//         front: { selectedTextId: null, texts: [], setRendering: false },
//         back: { selectedTextId: null, texts: [], setRendering: false },
//         leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
//         rightSleeve: { selectedTextId: null, texts: [], setRendering: false }
//       };
//       state.future = {
//         front: [],
//         back: [],
//         leftSleeve: [],
//         rightSleeve: []
//       };
//       state.present[side].setRendering = !(state.present[side].setRendering);
//     }
//   }
// });
// export const selectActiveSide = (state) => state.TextFrontendDesignSlice.activeSide;

// export const selectCanUndo = (state) => {
//   const side = state.TextFrontendDesignSlice.activeSide;
//   return state.TextFrontendDesignSlice.past[side]?.length > 0;
// };

// export const selectCanRedo = (state) => {
//   const side = state.TextFrontendDesignSlice.activeSide;
//   return state.TextFrontendDesignSlice.future[side]?.length > 0;
// };

// export const {
//   addTextState,
//   setSelectedTextState,
//   updateTextState,
//   moveTextForwardState,
//   moveTextBackwardState,
//   toggleLockState,
//   deleteTextState,
//   undo,
//   redo,
//   resetCanvasState,
//   duplicateTextState,
//   setActiveSide,
//   setRendering
// } = TextFrontendDesignSlice.actions;

// export default TextFrontendDesignSlice.reducer;

import { createSlice, nanoid } from "@reduxjs/toolkit";

const createNewText = ({ value, id }, length) => ({
  id: id,
  content: value || "New Text",
  fontWeight: "normal",
  fontStyle: "normal",
  fontFamily: "Montserrat",
  textColor: "#000000",
  outline: "none",
  size: 1,
  scaleX: 1,
  scaleY: 1,
  originalScaleX: 1,
  originalScaleY: 1,
  scaledValue: 1,
  rotate: 0,
  spacing: 1,
  arc: 0,
  outLineColor: "",
  outLineSize: 0.5,
  center: "center",
  flipX: false,
  flipY: false,
  width: 150,
  height: 50,
  fontSize: 20,
  position: { x: 280, y: 200 },
  locked: false,
  layerIndex: length,
});

const createNewImage = (
  { src },
  length
) => ({
  id: nanoid(),
  src: src,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  flipX: false,
  flipY: false,
  width: 150,
  height: 150,
  left: 280,
  top: 200,
  position: { x: 280, y: 150 },
  scaledValue: 1,
  angle: 0,
  locked: false,
  layerIndex: length,
  // Ai Operation
  remomveBg: false,
  cropAndTrim: false,
  superResolution: false,
  cropAndTrimParamValue:
    "fit=crop&crop=entropy&trim=color&w=400&h=400&dpr=2&quality=100&format=webp",
  superResolutionParamValue:
    "?auto=enhance&dpr=2&quality=100&format=webp&upscale=true",
  removeBgParamValue: "?remove-bg=true&dpr=2&quality=100&format=webp",
  loading:false,
  loadingSrc:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s"
});

const initialState = {
  activeSide: "front",
  past: {
    front: [],
    back: [],
    leftSleeve: [],
    rightSleeve: [],
  },
  present: {
    front: {
      selectedTextId: null,
      selectedImageId: null,
      texts: [],
      images: [],
      setRendering: false,

      // 🆕 Design settings for Name & Number (front)
      nameAndNumberDesignState: {
        id: "front",
        name: "NAME",
        number: "00",
        fontColor: "#000000",
        fontFamily: "Oswald",
        fontSize: "small",
        position: { x: 280, y: 200 },
      },

      // 🆕 Product list for Name & Number (front)
      nameAndNumberProductList: [
        // productId: [{ colorVariant, size, name, number }]
      ],
    },
    back: {
      selectedTextId: null,
      selectedImageId: null,
      texts: [],
      images: [],
      setRendering: false,

      // 🆕 Design settings for Name & Number (back)
      nameAndNumberDesignState: {
        id: "back",
        name: "NAME",
        number: "00",
        fontColor: "#000000",
        fontFamily: "Oswald",
        fontSize: "small",
        position: { x: 280, y: 200 },
      },
      // 🆕 Product list for Name & Number (back)
      nameAndNumberProductList: [
        // productId: [{ colorVariant, size, name, number }]
      ],
    },
    leftSleeve: {
      selectedTextId: null,
      selectedImageId: null,
      texts: [],
      setRendering: false,
    },
    rightSleeve: {
      selectedTextId: null,
      selectedImageId: null,
      texts: [],
      setRendering: false,
    },
  },
  future: {
    front: [],
    back: [],
    leftSleeve: [],
    rightSleeve: [],
  },

  // 🆕 Global state
  addNumber: false,
  addName: false,
  sleeveDesign: false,
};

const TextFrontendDesignSlice = createSlice({
  name: "TextFrontendDesignSlice",
  initialState,
  reducers: {
    // ✅ Original reducers (unchanged)
    setActiveSide: (state, action) => {
      state.activeSide = action.payload;
    },

    // Add a new text object
    addTextState: (state, action) => {
      const { value, id, side = state.activeSide } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const newText = createNewText(
        { value, id },
        state.present[side].texts.length
      );
      state.present[side].texts.push(newText);
      state.present[side].selectedTextId = newText.id;
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // Duplicate an existing text object
    duplicateTextState: (state, action) => {
      const side = state.activeSide;
      const idToDuplicate = action.payload;
      const textToDuplicate = state.present[side].texts.find(
        (t) => t.id === idToDuplicate
      );

      if (!textToDuplicate) return; // Exit early if text doesn't exist

      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const newText = {
        ...JSON.parse(JSON.stringify(textToDuplicate)),
        id: nanoid(),
        position: {
          x: textToDuplicate.position.x + 20,
          y: textToDuplicate.position.y + 20,
        },
        layerIndex: state.present[side].texts.length,
      };

      state.present[side].texts.push(newText);
      state.present[side].selectedTextId = newText.id;
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // Update a text object
    updateTextState: (state, action) => {
      const {
        id,
        changes,
        side = state.activeSide,
        isRenderOrNot,
      } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const text = state.present[side].texts.find((t) => t.id === id);
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
      state.present[side].texts = state.present[side].texts.filter(
        (t) => t.id !== action.payload
      );
      state.future[side] = [];
    },

    // Move text object forward (up layer)
    moveTextForwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const texts = state.present[side].texts;
      const index = texts.findIndex((t) => t.id === action.payload);
      if (index !== -1 && index < texts.length - 1) {
        [texts[index], texts[index + 1]] = [texts[index + 1], texts[index]];
      }
      texts.forEach((text, i) => (text.layerIndex = i));
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Move text object backward (down layer)
    moveTextBackwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const texts = state.present[side].texts;
      const index = texts.findIndex((t) => t.id === action.payload);
      if (index > 0) {
        [texts[index], texts[index - 1]] = [texts[index - 1], texts[index]];
      }
      texts.forEach((text, i) => (text.layerIndex = i));
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Lock or unlock a text object
    toggleLockState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const text = state.present[side].texts.find(
        (t) => t.id === action.payload
      );
      if (text) text.locked = !text.locked;
      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    // Set which text is currently selected
    setSelectedTextState: (state, action) => {
      const side = state.activeSide;
      state.present[side].selectedTextId = action.payload;
    },

    setRendering: (state, action) => {
      const side = state.activeSide;
      state.present[side].setRendering = !state.present[side].setRendering;
    },
    // ----------- Undo / Redo per side ------------
    undo: (state) => {
      const side = state.activeSide;
      if (state.past[side].length === 0) return;
      const previous = state.past[side].pop();
      state.future[side].unshift(
        JSON.parse(JSON.stringify(state.present[side]))
      );
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
    toggleSleeveDesign: (state) => {
      state.sleeveDesign = !state.sleeveDesign;
    },

    // Reset canvas state for all sides
    resetCanvasState: (state) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      state.present = {
        front: {
          selectedTextId: null,
          texts: [],
          nameAndNumberDesignState: {
            id: "front",
            name: "NAME",
            number: "00",
            fontColor: "#000000",
            fontFamily: "Oswald",
            fontSize: "small",
            position: { x: 325, y: 300 },
          },
          setRendering: false,
        },
        back: {
          selectedTextId: null,
          texts: [],
          nameAndNumberDesignState: {
            id: "front",
            name: "NAME",
            number: "00",
            fontColor: "#000000",
            fontFamily: "Oswald",
            fontSize: "small",
            position: { x: 325, y: 300 },
          },
          setRendering: false,
        },
        leftSleeve: { selectedTextId: null, texts: [], setRendering: false },
        rightSleeve: { selectedTextId: null, texts: [], setRendering: false },
      };
      state.future = {
        front: [],
        back: [],
        leftSleeve: [],
        rightSleeve: [],
      };
      state.present[side].setRendering = !state.present[side].setRendering;
      state.addName = false;
      state.addNumber = false;
    },
    setRendering: (state, action) => {
      const side = state.activeSide;
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // ************************************ 🆕 Name/Number Flags and states ******************************************************************

    setAddNumber: (state, action) => {
      const side = state.activeSide;
      state.addNumber = action.payload;
      state.present[side].setRendering = !state.present[side].setRendering;
    },
    setAddName: (state, action) => {
      const side = state.activeSide;
      state.addName = action.payload;
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // 🆕 Update design state (front/back)
    updateNameAndNumberDesignState: (state, action) => {
      const { side = state.activeSide, changes } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      if (state.present[side]?.nameAndNumberDesignState) {
        Object.assign(state.present[side].nameAndNumberDesignState, changes);
      }
      state.present[side].setRendering = nanoid();
      state.future[side] = [];
    },
    // Assuming: state.present[side].nameAndNumberProductList is now an ARRAY, not an object

    addNameAndNumberProduct: (state, action) => {
      const { side = state.activeSide, productData } = action.payload;
      const list = state.present[side]?.nameAndNumberProductList;
      if (!list) return;

      // Check if product entry already exists
      let product = list.find((p) => p.id === productData.id);

      if (!product) {
        // Add new product with first variant
        list.push(productData);
        console.log("product added succesfully");
      }
    },
    UpdateNameAndNumberProduct: (state, action) => {
      const {
        id,
        newSelections = [], // Array of { selectionId, name, number, size }
        side = state.activeSide,
        isRenderOrNot,
      } = action.payload;

      // Save to undo history
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const list = state.present[side]?.nameAndNumberProductList;
      if (!list) return;

      const product = list.find((p) => p.id === id);
      if (!product) {
        console.log("Product not found:", id);
        return;
      }

      // Create a map of new selectionIds
      const incomingMap = new Map(
        newSelections.map((sel) => [sel.selectionId, sel])
      );

      // Filter out selections not in the incoming list
      product.selections = product.selections.filter((existing) => {
        const incoming = incomingMap.get(existing.selectionId);
        if (incoming) {
          // Only update if not locked
          if (!existing.locked) {
            Object.assign(existing, incoming);
          }
          // Keep it
          return true;
        }
        // Remove if not present in new list
        return false;
      });

      // Add any new selectionIds that didn't already exist
      const existingIds = new Set(product.selections.map((s) => s.selectionId));
      newSelections.forEach((sel) => {
        if (!existingIds.has(sel.selectionId)) {
          product.selections.push(sel);
        }
      });

      // Optional render flag toggle
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }

      // Clear redo history
      state.future[side] = [];
    },

    removeNameAndNumberProduct: (state, action) => {
      const { side = state.activeSide, id } = action.payload;

      if (!state.present[side]) return;

      state.present[side].nameAndNumberProductList = state.present[
        side
      ].nameAndNumberProductList.filter((product) => product.id !== id);
    },

    addImageState: (state, action) => {
      const { src, id = nanoid(), side = state.activeSide } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const newImage = createNewImage(
        { src },
        state.present[side].images.length
      );
      state.present[side].selectedImageId = newImage.id;
      state.present[side].images.push(newImage);
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    updateImageState: (state, action) => {
      const {
        id,
        changes,
        side = state.activeSide,
        isRenderOrNot,
      } = action.payload;
      console.log("id", id, "changes........................", changes);
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const image = state.present[side].images.find((img) => img.id === id);
      if (image && !image.locked) Object.assign(image, changes);
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }
      state.future[side] = [];
    },
    duplicateImageState: (state, action) => {
      const side = state.activeSide;
      const idToDuplicate = action.payload;

      if (!state.present[side]?.images) {
        return;
      }

      const imageToDuplicate = state.present[side].images.find(
        (img) => img.id === idToDuplicate
      );

      if (!imageToDuplicate) {
        return;
      }

      if (imageToDuplicate.locked) {
        return;
      }


      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const newPosition = {
        x: imageToDuplicate.position.x + 20,
        y: imageToDuplicate.position.y + 20,
      };

      const newImage = {
        ...JSON.parse(JSON.stringify(imageToDuplicate)),
        id: nanoid(),
        position: newPosition,
        left: newPosition.x,
        top: newPosition.y,
        layerIndex: state.present[side].images.length,
      };

      console.log("New duplicated image:", newImage);

      state.present[side].images.push(newImage);
      state.present[side].selectedImageId = newImage.id;
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },



    deleteImageState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      state.present[side].images = state.present[side].images.filter(
        (img) => img.id !== action.payload
      );
      state.future[side] = [];
    },

    restoreDesignFromSavedState(state, action) {
      return { ...state, ...action.payload };
    },
    selectedImageIdState: (state, action) => {
      const side = state.activeSide;
      const id = action.payload;
      state.present[side].selectedImageId = id;
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    copyTextToSide: (state, action) => {
      const { fromSide, toSide, textId } = action.payload;
      const textToCopy = state.present[fromSide].texts.find(
        (t) => t.id === textId
      );

      if (!textToCopy) return;

      state.past[toSide].push(
        JSON.parse(JSON.stringify(state.present[toSide]))
      );

      const newText = {
        ...JSON.parse(JSON.stringify(textToCopy)),
        id: nanoid(),
        position: {
          x: textToCopy.position.x + 20, // Offset to avoid overlap
          y: textToCopy.position.y + 20,
        },
        layerIndex: state.present[toSide].texts.length,
      };

      state.present[toSide].texts.push(newText);
      state.present[toSide].selectedTextId = newText.id;
      state.present[toSide].setRendering = !state.present[toSide].setRendering;
      state.future[toSide] = [];
    },

  },
});

// ✅ Export Actions
export const {
  addTextState,
  updateTextState,
  setSelectedTextState,
  moveTextForwardState,
  moveTextBackwardState,
  toggleLockState,
  deleteTextState,
  undo,
  redo,
  resetCanvasState,
  duplicateTextState,
  duplicateImageState,
  setActiveSide,
  setRendering,
  setAddNumber,
  setAddName,
  updateNameAndNumberDesignState,
  removeNameAndNumberProduct,
  UpdateNameAndNumberProduct,
  addNameAndNumberProduct,
  addImageState,
  updateImageState,
  deleteImageState,
  restoreDesignFromSavedState,
  toggleSleeveDesign,
  copyTextToSide,
  selectedImageIdState
} = TextFrontendDesignSlice.actions;

// ✅ Export Selectors
export const selectActiveSide = (state) =>
  state.TextFrontendDesignSlice.activeSide;
export const selectCanUndo = (state) => {
  const side = state.TextFrontendDesignSlice.activeSide;
  return state.TextFrontendDesignSlice.past[side]?.length > 0;
};
export const selectCanRedo = (state) => {
  const side = state.TextFrontendDesignSlice.activeSide;
  return state.TextFrontendDesignSlice.future[side]?.length > 0;
};
export const selectCanStartOver = (state) => {
  const side = state.TextFrontendDesignSlice.activeSide;
  return state.TextFrontendDesignSlice.present[side]?.texts?.length > 0;
  // return state.TextFrontendDesignSlice.present[side]?.length > 0;
};
// export const toggleSleeveDesign = (state) => {
//   return state.sleeveDesign = !state.sleeveDesign;

// }
export default TextFrontendDesignSlice.reducer;
