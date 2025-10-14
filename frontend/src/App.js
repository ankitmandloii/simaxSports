// import { Routes, Route, useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
// import Layout from "./components/Layout";
// import Review from "./pages/Review/Review";
// import ProductToolbar from "./components/Toolbar/ProductToolbar/ProductToolbar";
// import ProductContainer from "./components/ProductContainer";
// import AddTextToolbar from "./components/Toolbar/AddTextToolbar/AddTextToolbar";
// import "./App.css";
// import UploadArtToolbar from "./components/Toolbar/UploadArtToolbar/UploadArtToolbar";
// import AddArtToolbar from "./components/Toolbar/AddArtToolbar/AddArtToolbar";
// import NamesToolbar from "./components/Toolbar/NamesToolbar/NamesToolbar";
// import QuantityToolbar from "./components/Toolbar/QuantityToolbar/QuantityToolbar";
// import AddImageToolbar from "./components/Toolbar/AddImageToolbar/AddImageToolbar";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import ContinueEditPopup from "./components/PopupComponent/ContinueEditPopup/ContinueEditPopup";
// import { ToastContainer } from "react-toastify";
// import { fetchProducts } from "./redux/ProductSlice/ProductSlice";
// import BottomBar from "./components/bottomBar/BottomBar";
// import FingerprintJS from '@fingerprintjs/fingerprintjs';
// import LoadingScreen from "./components/loadingComponent/LoadingScreen";
// import NotFound from "./pages/NotFound/NotFound";
// import { enableMapSet } from "immer";
// import usePersistQueryParams from "./components/CommonComponent/Customhook";
// import { apiConnecter } from "./components/utils/apiConnector";
// import { fetchSettings } from "./redux/SettingsSlice/SettingsSlice";
// import { restoreEditDesigns } from "./redux/FrontendDesign/TextFrontendDesignSlice";
// import Test from '../../frontend/src/components/Test'
// import db from "../src/db/indexDb";
// import { debounce } from "lodash"
// import { handleImage, transformImagesArray } from "./components/utils/transformReduxState";
// import ColorPicker from "./components/PopupComponent/ColorPicker/ColorPicker";

// enableMapSet();
// function App() {
//   usePersistQueryParams();
//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const searchParams = new URLSearchParams(location.search);
//   const designId = searchParams.get("designId");
//   const mode = searchParams.get("mode");

//   const [continueEditPopup, setContinueEditPopup] = useState(false);
//   const [willRenderContinue, setWillRenderContinue] = useState(false);
//   const [initialCheckDone, setInitialCheckDone] = useState(false);
//   const [laoding, setLoading] = useState(false)
//   const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);

//   const initialState = useSelector((state) => state.TextFrontendDesignSlice);
//   const { canvasWidth, canvasHeight } = useSelector((state) => state.canvasReducer);
//   const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
//   const { present, DesignNotes, nameAndNumberDesignState, addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);

//   const isQuantityPage = location.pathname === "/quantity";
//   const reduxState = useSelector((state) => state);
//   const { list: rawProducts } = useSelector((state) => state.products);


//   // Track Anonymous Users
//   useEffect(() => {
//     let interval = null;
//     let isUnmounted = false;

//     const initTracking = async () => {
//       try {
//         let anonId = sessionStorage.getItem("anon_id");
//         if (!anonId) {
//           const fp = await FingerprintJS.load();
//           const result = await fp.get();
//           anonId = result.visitorId;
//           sessionStorage.setItem("anon_id", anonId);
//         }

//         let locationData = null;
//         try {
//           const locationRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
//           const data = await locationRes.json();
//           locationData = {
//             city: data.city,
//             country: data.country,
//             region: data.region,
//             lat: data.latitude,
//             lon: data.longitude,
//             ip: data.ip
//           };
//         } catch (locErr) {
//           console.error('Failed to fetch location:', locErr);
//         }

