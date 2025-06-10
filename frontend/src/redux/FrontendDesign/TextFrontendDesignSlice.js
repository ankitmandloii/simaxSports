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
  position: { x: 280, y: 200 },
  locked: false,
  layerIndex: length,
});

const createNewImage = ({ id, src }, length) => ({
  id: id,
  src,
  scaleX: 1,
  scaleY: 1,
  originalScaleX: 1,
  originalScaleY: 1,
  rotate: 0,
  flipX: false,
  flipY: false,
  width: 150,
  height: 150,
  position: { x: 280, y: 200 },
  position: { x: 280, y: 200 },
  locked: false,
  layerIndex: length,
});

const createProductDesign = () => {
  return {
    past: {
      front: [],
      back: [],
      leftSleeve: [],
      rightSleeve: [],
    },
    present: {
      front: {
        selectedTextId: null,
        texts: [],
        images: [],
        setRendering: false,
        nameAndNumberDesignState: {
          id: "front",
          name: "NAME",
          number: "00",
          fontColor: "#000000",
          fontFamily: "Oswald",
          fontSize: "small",
          position: { x: 280, y: 200 },
        },
        nameAndNumberProductList: [],
      },
      back: {
        selectedTextId: null,
        texts: [],
        images: [],
        setRendering: false,
        nameAndNumberDesignState: {
          id: "back",
          name: "NAME",
          number: "00",
          fontColor: "#000000",
          fontFamily: "Oswald",
          fontSize: "small",
          position: { x: 280, y: 200 },
        },
        nameAndNumberProductList: [],
      },
      leftSleeve: {
        selectedTextId: null,
        texts: [],
        images: [],
        setRendering: false,
      },
      rightSleeve: {
        selectedTextId: null,
        texts: [],
        images: [],
        setRendering: false,
      },
    },
    future: {
      front: [],
      back: [],
      leftSleeve: [],
      rightSleeve: [],
    },
  };
};

