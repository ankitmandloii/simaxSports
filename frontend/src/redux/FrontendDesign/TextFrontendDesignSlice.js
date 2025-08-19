import { createSlice, nanoid } from "@reduxjs/toolkit";
import { act } from "react";
function getStaringCenterPostion() {
  const canvasComponent = document.querySelector("#canvas-front"); // Simple way, but ideally use refs or context
  if (!canvasComponent) {
    console.warn("canvasComponent is not found ");
    return { x: 290, y: 200 };
  }
  const rect = canvasComponent.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  return { x: centerX, y: centerY }
}
const createNewText = ({ value, id, centerX, centerY }, totalElements) => ({
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
  angle: 0,
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
  position: { x: centerX, y: centerY },
  locked: false,
  layerIndex: totalElements,
});

const createNewImage = (
  { src },
  totalElements,
  centerX,
  centerY
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
  position: { x: centerX, y: centerY },
  scaledValue: 1,
  angle: 0,
  locked: false,
  layerIndex: totalElements,
  thresholdValue: 144,
  // Ai Operation
  replaceBackgroundColor: "#000000", // stored with hash
  replaceBgParamValue: "bg-remove=true&bg=AABB22",
  cropAndTrim: false,
  superResolution: false,
  invertColor: false,
  solidColor: false,
  removeBg: false,
  singleColor: "#ffffff",
  base64CanvasImage: src,
  base64CanvasImageForNormalColor: null,
  base64CanvasImageForSinglelColor: null,
  base64CanvasImageForBlackAndWhitelColor: null,
  cropAndTrimParamValue:
    "fit=crop&crop=entropy&trim=color&w=400&h=400&dpr=2&quality=100&format=webp",
  superResolutionParamValue:
    "?auto=enhance&dpr=2&quality=100&format=webp&upscale=true",
  removeBgParamValue: "?remove-bg=true&dpr=2&quality=100&format=webp",
  loading: false,
  loadingSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s",
  replaceSrc: false,
  selectedFilter: "Normal",
  editColor: false,
  extractedColors: [],
  removeBgImagebtn: false,
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
      loadingState: {
        loading: false,
        position: getStaringCenterPostion()
      },
      texts: [],
      images: [],
      setRendering: false,
      // addNumber: false,
      // addName: false,

      // 🆕 Design settings for Name & Number (front)
      nameAndNumberDesignState: {
        id: "front",
        name: "NAME",
        number: "00",
        fontColor: "#000000",
        fontFamily: "Oswald",
        fontSize: "large",
        position: getStaringCenterPostion(),
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
      // addNumber: false,
      // addName: false,
      loadingState: {
        loading: false,
        position: getStaringCenterPostion()
      },

      // 🆕 Design settings for Name & Number (back)
      nameAndNumberDesignState: {
        id: "back",
        name: "NAME",
        number: "00",
        fontColor: "#000000",
        fontFamily: "Oswald",
        fontSize: "large",
        position: getStaringCenterPostion(),
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
      images: [],
      setRendering: false,
      // addNumber: false,
      // addName: false,
      loadingState: {
        loading: false,
        position: getStaringCenterPostion()
      },
    },
    rightSleeve: {
      selectedTextId: null,
      selectedImageId: null,
      texts: [],
      images: [],
      setRendering: false,
      // addNumber: false,
      // addName: false,
      loadingState: {
        loading: false,
        position: getStaringCenterPostion()
      },
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
  activeNameAndNumberPrintSide: "back"
};

const TextFrontendDesignSlice = createSlice({
  name: "TextFrontendDesignSlice",
  initialState,
  reducers: {
    // ✅ Original reducers (unchanged)
    setActiveSide: (state, action) => {
      state.activeSide = action.payload;
    },
    setactiveNameAndNumberPrintSide: (state, action) => {
      const side = state.activeSide;
      // console.log("NAMEandnumber", action.payload)
      state.activeNameAndNumberPrintSide = action.payload
      state.present[side].setRendering = !state.present[side].setRendering;
      // console.log("slicenumber", state.activeNameAndNumberPrintSide)
    },

    // Add a new text object
    // addTextState: (state, action) => {
    //   const { value, id, side = state.activeSide } = action.payload;
    //   state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
    //   const newText = createNewText(
    //     { value, id },
    //     state.present[side].texts.length
    //   );
    //   state.present[side].texts.push(newText);
    //   state.present[side].selectedTextId = newText.id;
    //   state.future[side] = [];
    //   state.present[side].setRendering = !state.present[side].setRendering;
    // },
    addTextState: (state, action) => {
      const { value, id, side = state.activeSide } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const totalElements = state.present[side]?.texts?.length + state.present[side]?.images?.length;
      const canvasComponent = document.querySelector(`#canvas-${side}`); // Simple way, but ideally use refs or context
      const rect = canvasComponent.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const newText = createNewText(
        { value, id, centerX, centerY },
        totalElements
      );
      state.present[side].texts?.push(newText);
      state.present[side].selectedTextId = newText.id;
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },
    // Duplicate an existing text object
    duplicateTextState: (state, action) => {
      const side = state.activeSide;
      const idToDuplicate = action.payload;
      const textToDuplicate = state.present[side]?.texts?.find(
        (t) => t.id === idToDuplicate
      );

      if (!textToDuplicate) return;

      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Calculate total elements for proper layer indexing
      const totalElements = state.present[side]?.texts?.length + state.present[side]?.images?.length;

      const newText = {
        ...JSON.parse(JSON.stringify(textToDuplicate)),
        id: nanoid(),
        position: {
          x: textToDuplicate.position.x + 20,
          y: textToDuplicate.position.y + 20,
        },
        layerIndex: totalElements, // Use totalElements instead of just texts length
      };

      state.present[side].texts.push(newText);
      state.present[side].selectedTextId = newText.id;
      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    duplicateImageState: (state, action) => {
      const side = state.activeSide;
      const idToDuplicate = action.payload;

      if (!state.present[side]?.images) return;

      const imageToDuplicate = state.present[side]?.images?.find(
        (img) => img.id === idToDuplicate
      );

      if (!imageToDuplicate || imageToDuplicate.locked) return;

      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Calculate total elements for proper layer indexing
      const totalElements = state.present[side]?.texts?.length + state.present[side]?.images?.length;

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
        layerIndex: totalElements, // Use totalElements instead of just images length
      };

      state.present[side].images.push(newImage);
      state.present[side].selectedImageId = newImage.id;
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
      const text = state.present[side]?.texts?.find((t) => t.id === id);
      if (text && !text.locked) Object.assign(text, changes);
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }
      state.future[side] = [];
    },

    // Delete a text object
    // deleteTextState: (state, action) => {
    //   const side = state.activeSide;
    //   state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
    //   state.present[side].texts = state.present[side].texts.filter(
    //     (t) => t.id !== action.payload
    //   );
    //   state.future[side] = [];
    // },

    // Move text object forward (up layer)
    moveTextForwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const texts = state.present[side]?.texts;
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
      const texts = state.present[side]?.texts;
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
    toggleImageLockState: (state, action) => {
      const side = state.activeSide;

      // Save current state for undo
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Find and toggle lock state for the image
      const image = state.present[side].images.find(
        (img) => img.id === action.payload
      );
      if (image) image.locked = !image.locked;

      // Trigger rerender
      state.present[side].setRendering = !state.present[side].setRendering;

      // Clear future for redo
      state.future[side] = [];
    }
    ,

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
          // ---
          selectedImageId: null,
          images: [],
          setRendering: false,
          // addName: false,
          // addNumber: false,
          // ===
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
          // ---
          selectedImageId: null,
          images: [],
          setRendering: false,
          // addName: false,
          // addNumber: false,
          // ===
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
        leftSleeve: {
          selectedTextId: null,
          selectedImageId: null,
          texts: [],
          images: [],
          setRendering: false
        },
        rightSleeve: { selectedTextId: null, texts: [], images: [], selectedImageId: null, setRendering: false },
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
      // console.log("------setRendering", state.activeSide);
      const side = state.activeSide;
      state.present[side].setRendering = !state.present[side].setRendering;
      // console.log("===after", state.present[side].setRendering)
    },

    // ************************************ 🆕 Name/Number Flags and states ******************************************************************

    setAddNumber: (state, action) => {
      const side = state.activeSide;

      const canvasComponent = document.querySelector(`#canvas-${side}`); // Simple way, but ideally use refs or context
      const rect = canvasComponent.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const changes = {
        position: {
          x: centerX,
          y: centerY,
        }
      }
      state.addNumber = action.payload;
      // if (state.present[side]?.nameAndNumberDesignState) {
      //   Object.assign(state.present[side]?.nameAndNumberDesignState, changes);
      // }
      state.present[side].addNumber = action.payload;
      state.present[side].setRendering = !state.present[side].setRendering;


    },
    setAddName: (state, action) => {
      const side = state.activeSide;
      state.present[side].addName = action.payload;
      const canvasComponent = document.querySelector(`#canvas-${side}`); // Simple way, but ideally use refs or context
      const rect = canvasComponent.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const changes = {
        position: {
          x: centerX,
          y: centerY,
        }
      }
      // state.addNumber = action.payload;
      // if (state.present[side]?.nameAndNumberDesignState) {
      //   Object.assign(state.present[side]?.nameAndNumberDesignState, changes);
      // }
      state.addName = action.payload;
      state.present[side].setRendering = !state.present[side].setRendering;
    },


    // 🆕 Update design state (front/back)
    updateNameAndNumberDesignState: (state, action) => {
      const { changes } = action.payload;
      const side = "back";
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      if (state.present[side]?.nameAndNumberDesignState) {
        Object.assign(state.present[side]?.nameAndNumberDesignState, changes);
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
        // console.log("product added succesfully");
      }
    },
    // UpdateNameAndNumberProduct: (state, action) => {
    //   const {
    //     id,
    //     newSelections = [], // Array of { selectionId, name, number, size }
    //     side = "back",
    //     isRenderOrNot,
    //   } = action.payload;

    //   // Save to undo history
    //   state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

    //   const list = state.present[side]?.nameAndNumberProductList;
    //   if (!list) return;

    //   const product = list.find((p) => p.id === id);
    //   if (!product) {
    //     // console.log("Product not found:", id);
    //     return;
    //   }

    //   // Create a map of new selectionIds
    //   const incomingMap = new Map(
    //     newSelections.map((sel) => [sel.selectionId, sel])
    //   );

    //   // Filter out selections not in the incoming list
    //   product.selections = product.selections.filter((existing) => {
    //     const incoming = incomingMap.get(existing.selectionId);
    //     if (incoming) {
    //       // Only update if not locked
    //       if (!existing.locked) {
    //         Object.assign(existing, incoming);
    //       }
    //       // Keep it
    //       return true;
    //     }
    //     // Remove if not present in new list
    //     return false;
    //   });

    //   // Add any new selectionIds that didn't already exist
    //   const existingIds = new Set(product.selections.map((s) => s.selectionId));
    //   newSelections.forEach((sel) => {
    //     if (!existingIds.has(sel.selectionId)) {
    //       product.selections.push(sel);
    //     }
    //   });

    //   // Optional render flag toggle
    //   if (isRenderOrNot) {
    //     state.present[side].setRendering = !state.present[side].setRendering;
    //   }

    //   // Clear redo history
    //   state.future[side] = [];
    // },
    UpdateNameAndNumberProduct: (state, action) => {
      const {
        id,
        newSelections = [], // Array of { selectionId, name, number, size }
        side = "back",
        isRenderOrNot,
        sizeCount = {} // 👈 extract sizeCount from payload
      } = action.payload;

      // Save to undo history
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const list = state.present[side]?.nameAndNumberProductList;
      if (!list) return;

      const product = list.find((p) => p.id === id);
      if (!product) return;

      // Create a map of new selectionIds
      const incomingMap = new Map(
        newSelections.map((sel) => [sel.selectionId, sel])
      );

      // Filter out selections not in the incoming list
      product.selections = product.selections.filter((existing) => {
        const incoming = incomingMap.get(existing.selectionId);
        if (incoming) {
          if (!existing.locked) {
            Object.assign(existing, incoming);
          }
          return true;
        }
        return false;
      });

      // Add new selections not already present
      const existingIds = new Set(product.selections.map((s) => s.selectionId));
      newSelections.forEach((sel) => {
        if (!existingIds.has(sel.selectionId)) {
          product.selections.push(sel);
        }
      });

      // ✅ Save sizeCount to product
      product.sizeCount = sizeCount;

      // Optional render flag toggle
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }

      // Clear redo history
      state.future[side] = [];
    },

    removeNameAndNumberProduct: (state, action) => {
      const { side = "back", id } = action.payload;

      if (!state.present[side]) return;

      state.present[side].nameAndNumberProductList = state.present[
        side
      ].nameAndNumberProductList.filter((product) => product.id !== id);
    },

    addImageState: (state, action) => {
      const { src, id = nanoid(), side = state.activeSide, isRenderOrNot } = action.payload;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const totalElements = state.present[side]?.texts?.length + state.present[side]?.images?.length;
      const canvasComponent = document.querySelector(`#canvas-${side}`); // Simple way, but ideally use refs or context
      const rect = canvasComponent.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const newImage = createNewImage(
        { src: src },
        // { src: src + "?auto=enhance&sharp=80&upscale=true" },
        totalElements,
        centerX,
        centerY
      );
      // const newImage = createNewImage(
      //   { src },
      //   state.present[side].images.length
      // );
      if (!state.present[side].images) {
        state.present[side].images = [];
      }
      state.present[side].selectedImageId = newImage.id;
      state.present[side].images.push(newImage);
      state.future[side] = [];
      // state.present[side].setRendering = !state.present[side].setRendering;
    },

    updateImageState: (state, action) => {
      const {
        id,
        changes,
        side = state.activeSide,
        isRenderOrNot,
      } = action.payload;
      // console.log("id", id, "changes........................", changes);
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
      const image = state.present[side]?.images?.find((img) => img.id === id);
      if (image && !image.locked) Object.assign(image, changes);
      if (isRenderOrNot) {
        state.present[side].setRendering = !state.present[side].setRendering;
      }
      state.future[side] = [];
    },
    // duplicateImageState: (state, action) => {
    //   const side = state.activeSide;
    //   const idToDuplicate = action.payload;

    //   if (!state.present[side]?.images) {
    //     return;
    //   }

    //   const imageToDuplicate = state.present[side].images.find(
    //     (img) => img.id === idToDuplicate
    //   );

    //   if (!imageToDuplicate) {
    //     return;
    //   }

    //   if (imageToDuplicate.locked) {
    //     return;
    //   }


    //   state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

    //   const newPosition = {
    //     x: imageToDuplicate.position.x + 20,
    //     y: imageToDuplicate.position.y + 20,
    //   };

    //   const newImage = {
    //     ...JSON.parse(JSON.stringify(imageToDuplicate)),
    //     id: nanoid(),
    //     position: newPosition,
    //     left: newPosition.x,
    //     top: newPosition.y,
    //     layerIndex: state.present[side].images.length,
    //   };

    //   // console.log("New duplicated image:", newImage);

    //   state.present[side].images.push(newImage);
    //   state.present[side].selectedImageId = newImage.id;
    //   state.future[side] = [];
    //   state.present[side].setRendering = !state.present[side].setRendering;
    // },

    // deleteeee reducers
    deleteTextState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const deletedText = state.present[side].texts.find(t => t.id === action.payload);
      if (!deletedText) return;
      const deletedLayerIndex = deletedText?.layerIndex || 0;

      // Remove the text
      state.present[side].texts = state.present[side].texts.filter(
        (t) => t.id !== action.payload
      );

      const allElements = [
        ...state.present[side].texts,
        ...state.present[side].images
      ].sort((a, b) => a.layerIndex - b.layerIndex);

      allElements.forEach((element, index) => {
        if (element.layerIndex > deletedLayerIndex) {
          if (element.type === 'text') {
            const textIndex = state.present[side].texts.findIndex(t => t.id === element.id);
            if (textIndex !== -1) {
              state.present[side].texts[textIndex].layerIndex = index;
            }
          } else {
            const imageIndex = state.present[side].images.findIndex(i => i.id === element.id);
            if (imageIndex !== -1) {
              state.present[side].images[imageIndex].layerIndex = index;
            }
          }
        }
      });

      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    deleteImageState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      const deletedImage = state.present[side].images.find(i => i.id === action.payload);
      if (!deletedImage) return;
      const deletedLayerIndex = deletedImage?.layerIndex || 0;

      state.present[side].images = state.present[side].images.filter(
        (img) => img.id !== action.payload
      );

      const allElements = [
        ...state.present[side].texts,
        ...state.present[side].images
      ].sort((a, b) => a.layerIndex - b.layerIndex);

      allElements.forEach((element, index) => {
        if (element.layerIndex > deletedLayerIndex) {
          if (element.type === 'text') {
            const textIndex = state.present[side].texts.findIndex(t => t.id === element.id);
            if (textIndex !== -1) {
              state.present[side].texts[textIndex].layerIndex = index;
            }
          } else {
            const imageIndex = state.present[side].images.findIndex(i => i.id === element.id);
            if (imageIndex !== -1) {
              state.present[side].images[imageIndex].layerIndex = index;
            }
          }
        }
      });

      state.future[side] = [];
      state.present[side].setRendering = !state.present[side].setRendering;
    },

    // deleteImageState: (state, action) => {
    //   const side = state.activeSide;
    //   state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));
    //   state.present[side].images = state.present[side].images.filter(
    //     (img) => img.id !== action.payload
    //   );
    //   state.future[side] = [];
    // },

    restoreDesignFromSavedState(state, action) {
      return { ...state, ...action.payload };
    },
    selectedImageIdState: (state, action) => {
      const side = state.activeSide;
      const id = action.payload;
      state.present[side].selectedImageId = id;
      state.present[side].setRendering = !state.present[side].setRendering;
    },
    copyElementToSide: (state, action) => {
      const { fromSide, toSide, elementId, elementType } = action.payload;

      // Find the element to copy (either text or image)
      let elementToCopy;
      if (elementType === 'text') {
        elementToCopy = state.present[fromSide]?.texts?.find(t => t.id === elementId);
      } else if (elementType === 'image') {
        elementToCopy = state.present[fromSide]?.images?.find(i => i.id === elementId);
      }

      if (!elementToCopy) return;

      // Save current state for undo
      state.past[toSide].push(JSON.parse(JSON.stringify(state.present[toSide])));

      // Calculate total elements for proper layer indexing
      const totalElements = state.present[toSide]?.texts?.length + state.present[toSide]?.images?.length;

      // Create the new element
      const newElement = {
        ...JSON.parse(JSON.stringify(elementToCopy)),
        id: nanoid(),
        position: {
          x: elementToCopy.position.x + 20, // Offset to avoid overlap
          y: elementToCopy.position.y + 20,
        },
        layerIndex: totalElements,
      };

      // Update left/top for images if they exist
      if (elementType === 'image') {
        newElement.left = newElement.position.x;
        newElement.top = newElement.position.y;
      }

      // Add to the appropriate array
      if (elementType === 'text') {
        state.present[toSide]?.texts?.push(newElement);
        state.present[toSide].selectedTextId = newElement.id;
        state.present[toSide].selectedImageId = null;
      } else {
        state.present[toSide]?.images?.push(newElement);
        state.present[toSide].selectedImageId = newElement.id;
        state.present[toSide].selectedTextId = null;
      }

      // Trigger render and clear redo history
      state.present[toSide].setRendering = !state.present[toSide].setRendering;
      state.future[toSide] = [];
    },
    // copyTextToSide: (state, action) => {
    //   const { fromSide, toSide, textId } = action.payload;
    //   const imageToCopy = state.present[fromSide]?.images.find((i) => i.id === textId);
    //   const textToCopy = state.present[fromSide]?.texts.find(
    //     (t) => t.id === textId
    //   );

    //   if (!textToCopy) return;

    //   state.past[toSide].push(
    //     JSON.parse(JSON.stringify(state.present[toSide]))
    //   );

    //   const newText = {
    //     ...JSON.parse(JSON.stringify(textToCopy)),
    //     id: nanoid(),
    //     position: {
    //       x: textToCopy.position.x + 20, // Offset to avoid overlap
    //       y: textToCopy.position.y + 20,
    //     },
    //     layerIndex: state.present[toSide].texts.length,
    //   };

    //   state.present[toSide].texts.push(newText);
    //   state.present[toSide].selectedTextId = newText.id;
    //   state.present[toSide].setRendering = !state.present[toSide].setRendering;
    //   state.future[toSide] = [];
    // },
    // -------------layering new
    moveElementForwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Combine texts and images into a single array with type identifiers
      const allElements = [
        ...state.present[side].texts.map(t => ({ ...t, type: 'text' })),
        ...state.present[side].images.map(i => ({ ...i, type: 'image' }))
      ].sort((a, b) => a.layerIndex - b.layerIndex);

      const index = allElements.findIndex(e => e.id === action.payload);
      if (index !== -1 && index < allElements.length - 1) {
        // Swap layer indices
        const temp = allElements[index].layerIndex;
        allElements[index].layerIndex = allElements[index + 1].layerIndex;
        allElements[index + 1].layerIndex = temp;

        // Update the original arrays
        allElements.forEach(element => {
          if (element.type === 'text') {
            const textIndex = state.present[side].texts.findIndex(t => t.id === element.id);
            if (textIndex !== -1) {
              state.present[side].texts[textIndex].layerIndex = element.layerIndex;
            }
          } else {
            const imageIndex = state.present[side].images.findIndex(i => i.id === element.id);
            if (imageIndex !== -1) {
              state.present[side].images[imageIndex].layerIndex = element.layerIndex;
            }
          }
        });
      }

      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    moveElementBackwardState: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Combine texts and images into a single array with type identifiers
      const allElements = [
        ...state.present[side].texts.map(t => ({ ...t, type: 'text' })),
        ...state.present[side].images.map(i => ({ ...i, type: 'image' }))
      ].sort((a, b) => a.layerIndex - b.layerIndex);

      const index = allElements.findIndex(e => e.id === action.payload);
      if (index > 0) {
        // Swap layer indices
        const temp = allElements[index].layerIndex;
        allElements[index].layerIndex = allElements[index - 1].layerIndex;
        allElements[index - 1].layerIndex = temp;

        // Update the original arrays
        allElements.forEach(element => {
          if (element.type === 'text') {
            const textIndex = state.present[side].texts.findIndex(t => t.id === element.id);
            if (textIndex !== -1) {
              state.present[side].texts[textIndex].layerIndex = element.layerIndex;
            }
          } else {
            const imageIndex = state.present[side].images.findIndex(i => i.id === element.id);
            if (imageIndex !== -1) {
              state.present[side].images[imageIndex].layerIndex = element.layerIndex;
            }
          }
        });
      }

      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },
    moveElementToTopmost: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Combine all elements and find max layer index
      const allElements = [
        ...state.present[side].texts.map(t => ({ ...t, type: 'text' })),
        ...state.present[side].images.map(i => ({ ...i, type: 'image' }))
      ];

      const maxLayerIndex = Math.max(...allElements.map(el => el.layerIndex), 0);
      const elementToMove = allElements.find(e => e.id === action.payload);

      if (elementToMove && elementToMove.layerIndex !== maxLayerIndex) {
        // Update the element's layer index to be highest
        if (elementToMove.type === 'text') {
          const textIndex = state.present[side].texts.findIndex(t => t.id === action.payload);
          if (textIndex !== -1) {
            state.present[side].texts[textIndex].layerIndex = maxLayerIndex + 1;
          }
        } else {
          const imageIndex = state.present[side].images.findIndex(i => i.id === action.payload);
          if (imageIndex !== -1) {
            state.present[side].images[imageIndex].layerIndex = maxLayerIndex + 1;
          }
        }
      }

      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },

    moveElementToLowest: (state, action) => {
      const side = state.activeSide;
      state.past[side].push(JSON.parse(JSON.stringify(state.present[side])));

      // Combine all elements and find min layer index
      const allElements = [
        ...state.present[side].texts.map(t => ({ ...t, type: 'text' })),
        ...state.present[side].images.map(i => ({ ...i, type: 'image' }))
      ];

      const minLayerIndex = Math.min(...allElements.map(el => el.layerIndex), 0);
      const elementToMove = allElements.find(e => e.id === action.payload);

      if (elementToMove && elementToMove.layerIndex !== minLayerIndex) {
        // Update the element's layer index to be lowest
        if (elementToMove.type === 'text') {
          const textIndex = state.present[side]?.texts.findIndex(t => t.id === action.payload);
          if (textIndex !== -1) {
            state.present[side].texts[textIndex].layerIndex = minLayerIndex - 1;
          }
        } else {
          const imageIndex = state.present[side]?.images.findIndex(i => i.id === action.payload);
          if (imageIndex !== -1) {
            state.present[side].images[imageIndex].layerIndex = minLayerIndex - 1;
          }
        }
      }

      state.present[side].setRendering = !state.present[side].setRendering;
      state.future[side] = [];
    },
    toggleLoading: (state, action) => {
      const side = state.activeSide;
      const { changes } = action.payload;

      console.log("changes we want to add:", changes);

      // ✅ Safely guard against undefined paths
      if (
        changes &&
        state.present &&
        state.present[side] &&
        state.present[side].loadingState
      ) {
        Object.assign(state.present[side].loadingState, changes);
      } else {
        console.warn("toggleLoading: Target path does not exist", {
          side,
          present: state.present,
        });
      }
    }


  },
});

// ✅ Export Actions
export const {
  moveElementToLowest,
  moveElementToTopmost,
  moveElementBackwardState,
  moveElementForwardState,
  addTextState,
  updateTextState,
  setSelectedTextState,
  moveTextForwardState,
  moveTextBackwardState,
  toggleLockState,
  toggleImageLockState,
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
  copyElementToSide,
  selectedImageIdState,
  setactiveNameAndNumberPrintSide,
  toggleLoading
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
  return (
    state.TextFrontendDesignSlice.present[side]?.texts?.length > 0 ||
    state.TextFrontendDesignSlice.present[side]?.images?.length > 0 ||
    state.TextFrontendDesignSlice.addName ||
    state.TextFrontendDesignSlice.addNumber
  );
  // return state.TextFrontendDesignSlice.present[side]?.length > 0;
};
// export const toggleSleeveDesign = (state) => {
//   return state.sleeveDesign = !state.sleeveDesign;

// }
export default TextFrontendDesignSlice.reducer;