//         const sendPing = (withLocation = false) => {
//           if (!navigator.onLine || document.visibilityState !== 'visible') return;
//           fetch(`${BASE_URL}auth/tActiveUserL`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               anonId,
//               ...(withLocation && locationData ? { location: locationData } : {})
//             })
//           }).catch(err => console.error("Ping failed:", err));
//         };

//         sendPing(true);

//         interval = setInterval(() => {
//           if (!isUnmounted) sendPing(false);
//         }, 2 * 60 * 1000);

//       } catch (err) {
//         console.error('Tracking error:', err);
//       }
//     };

//     initTracking();

//     return () => {
//       isUnmounted = true;
//       if (interval) clearInterval(interval);
//     };

//   }, []);


//   //last Final Code 7:41 pm
//   // useEffect(() => {
//   //   let interval;

//   //   const initTracking = async () => {
//   //     try {
//   //       // 1 Get or create anonId
//   //       let anonId = sessionStorage.getItem("anon_id");
//   //       if (!anonId) {
//   //         const fp = await FingerprintJS.load();
//   //         const result = await fp.get();
//   //         anonId = result.visitorId;
//   //         sessionStorage.setItem("anon_id", anonId);
//   //       }

//   //       // 2 Get location data
//   //       let locationData = null;
//   //       try {
//   //         const locationRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
//   //         const data = await locationRes.json();
//   //         locationData = {
//   //           city: data.city,
//   //           country: data.country,
//   //           region: data.region,
//   //           lat: data.latitude,
//   //           lon: data.longitude,
//   //           ip: data.ip
//   //         };
//   //       } catch (locErr) {
//   //         console.error('Failed to fetch location:', locErr);
//   //       }

//   //       // 3 Send first ping (with location if available)
//   //       const sendPing = (withLocation = false) => {
//   //         fetch(`${BASE_URL}auth/tActiveUserL`, {
//   //           method: 'POST',
//   //           headers: { 'Content-Type': 'application/json' },
//   //           body: JSON.stringify({
//   //             anonId,
//   //             ...(withLocation && locationData ? { location: locationData } : {})
//   //           })
//   //         }).catch(err => console.error("Ping failed:", err));
//   //       };

//   //       if (navigator.onLine && document.visibilityState === 'visible') {
//   //         sendPing(false);
//   //       }  // First ping with location

//   //       //4 Set interval pings (without location)
//   //       interval = setInterval(() => sendPing(false), 2 * 60 * 1000);

//   //     } catch (err) {
//   //       console.error('Tracking error:', err);
//   //     }
//   //   };

//   //   initTracking();

//   //   return () => {
//   //     if (interval) clearInterval(interval);
//   //   };

//   // }, []);








//   //  useEffect(() => {
//   //     const fetchLocation = async () => {
//   //       try {
//   //         const res = await fetch('http://ip-api.com/json');
//   //         const data = await res.json();
//   //         console.log('Location data:', data);

//   //         // Send to your backend
//   //         await fetch(`${BASE_URL}auth/track-location`, {
//   //           method: 'POST',
//   //           headers: { 'Content-Type': 'application/json' },
//   //           body: JSON.stringify({
//   //             city: data.city,
//   //             country: data.country,
//   //             region: data.regionName,
//   //             lat: data.lat,
//   //             lon: data.lon,
//   //             ip: data.query
//   //           })
//   //         });
//   //       } catch (err) {
//   //         console.error('Error fetching location:', err);
//   //       }
//   //     };

//   //     fetchLocation();
//   //   }, []);


//   // //for Track How many active users currntly
//   // useEffect(() => {
//   //   let interval;

//   //   const trackAnonymousUser = async () => {
//   //     try {
//   //       const cachedId = sessionStorage.getItem("anon_id");
//   //       let anonId = cachedId;

//   //       if (!anonId) {
//   //         const fp = await FingerprintJS.load();
//   //         const result = await fp.get();
//   //         anonId = result.visitorId;
//   //         sessionStorage.setItem("anon_id", anonId);
//   //       }

