import { restoreDesignFromSavedState } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
// import { restoreDesignCollectionSlice } from "../../redux/ProductSlice/CollectionSlice";
import { restoreDesignSelectedProductSlice } from "../../redux/ProductSlice/SelectedProductSlice";


export const restoreAllSlicesFromLocalStorage = () => (dispatch) => {
  // alert("hii")    
  // const saved = localStorage.getItem('savedReduxState');
  // if (!saved) return;

  // const parsedState = JSON.parse(saved);


  // if (parsedState.TextFrontendDesignSlice) {
  //   dispatch(restoreDesignFromSavedState(parsedState.TextFrontendDesignSlice));
  // }

  // if (parsedState.selectedProducts) {
  //   dispatch(restoreDesignSelectedProductSlice(parsedState.selectedProducts));
  // }

  // if (parsedState.ui) {
  //   dispatch(restoreDesignSelectedProductSlice(parsedState.ui));
  // }

  // Add others as needed...
};
