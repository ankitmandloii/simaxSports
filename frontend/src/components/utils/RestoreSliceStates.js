import { restoreDesignFromSavedState } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import { restoreDesignSelectedProductSlice } from "../../redux/ProductSlice/SelectedProductSlice";
import transformReduxState from "./transformReduxState";

export const restoreAllSlicesFromLocalStorage = (dispatch, parsedState) => {
  // const saved = localStorage.getItem("savedReduxState");
  if (!parsedState) return;

  // let parsedState = JSON.parse(saved);
  // parsedState = transformReduxState(parsedState);

  console.log(
    "parsedState in restoreAllSlicesFromLocalStorage",
    parsedState
  );

  if (parsedState.TextFrontendDesignSlice) {
    dispatch(restoreDesignFromSavedState(parsedState.TextFrontendDesignSlice));
  }

  if (parsedState.selectedProducts) {
    dispatch(restoreDesignSelectedProductSlice(parsedState.selectedProducts));
  }

  // if (parsedState.ui) {
  //   dispatch(restoreDesignSelectedProductSlice(parsedState.ui));
  // }
};