//   //       const pingServer = () => {
//   //         fetch(`${BASE_URL}auth/track-anonymous-user`, {
//   //           method: 'POST',
//   //           headers: { 'Content-Type': 'application/json' },
//   //           body: JSON.stringify({ anonId }),
//   //         }).catch((err) => console.error("Ping failed:", err));
//   //       };

//   //       pingServer();
//   //       interval = setInterval(pingServer, 2 * 60 * 1000);
//   //     } catch (error) {
//   //       console.error("Fingerprint error:", error);
//   //     }
//   //   };

//   //   trackAnonymousUser();

//   //   return () => {
//   //     clearInterval(interval);
//   //   };
//   // }, []);



//   // Save Redux state to localStorage (iOS-friendly)

//   function transformReduxState(state) {
//     try {
//       if (!state || typeof state !== "object") return state;

//       const sides = ["front", "back", "leftSleeve", "rightSleeve"];
//       const newState = { ...state };

//       if (!newState.TextFrontendDesignSlice || typeof newState.TextFrontendDesignSlice !== "object") {
//         return newState;
//       }

//       const slice = { ...newState.TextFrontendDesignSlice };

//       const safeMapImages = (images = []) =>
//         Array.isArray(images)
//           ? images.map((img) => {
//             if (img && typeof img === "object" && img.base64CanvasImage) {
//               const { base64CanvasImage, src, ...rest } = img;
//               return {
//                 ...rest,
//                 base64CanvasImage: src, // ✅ move base64 → src
//               };
//             }
//             return img;
//           })
//           : images;

//       sides.forEach((side) => {
//         if (slice.present?.[side]?.images) {
//           slice.present = { ...slice.present };
//           slice.present[side] = { ...slice.present[side] };
//           slice.present[side].images = safeMapImages(slice.present[side].images);
//         }
//       });

//       newState.TextFrontendDesignSlice = slice;
//       return newState;
//     } catch (err) {
//       console.error("transformReduxState error:", err);
//       return state; // fallback
//     }
//   }

//   const saveStateDebounced = debounce(async (reduxState) => {
//     try {
//       await db.state.put({ id: "redux", data: reduxState });
//       // console.log("✅ Redux state saved (debounced)");
//     } catch (e) {
//       console.error("❌ Error saving state:", e);
//     }
//   }, 1000);
//   useEffect(() => {
//     // console.log("initialCheckDone value", initialCheckDone)
//     if (!reduxState || !initialCheckDone) return
//     // setTimeout(() => {
//     // }, 10000);
//     saveStateDebounced(reduxState)
//   }, [reduxState]);
//   // Save whenever reduxState changes
//   // useEffect(() => {
//   //   if (!reduxState || !setWillRenderContinue) return;

//   //   try {
//   //     const transformedState = transformReduxState(reduxState);
//   //     console.log("Saving Redux state to localStorage...", transformedState);
//   //     localStorage.setItem("savedReduxState", JSON.stringify(transformedState));
//   //   } catch (e) {
//   //     console.error("Error saving Redux state:", e);
//   //   }
//   // }, [reduxState]);


//   // Fetch product list on mount
//   useEffect(() => {
//     setTimeout(() => {
//       dispatch(fetchProducts());
//       dispatch(fetchSettings());

//     }, 5000);
//   }, [dispatch]);




//   async function restorePresentFromData(incomingPresent, src) {
//     console.log("incomingPresent", incomingPresent);
//     const sides = ["front", "back", "leftSleeve", "rightSleeve"];
//     const restored = {};

//     for (const side of sides) {
//       const originalImages = incomingPresent?.[side]?.images || [];

//       // 🔹 Call transformImagesArray for each side
//       const enhancedImages = await transformImagesArray(originalImages);

//       restored[side] = {
//         selectedTextId: null,
//         selectedImageId: null,
//         loadingState: {
//           loading: false,
//           position: null,
//         },
//         texts:
//           incomingPresent?.[side]?.texts?.map((t) => ({
//             ...t,
//             fontSize: 20,
//           })) || [],
//         images: enhancedImages, // ✅ processed images here
//         setRendering: false,
//         nameAndNumberProductList: [],
//       };
//     }