const initialState = {
  currentProductId: null, // active product being customized
  products: {
    // Example structure:
    // "product-1": { past, present, future }
  },
  activeSide: "front", // front | back | leftSleeve | rightSleeve
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

    addProductDesignState: (state, action) => {
      // Generate a new unique product ID or accept one from action.payload
      const productId = action.payload?.productId || nanoid();

      // Initialize design state for this product
      const newProductDesign = createProductDesign();

      // Add new product design state under products
      state.products[productId] = newProductDesign;

      // Set currentProductId to the new product
      if (state.currentProductId == null) {
        state.currentProductId = productId;
      }

      // Reset active side to front for the new product
      state.activeSide = "front";

      // Optionally reset global flags if needed
      state.addName = false;
      state.addNumber = false;
    },
    removeProductDesignState: (state, action) => {
      const productIdToRemove = action.payload;
      const productIds = Object.keys(state.products);

      // If only one product exists, do NOT delete it
      if (productIds.length <= 1) {
        return; // skip deletion
      }

      // Remove the product if it exists
      if (state.products[productIdToRemove]) {
        delete state.products[productIdToRemove];
      }

      // If the removed product was the current active one, switch to another product
      if (state.currentProductId === productIdToRemove) {
        const remainingProductIds = Object.keys(state.products);
        state.currentProductId =
          remainingProductIds.length > 0 ? remainingProductIds[0] : null;
      }
    },
    setCurrentProductId: (state, action) => {
      state.currentProductId = action.payload;
    },

    addTextState: (state, action) => {
      const productId = state.currentProductId;
      const side = action.payload.side || state.activeSide;

      if (!productId || !state.products[productId]) return;

      const product = state.products[productId];

      const { value, id } = action.payload;

      // Save current state to past
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      // Create and add new text
      const newText = createNewText(
        { value, id },
        product.present[side].texts.length
      );
      product.present[side].texts.push(newText);
      product.present[side].selectedTextId = newText.id;

      // Clear future and trigger rendering
      product.future[side] = [];
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    // Duplicate an existing text object
    duplicateTextState: (state, action) => {
      const productId = state.currentProductId;
      const side = state.activeSide;

      if (!productId || !state.products[productId]) return;

      const product = state.products[productId];
      const idToDuplicate = action.payload;

      const textToDuplicate = product.present[side].texts.find(
        (t) => t.id === idToDuplicate
      );

      if (!textToDuplicate) return; // Exit early if text doesn't exist

      // Save current state to history
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      const newText = {
        ...JSON.parse(JSON.stringify(textToDuplicate)),
        id: nanoid(),
        position: {
          x: textToDuplicate.position.x + 20,
          y: textToDuplicate.position.y + 20,
        },
        layerIndex: product.present[side].texts.length,
      };

      product.present[side].texts.push(newText);
      product.present[side].selectedTextId = newText.id;
      product.future[side] = [];
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    updateTextState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const {
        id,
        changes,
        side = state.activeSide,
        isRenderOrNot,
      } = action.payload;

      const product = state.products[productId];

      // Save current state to past history for undo
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      // Find the text object by id and update if not locked
      const text = product.present[side].texts.find((t) => t.id === id);
      if (text && !text.locked) {
        Object.assign(text, changes);
      }

      // Optionally toggle rendering flag to force UI update
      if (isRenderOrNot) {
        product.present[side].setRendering =
          !product.present[side].setRendering;
      }

      // Clear redo future history after change
      product.future[side] = [];
    },

    // Delete a text object
    deleteTextState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      // Save current state for undo
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      // Remove the text by id
      product.present[side].texts = product.present[side].texts.filter(
        (t) => t.id !== action.payload
      );

      // Clear redo history
      product.future[side] = [];
    },

    // Move text object forward (up layer)
    moveTextForwardState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      // Save current state for undo
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      const texts = product.present[side].texts;
      const index = texts.findIndex((t) => t.id === action.payload);

      if (index !== -1 && index < texts.length - 1) {
        // Swap the selected text with the next one to move it forward
        [texts[index], texts[index + 1]] = [texts[index + 1], texts[index]];
      }

      // Update layerIndex for all texts
      texts.forEach((text, i) => (text.layerIndex = i));

      // Toggle rendering to force UI update
      product.present[side].setRendering = !product.present[side].setRendering;

      // Clear redo history
      product.future[side] = [];
    },

    // Move text object backward (down layer)
    moveTextBackwardState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      // Save current state for undo
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      const texts = product.present[side].texts;
      const index = texts.findIndex((t) => t.id === action.payload);

      if (index > 0) {
        // Swap the selected text with the previous one to move it backward
        [texts[index], texts[index - 1]] = [texts[index - 1], texts[index]];
      }

      // Update layerIndex for all texts
      texts.forEach((text, i) => (text.layerIndex = i));

      // Toggle rendering to force UI update
      product.present[side].setRendering = !product.present[side].setRendering;

      // Clear redo history
      product.future[side] = [];
    },

    // Lock or unlock a text object
    toggleLockState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      const text = product.present[side].texts.find(
        (t) => t.id === action.payload
      );
      if (text) text.locked = !text.locked;

      product.present[side].setRendering = !product.present[side].setRendering;
      product.future[side] = [];
    },

    setSelectedTextState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      product.present[side].selectedTextId = action.payload;
    },

    setRendering: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      product.present[side].setRendering = !product.present[side].setRendering;
    },

    // ----------- Undo / Redo per side ------------
    undo: (state) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      if (product.past[side].length === 0) return;

      const previous = product.past[side].pop();
      product.future[side].unshift(
        JSON.parse(JSON.stringify(product.present[side]))
      );
      product.present[side] = previous;
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    redo: (state) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      if (product.future[side].length === 0) return;

      const next = product.future[side].shift();
      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );
      product.present[side] = next;
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    resetCanvasState: (state) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      product.present = {
        front: {
          selectedTextId: null,
          texts: [],
          images: [],
          nameAndNumberDesignState: {
            id: "front",
            name: "NAME",
            number: "00",
            fontColor: "#000000",
            fontFamily: "Oswald",
            fontSize: "small",
            position: { x: 325, y: 300 },
          },
          nameAndNumberProductList: [],
          setRendering: false,
        },
        back: {
          selectedTextId: null,
          texts: [],
          images: [],
          nameAndNumberDesignState: {
            id: "back",
            name: "NAME",
            number: "00",
            fontColor: "#000000",
            fontFamily: "Oswald",
            fontSize: "small",
            position: { x: 325, y: 300 },
          },
          nameAndNumberProductList: [],
          setRendering: false,
        },
        leftSleeve: {
          selectedTextId: null,
          texts: [],
          images: [],
          setRendering: false,
        },
        rightSleeve: {
          selectedTextId: null,
          texts: [],
          images: [],
          setRendering: false,
        },
      };

      product.future = {
        front: [],
        back: [],
        leftSleeve: [],
        rightSleeve: [],
      };

      product.present[side].setRendering = !product.present[side].setRendering;
      state.addName = false;
      state.addNumber = false;
    },

    // ************************************ 🆕 Name/Number Flags and states ******************************************************************

    setAddNumber: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      // product.addNumber = action.payload;
      state.addNumber = !state.addNumber;
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    setAddName: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const side = state.activeSide;
      const product = state.products[productId];

      // product.addName = action.payload;
      state.addName = !state.addName;
      product.present[side].setRendering = !product.present[side].setRendering;
    },

    updateNameAndNumberDesignState: (state, action) => {


      const { side = state.activeSide, changes, productId = state.currentProductId } = action.payload;
      if (!productId || !state.products[productId]) return;
      const product = state.products[productId];

      product.past[side].push(
        JSON.parse(JSON.stringify(product.present[side]))
      );

      if (product.present[side]?.nameAndNumberDesignState) {
        Object.assign(product.present[side].nameAndNumberDesignState, changes);
      }
      product.present[side].setRendering = !product.present[side].setRendering;
      console.log("updated name and number design 90 ", product.present[side]);
      product.future[side] = [];
    },

    addNameAndNumberProduct: (state, action) => {
      // if (!productId || !state.products[productId]) return;

      const { side = state.activeSide, productData } = action.payload;
      console.log("product data", productData);
      const productId = productData.id;

      const product = state.products[productId];

      // const list = product.present[side]?.nameAndNumberProductList;
      // if (!list) return;

      //  if (!existingProduct) {
      //   list.push(productData);
      //   console.log("product added successfully",list);

      // }
    },

    UpdateNameAndNumberProduct: (state, action) => {
      // if (!productId || !state.products[productId]) return;

      const {
        id,
        newSelections = [],
        side = "front",
        isRenderOrNot,
      } = action.payload;

      const productId = id;
      const productState = state.products[id];
      // Ensure structure is initialized
      // if (!productState.past[side]) productState.past[side] = [];
      // if (!productState.future[side]) productState.future[side] = [];
      // if (!productState.present[side]) productState.present[side] = {};
      // if (!productState.present[side].nameAndNumberProductList) {
      //   productState.present[side].nameAndNumberProductList = [];
      // }

      // Save current state to past
      // productState.past[side].push(JSON.parse(JSON.stringify(productState.present[side])));

      // Update the list directly
      productState.present[side].nameAndNumberProductList = newSelections;
      console.log("new selection updated");
      productState.present[side].nameAndNumberProductList.forEach(sl => console.log(sl));

      // Toggle render flag
      if (isRenderOrNot) {
        productState.present[side].setRendering = !productState.present[side].setRendering;
      }

      // Clear future for undo/redo
      productState.future[side] = [];
    },

    removeNameAndNumberProduct: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const productState = state.products[productId];
      const { side = productState.activeSide, id } = action.payload;

      if (!productState.present[side]) return;

      productState.present[side].nameAndNumberProductList =
        productState.present[side].nameAndNumberProductList.filter(
          (p) => p.id !== id
        );
    },

    addImageState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const {
        src,
        id,
        side = state.products[productId].activeSide,
      } = action.payload;
      const productState = state.products[productId];

      productState.past[side].push(
        JSON.parse(JSON.stringify(productState.present[side]))
      );
      const newImage = createNewImage(
        { src, id },
        productState.present[side].images.length
      );
      productState.present[side].images.push(newImage);
      productState.future[side] = [];
      productState.present[side].setRendering =
        !productState.present[side].setRendering;
    },

    updateImageState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const {
        id,
        changes,
        side = state.products[productId].activeSide,
        isRenderOrNot,
      } = action.payload;
      const productState = state.products[productId];

      productState.past[side].push(
        JSON.parse(JSON.stringify(productState.present[side]))
      );
      const image = productState.present[side].images.find(
        (img) => img.id === id
      );
      if (image && !image.locked) Object.assign(image, changes);
      if (isRenderOrNot)
        productState.present[side].setRendering =
          !productState.present[side].setRendering;
      productState.future[side] = [];
    },

    deleteImageState: (state, action) => {
      const productId = state.currentProductId;
      if (!productId || !state.products[productId]) return;

      const productState = state.products[productId];
      const side = productState.activeSide;

      productState.past[side].push(
        JSON.parse(JSON.stringify(productState.present[side]))
      );
      productState.present[side].images = productState.present[
        side
      ].images.filter((img) => img.id !== action.payload);
      productState.future[side] = [];
    },

    restoreDesignFromSavedState: (state, action) => {
      // This might need to be adapted depending on the multi-product shape
      return { ...state, ...action.payload };
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
  removeProductDesignState,
  addProductDesignState,
  setCurrentProductId,
  toggleSleeveDesign
} = TextFrontendDesignSlice.actions;

export const selectActiveSide = (state) =>
  state.TextFrontendDesignSlice.products[
    state.TextFrontendDesignSlice.currentProductId
  ]?.activeSide;

export const selectCanUndo = (state) => {
  const product =
    state.TextFrontendDesignSlice.products[
    state.TextFrontendDesignSlice.currentProductId
    ];
  if (!product) return false;
  const side = product.activeSide;
  return product.past[side]?.length > 0;
};

export const selectCanRedo = (state) => {
  const product =
    state.TextFrontendDesignSlice.products[
    state.TextFrontendDesignSlice.currentProductId
    ];
  if (!product) return false;
  const side = product.activeSide;
  return product.future[side]?.length > 0;
};

export const selectCanStartOver = (state) => {
  const product =
    state.TextFrontendDesignSlice.products[
    state.TextFrontendDesignSlice.currentProductId
    ];
  if (!product) return false;
  const side = product.activeSide;
  return product.present[side]?.texts?.length > 0;
};

// }
export default TextFrontendDesignSlice.reducer;