//     return restored;
//   }



//   async function editDesignHandler() {
//     try {
//       if (!mode || (mode !== "share" && mode !== "edit") || !designId) return;

//       setLoading(true);

//       const response = await apiConnecter(
//         "get",
//         "design/getDesignsFromFrontEndById",
//         "",
//         "",
//         { designId }
//       );

//       console.log(response, "response from server for design id share mode");

//       const matchedDesigns = response?.data?.userDesigns?.designs || [];

//       if (matchedDesigns.length === 0) {
//         console.error("Design not found for id:", designId);
//         return;
//       }

//       const apiData = matchedDesigns[0];

//       // ✅ Await restorePresentFromData because it is async
//       const restoredPresent = await restorePresentFromData(apiData.present);

//       const restoredState = {
//         present: restoredPresent,
//         DesignNotes: apiData.DesignNotes || initialState.DesignNotes,
//       };

//       console.log(restoredPresent, "✅ restoredPresent (final)");

//       // ✅ Dispatch restored data to Redux (after waiting for async image processing)
//       dispatch(restoreEditDesigns(restoredPresent));

//     } catch (e) {
//       console.error("❌ Error while fetching design:", e);
//     } finally {
//       setLoading(false);
//     }
//   }



//   // Check if saved state should trigger continue edit popup
//   useEffect(() => {
//     if (!willRenderContinue && rawProducts.length > 0) {
//       const checkSavedState = async () => {
//         try {
//           const savedState = await db.state.get("redux");
//           console.log("savedState", savedState)

//           if (!savedState || !savedState?.data?.TextFrontendDesignSlice) {
//             setInitialCheckDone(true)
//             return;
//           }

//           const { addName, addNumber, present } =
//             savedState.data.TextFrontendDesignSlice;

//           const sides = Object.keys(present || {});
//           let hasDesign = false;

//           for (const side of sides) {
//             const textObjects = present[side]?.texts || [];
//             const imgObjects = present[side]?.images || [];

//             if (textObjects.length > 0 || imgObjects.length > 0) {
//               hasDesign = true;
//               break; // no need to continue if found
//             }
//           }

//           if ((hasDesign || addName || addNumber) && !mode) {
//             setWillRenderContinue(true);
//             setContinueEditPopup(true);
//           }
//           setInitialCheckDone(true)

//         } catch (e) {
//           console.error("Error reading saved Redux state:", e);
//         }

//         // Tumhara handler

//       };

//       checkSavedState();
//     }
//   }, [rawProducts, willRenderContinue]);


//   const handleContinuePopup = () => {
//     setContinueEditPopup(false);
//   };
//   // set initial
//   // useEffect(() => {
//   // if (location.pathname === "/") {
//   // }
//   // navigate("design/product", { replace: true });
//   // }, []);

//   useEffect(() => {
//     // If user is not already inside /design/* → force redirect
//     if (!location.pathname.startsWith("/design")) {
//       navigate("/design/product", { replace: true });
//     }
//     editDesignHandler();
//   }, []);

//   return (
//     <>
//       <div className="app-main-container">
//         <div className="main-inner-container">

//           <div
//             className={`main-layout-container ${isQuantityPage ? "quantity-page" : ""
//               }`}
//           >
//             {rawProducts.length === 0 || laoding ? (
//               <>
//                 <div
//                   className="fullscreen-loader"
//                   style={{ flexDirection: "column" }}
//                 >
//                   <LoadingScreen />
//                 </div>
//               </>
//             ) : (
//               <></>
//             )}

//             <Routes>
//               {/* Layout wraps all valid pages including /design and /review */}
//               <Route path="/" element={<Layout />}>
//                 <Route index element={<Navigate to="design/product" replace />} />

//                 {/* /design pages */}
//                 <Route path="design">
//                   <Route path="product" element={<ProductToolbar />} />
//                   {/* <Route path="product" element={<Test />} /> */}

//                   <Route path="addText" element={<AddTextToolbar />} />
//                   <Route path="addImage" element={<AddImageToolbar />} />
//                   <Route path="products" element={<ProductContainer />} />
//                   <Route path="uploadArt" element={<UploadArtToolbar />} />
//                   <Route path="addArt" element={<AddArtToolbar />} />
//                   <Route path="addNames" element={<NamesToolbar />} />

//                   {/* Catch invalid nested routes in /design */}
//                   {/* <Route path="*" element={<NotFound />} /> */}
//                 </Route>
//                 <Route path="quantity" element={<QuantityToolbar />} />

//                 {/* /review page with Layout (not nested under /design) */}
//                 <Route path="review" element={<Review />} />

//                 {/* Catch any other invalid top-level routes */}

//               </Route>
//               <Route path="*" element={<NotFound />} />
//             </Routes>


//           </div>
//         </div>

//         <ToastContainer
//           style={{ zIndex: "99999" }}
//           position="bottom-center"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           pauseOnHover
//           draggable
//           theme="light"
//           limit={1}
//         />

//         {continueEditPopup && (
//           <ContinueEditPopup handleContinuePopup={handleContinuePopup} {...{ activeSide, canvasWidth, canvasHeight, present, DesignNotes, nameAndNumberDesignState, addName, addNumber, activeNameAndNumberPrintSide }} />
//         )}

//         <BottomBar />
//       </div>

//       <canvas id="canvas-export" style={{ display: "none" }} />
//       <canvas id="HelperCanvas" style={{ display: "none" }}></canvas>
//     </>
//   );
// }

// export default App;


import { Routes, Route, useLocation, useNavigate, useParams, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Review from "./pages/Review/Review";
import ProductToolbar from "./components/Toolbar/ProductToolbar/ProductToolbar";
import ProductContainer from "./components/ProductContainer";
import AddTextToolbar from "./components/Toolbar/AddTextToolbar/AddTextToolbar";
import "./App.css";
import UploadArtToolbar from "./components/Toolbar/UploadArtToolbar/UploadArtToolbar";
import AddArtToolbar from "./components/Toolbar/AddArtToolbar/AddArtToolbar";
import NamesToolbar from "./components/Toolbar/NamesToolbar/NamesToolbar";
import QuantityToolbar from "./components/Toolbar/QuantityToolbar/QuantityToolbar";
import AddImageToolbar from "./components/Toolbar/AddImageToolbar/AddImageToolbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContinueEditPopup from "./components/PopupComponent/ContinueEditPopup/ContinueEditPopup";
import { ToastContainer } from "react-toastify";
import { fetchProducts } from "./redux/ProductSlice/ProductSlice";
import BottomBar from "./components/bottomBar/BottomBar";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import LoadingScreen from "./components/loadingComponent/LoadingScreen";
import NotFound from "./pages/NotFound/NotFound";
import { enableMapSet } from "immer";
import usePersistQueryParams from "./components/CommonComponent/Customhook";
import { apiConnecter } from "./components/utils/apiConnector";
import { fetchSettings } from "./redux/SettingsSlice/SettingsSlice";
import { restoreEditDesigns } from "./redux/FrontendDesign/TextFrontendDesignSlice";
import db from "../src/db/indexDb";
import { debounce } from "lodash"
import { handleImage, transformImagesArray } from "./components/utils/transformReduxState";
import ColorPicker from "./components/PopupComponent/ColorPicker/ColorPicker";
import AddProductContainer from "./components/PopupComponent/addProductContainer/AddProductContainer";
import ChangePopup from "./components/PopupComponent/ChangeProductPopup/ChangePopup";
import {
  closeAddProduct,
  closeChangeProduct,
  resetProductPopup, closeAddNamesPopup, openChangeProduct
} from "./redux/Productpopupslice.js";
import {
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  setActiveProduct
} from "./redux/ProductSlice/SelectedProductSlice";
import AddNamesPopup from './components/PopupComponent/AddNamesPopup/AddNamesPopup'

enableMapSet();

function App() {
  usePersistQueryParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const designId = searchParams.get("designId");
  const mode = searchParams.get("mode");

  const [continueEditPopup, setContinueEditPopup] = useState(false);
  const [willRenderContinue, setWillRenderContinue] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [laoding, setLoading] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });

  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const initialState = useSelector((state) => state.TextFrontendDesignSlice);
  const { canvasWidth, canvasHeight } = useSelector((state) => state.canvasReducer);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  const { present, DesignNotes, nameAndNumberDesignState, addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);

  const isQuantityPage = location.pathname === "/quantity";
  const reduxState = useSelector((state) => state);
  const { list: rawProducts } = useSelector((state) => state.products);

  // Product popup state from Redux
  const {
    isAddProductOpen,
    isChangeProductOpen,
    editingProductIndex,
    isAddingProduct,
    isAddNamesPopupOpen,


  } = useSelector((state) => state.productPopup);

  // Safe clone color function
  const safeCloneColor = (color, fallbackImg = '', allVariants = []) => {
    if (!color || typeof color !== "object" || Array.isArray(color)) {
      return { name: String(color), img: fallbackImg, swatchImg: fallbackImg, allVariants: allVariants || [] };
    }

    const colorName = color.name?.toLowerCase().trim();
    const variant = allVariants?.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase().trim() === colorName
      )
    );
    const swatchImg =
      variant?.metafields?.edges?.find(
        (mf) => mf.node.key === 'swatch_image' && mf.node.namespace === 'custom'
      )?.node.value || color.swatchImg || color.img || fallbackImg;

    return {
      ...color,
      swatchImg,
      img: color.img || fallbackImg,
      allVariants: allVariants || color.allVariants || [],
    };
  };

  // Handle product selection
  const handleProductSelect = (product, selectedColor = null) => {
    console.log("---------product", product);
    const fallbackImg = product?.img || product?.imgurl || product?.selectedImage || '';
    const clonedColor = selectedColor
      ? safeCloneColor(selectedColor, fallbackImg, product.allVariants)
      : product.selectedColor
        ? safeCloneColor(product.selectedColor, fallbackImg, product.allVariants)
        : product.colors?.[0]
          ? safeCloneColor(product.colors[0], fallbackImg, product.allVariants)
          : { name: 'default', img: fallbackImg, swatchImg: fallbackImg, allVariants: product.allVariants || [] };

    const updatedProduct = {
      ...product,
      selectedColor: clonedColor,
      imgurl: clonedColor?.img || fallbackImg,
      swatchImg: clonedColor?.swatchImg || fallbackImg,
      allVariants: product.allVariants || [],
      vendor: product?.vendor
    };

    if (isAddingProduct) {
      console.log("-----------addproduct call")
      dispatch(addProductAction(updatedProduct));
      const newIndex = selectedProducts.length;
      dispatch(setActiveProduct(updatedProduct));
      setActiveThumbnail({ productIndex: newIndex, colorIndex: 0 });
    } else if (editingProductIndex !== null) {
      dispatch(updateProductAction({ index: editingProductIndex, product: updatedProduct }));
      dispatch(setActiveProduct(updatedProduct));
      setActiveThumbnail({ productIndex: editingProductIndex, colorIndex: 0 });
    }

    // Close popups
    dispatch(closeAddProduct());
    dispatch(closeChangeProduct());
  };

  // Track Anonymous Users
  useEffect(() => {
    let interval = null;
    let isUnmounted = false;

    const initTracking = async () => {
      try {
        let anonId = sessionStorage.getItem("anon_id");
        if (!anonId) {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          anonId = result.visitorId;
          sessionStorage.setItem("anon_id", anonId);
        }

        let locationData = null;
        try {
          const locationRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
          const data = await locationRes.json();
          locationData = {
            city: data.city,
            country: data.country,
            region: data.region,
            lat: data.latitude,
            lon: data.longitude,
            ip: data.ip
          };
        } catch (locErr) {
          console.error('Failed to fetch location:', locErr);
        }

        const sendPing = (withLocation = false) => {
          if (!navigator.onLine || document.visibilityState !== 'visible') return;
          fetch(`${BASE_URL}auth/tActiveUserL`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              anonId,
              ...(withLocation && locationData ? { location: locationData } : {})
            })
          }).catch(err => console.error("Ping failed:", err));
        };

        sendPing(true);

        interval = setInterval(() => {
          if (!isUnmounted) sendPing(false);
        }, 2 * 60 * 1000);

      } catch (err) {
        console.error('Tracking error:', err);
      }
    };

    initTracking();

    return () => {
      isUnmounted = true;
      if (interval) clearInterval(interval);
    };

  }, []);

  function transformReduxState(state) {
    try {
      if (!state || typeof state !== "object") return state;

      const sides = ["front", "back", "leftSleeve", "rightSleeve"];
      const newState = { ...state };

      if (!newState.TextFrontendDesignSlice || typeof newState.TextFrontendDesignSlice !== "object") {
        return newState;
      }

      const slice = { ...newState.TextFrontendDesignSlice };

      const safeMapImages = (images = []) =>
        Array.isArray(images)
          ? images.map((img) => {
            if (img && typeof img === "object" && img.base64CanvasImage) {
              const { base64CanvasImage, src, ...rest } = img;
              return {
                ...rest,
                base64CanvasImage: src,
              };
            }
            return img;
          })
          : images;

      sides.forEach((side) => {
        if (slice.present?.[side]?.images) {
          slice.present = { ...slice.present };
          slice.present[side] = { ...slice.present[side] };
          slice.present[side].images = safeMapImages(slice.present[side].images);
        }
      });

      newState.TextFrontendDesignSlice = slice;
      return newState;
    } catch (err) {
      console.error("transformReduxState error:", err);
      return state;
    }
  }

  const saveStateDebounced = debounce(async (reduxState) => {
    try {
      await db.state.put({ id: "redux", data: reduxState });
    } catch (e) {
      console.error("❌ Error saving state:", e);
    }
  }, 1000);

  useEffect(() => {
    if (!reduxState || !initialCheckDone) return
    saveStateDebounced(reduxState)
  }, [reduxState]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchProducts());
      dispatch(fetchSettings());
    }, 5000);
  }, [dispatch]);

  async function restorePresentFromData(incomingPresent, src) {
    console.log("incomingPresent", incomingPresent);
    const sides = ["front", "back", "leftSleeve", "rightSleeve"];
    const restored = {};

    for (const side of sides) {
      const originalImages = incomingPresent?.[side]?.images || [];
      const enhancedImages = await transformImagesArray(originalImages);

      restored[side] = {
        selectedTextId: null,
        selectedImageId: null,
        loadingState: {
          loading: false,
          position: null,
        },
        texts:
          incomingPresent?.[side]?.texts?.map((t) => ({
            ...t,
            fontSize: 20,
          })) || [],
        images: enhancedImages,
        setRendering: false,
        nameAndNumberProductList: [],
      };
    }

    return restored;
  }

  async function editDesignHandler() {
    try {
      if (!mode || (mode !== "share" && mode !== "edit") || !designId) return;

      setLoading(true);

      const response = await apiConnecter(
        "get",
        "design/getDesignsFromFrontEndById",
        "",
        "",
        { designId }
      );

      console.log(response, "response from server for design id share mode");

      const matchedDesigns = response?.data?.userDesigns?.designs || [];

      if (matchedDesigns.length === 0) {
        console.error("Design not found for id:", designId);
        return;
      }

      const apiData = matchedDesigns[0];
      const restoredPresent = await restorePresentFromData(apiData.present);

      const restoredState = {
        present: restoredPresent,
        DesignNotes: apiData.DesignNotes || initialState.DesignNotes,
      };

      console.log(restoredPresent, "✅ restoredPresent (final)");

      dispatch(restoreEditDesigns(restoredPresent));

    } catch (e) {
      console.error("❌ Error while fetching design:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!willRenderContinue && rawProducts.length > 0) {
      const checkSavedState = async () => {
        try {
          const savedState = await db.state.get("redux");
          console.log("savedState", savedState)

          if (!savedState || !savedState?.data?.TextFrontendDesignSlice) {
            setInitialCheckDone(true)
            return;
          }

          const { addName, addNumber, present } =
            savedState.data.TextFrontendDesignSlice;

          const sides = Object.keys(present || {});
          let hasDesign = false;

          for (const side of sides) {
            const textObjects = present[side]?.texts || [];
            const imgObjects = present[side]?.images || [];

            if (textObjects.length > 0 || imgObjects.length > 0) {
              hasDesign = true;
              break;
            }
          }

          if ((hasDesign || addName || addNumber) && !mode) {
            setWillRenderContinue(true);
            setContinueEditPopup(true);
          }
          setInitialCheckDone(true)

        } catch (e) {
          console.error("Error reading saved Redux state:", e);
        }
      };

      checkSavedState();
    }
  }, [rawProducts, willRenderContinue]);

  const handleContinuePopup = () => {
    setContinueEditPopup(false);
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/design")) {
      navigate("/design/product", { replace: true });
    }
    editDesignHandler();
  }, []);

  return (
    <>
      <div className="app-main-container">
        <div className="main-inner-container">
          <div
            className={`main-layout-container ${isQuantityPage ? "quantity-page" : ""}`}
          >
            {rawProducts.length === 0 || laoding ? (
              <>
                <div
                  className="fullscreen-loader"
                  style={{ flexDirection: "column" }}
                >
                  <LoadingScreen />
                </div>
              </>
            ) : (
              <></>
            )}

            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="design/product" replace />} />

                <Route path="design">
                  <Route path="product" element={<ProductToolbar />} />
                  <Route path="addText" element={<AddTextToolbar />} />
                  <Route path="addImage" element={<AddImageToolbar />} />
                  <Route path="products" element={<ProductContainer />} />
                  <Route path="uploadArt" element={<UploadArtToolbar />} />
                  <Route path="addArt" element={<AddArtToolbar />} />
                  <Route path="addNames" element={<NamesToolbar />} />
                </Route>
                <Route path="quantity" element={<QuantityToolbar />} />
                <Route path="review" element={<Review />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>

        <ToastContainer
          style={{ zIndex: "99999" }}
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          limit={1}
        />

        {continueEditPopup && (
          <ContinueEditPopup
            handleContinuePopup={handleContinuePopup}
            {...{ activeSide, canvasWidth, canvasHeight, present, DesignNotes, nameAndNumberDesignState, addName, addNumber, activeNameAndNumberPrintSide }}
          />
        )}

        {/* Add Product Popup - Now in App.js */}
        {isAddProductOpen && (
          <AddProductContainer
            isOpen={isAddProductOpen}
            onClose={() => dispatch(closeAddProduct())}
            onProductSelect={handleProductSelect}
            openChangeProductPopup={(isAdd, index) => {
              dispatch(closeAddProduct());
              dispatch(openChangeProduct(isAdd, index));
            }}
          />
        )}

        {/* Change Product Popup - Now in App.js */}
        {isChangeProductOpen && (
          <ChangePopup
            onClose={() => dispatch(closeChangeProduct())}
            onProductSelect={handleProductSelect}
          />
        )}

        {isAddNamesPopupOpen && (
          < AddNamesPopup onClose={() => dispatch(closeAddNamesPopup())} />
        )}

        <BottomBar />
      </div>

      <canvas id="canvas-export" style={{ display: "none" }} />
      <canvas id="HelperCanvas" style={{ display: "none" }}></canvas>
    </>
  );
}

export default App;