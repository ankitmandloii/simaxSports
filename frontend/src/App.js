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
import Test from '../../frontend/src/components/Test'

enableMapSet();
function App() {
  usePersistQueryParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [continueEditPopup, setContinueEditPopup] = useState(false);
  const [willRenderContinue, setWillRenderContinue] = useState(false);
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);

  const initialState = useSelector((state) => state.TextFrontendDesignSlice);
  const { canvasWidth, canvasHeight } = useSelector((state) => state.canvasReducer);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  const { present, DesignNotes, nameAndNumberDesignState, addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);

  const isQuantityPage = location.pathname === "/quantity";
  const reduxState = useSelector((state) => state);
  const { list: rawProducts } = useSelector((state) => state.products);


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


  //last Final Code 7:41 pm
  // useEffect(() => {
  //   let interval;

  //   const initTracking = async () => {
  //     try {
  //       // 1 Get or create anonId
  //       let anonId = sessionStorage.getItem("anon_id");
  //       if (!anonId) {
  //         const fp = await FingerprintJS.load();
  //         const result = await fp.get();
  //         anonId = result.visitorId;
  //         sessionStorage.setItem("anon_id", anonId);
  //       }

  //       // 2 Get location data
  //       let locationData = null;
  //       try {
  //         const locationRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
  //         const data = await locationRes.json();
  //         locationData = {
  //           city: data.city,
  //           country: data.country,
  //           region: data.region,
  //           lat: data.latitude,
  //           lon: data.longitude,
  //           ip: data.ip
  //         };
  //       } catch (locErr) {
  //         console.error('Failed to fetch location:', locErr);
  //       }

  //       // 3 Send first ping (with location if available)
  //       const sendPing = (withLocation = false) => {
  //         fetch(`${BASE_URL}auth/tActiveUserL`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             anonId,
  //             ...(withLocation && locationData ? { location: locationData } : {})
  //           })
  //         }).catch(err => console.error("Ping failed:", err));
  //       };

  //       if (navigator.onLine && document.visibilityState === 'visible') {
  //         sendPing(false);
  //       }  // First ping with location

  //       //4 Set interval pings (without location)
  //       interval = setInterval(() => sendPing(false), 2 * 60 * 1000);

  //     } catch (err) {
  //       console.error('Tracking error:', err);
  //     }
  //   };

  //   initTracking();

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };

  // }, []);








  //  useEffect(() => {
  //     const fetchLocation = async () => {
  //       try {
  //         const res = await fetch('http://ip-api.com/json');
  //         const data = await res.json();
  //         console.log('Location data:', data);

  //         // Send to your backend
  //         await fetch(`${BASE_URL}auth/track-location`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             city: data.city,
  //             country: data.country,
  //             region: data.regionName,
  //             lat: data.lat,
  //             lon: data.lon,
  //             ip: data.query
  //           })
  //         });
  //       } catch (err) {
  //         console.error('Error fetching location:', err);
  //       }
  //     };

  //     fetchLocation();
  //   }, []);


  // //for Track How many active users currntly
  // useEffect(() => {
  //   let interval;

  //   const trackAnonymousUser = async () => {
  //     try {
  //       const cachedId = sessionStorage.getItem("anon_id");
  //       let anonId = cachedId;

  //       if (!anonId) {
  //         const fp = await FingerprintJS.load();
  //         const result = await fp.get();
  //         anonId = result.visitorId;
  //         sessionStorage.setItem("anon_id", anonId);
  //       }

  //       const pingServer = () => {
  //         fetch(`${BASE_URL}auth/track-anonymous-user`, {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ anonId }),
  //         }).catch((err) => console.error("Ping failed:", err));
  //       };

  //       pingServer();
  //       interval = setInterval(pingServer, 2 * 60 * 1000);
  //     } catch (error) {
  //       console.error("Fingerprint error:", error);
  //     }
  //   };

  //   trackAnonymousUser();

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);



  // Save Redux state to localStorage (iOS-friendly)

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
                base64CanvasImage: src, // ✅ move base64 → src
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
      return state; // fallback
    }
  }


  useEffect(() => {
    if (!reduxState) return

    const handleSaveState = () => {
      try {
        // const transformedState = transformReduxState(reduxState);
        // console.log("transformedState", transformedState);
        localStorage.setItem("savedReduxState", JSON.stringify(reduxState));
      } catch (e) {
        console.error("Error saving Redux state to localStorage:", e);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleSaveState();
      }
    };

    window.addEventListener("pagehide", handleSaveState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handleSaveState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [reduxState]);
  // Save whenever reduxState changes
  // useEffect(() => {
  //   if (!reduxState || !setWillRenderContinue) return;

  //   try {
  //     const transformedState = transformReduxState(reduxState);
  //     console.log("Saving Redux state to localStorage...", transformedState);
  //     localStorage.setItem("savedReduxState", JSON.stringify(transformedState));
  //   } catch (e) {
  //     console.error("Error saving Redux state:", e);
  //   }
  // }, [reduxState]);


  // Fetch product list on mount
  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchProducts());
      dispatch(fetchSettings());

    }, 5000);
  }, [dispatch]);

  function restorePresentFromData(incomingPresent, src) {
    const sides = ["front", "back", "leftSleeve", "rightSleeve"];
    const restored = {};

    sides.forEach(side => {
      const originalImages = incomingPresent?.[side]?.images || [];

      const enhancedImages = originalImages.map(image => ({
        ...image,
        base64CanvasImage: image.src  // Add base64 image string to each image
      }));

      restored[side] = {
        selectedTextId: null,
        selectedImageId: null,
        loadingState: {
          loading: false,
          position: null
        },
        texts: incomingPresent?.[side]?.texts || [],
        images: enhancedImages,
        setRendering: false,
        nameAndNumberProductList: [],
      };
    });

    return restored;
  }


  async function editDesignHandler() {
    try {
      const searchParams = new URLSearchParams(location.search);
      const designId = searchParams.get("designId");
      const mode = searchParams.get("mode");
      if (!mode) return;

      // agar mode "share" ya "edit" nahi hai
      if (mode !== "share" && mode !== "edit") return;
      if (!designId) return;

      // console.log(designStateDb);
      const response = await apiConnecter("get", "design/getDesignsFromFrontEndById", "", "", { designId });
      // console.log(response);

      const matchedDesigns = response.data.userDesigns.designs;

      if (matchedDesigns.length === 0) {
        console.error("Design not found for id:", designId);
      } else {
        const apiData = matchedDesigns[0]; // get the first match

        const restoredState = {
          // ...initialState,
          present: restorePresentFromData(apiData.present),
          DesignNotes: apiData.DesignNotes || initialState.DesignNotes,
        };
        console.log(restorePresentFromData(apiData.present));
        dispatch(restoreEditDesigns(restorePresentFromData(apiData.present)))

        // console.log(restoredState);
      }

    }
    catch (e) {
      console.log("error while fetching desing", e)
    }

  }


  // Check if saved state should trigger continue edit popup
  useEffect(() => {
    if (!willRenderContinue && rawProducts.length > 0) {
      let savedState = null;
      try {
        // localStorage.removeItem("savedReduxState");
        savedState = JSON.parse(localStorage.getItem("savedReduxState"));
      } catch (e) {
        console.error("Error parsing saved Redux state:", e);
        return;
      }

      if (!savedState || !savedState.TextFrontendDesignSlice) return;

      const { addName, addNumber, present, activeSide } =
        savedState.TextFrontendDesignSlice;
      const textObjects = present?.[activeSide]?.texts || [];

      const imgObjects = present?.[activeSide]?.images || [];


      if ((textObjects.length > 0) || (imgObjects.length > 0) || addName || addNumber) {
        setWillRenderContinue(true);
        setContinueEditPopup(true);
      }
    }
    editDesignHandler();
  }, [rawProducts, willRenderContinue]);

  const handleContinuePopup = () => {
    setContinueEditPopup(false);
  };
  // set initial
  // useEffect(() => {
  // if (location.pathname === "/") {
  // }
  // navigate("design/product", { replace: true });
  // }, []);

  useEffect(() => {
    // If user is not already inside /design/* → force redirect
    if (!location.pathname.startsWith("/design")) {
      navigate("/design/product", { replace: true });
    }
  }, []);

  return (
    <>
      <div className="app-main-container">





        <div className="main-inner-container">

          <div
            className={`main-layout-container ${isQuantityPage ? "quantity-page" : ""
              }`}
          >
            {rawProducts.length === 0 ? (
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
              {/* Layout wraps all valid pages including /design and /review */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="design/product" replace />} />

                {/* /design pages */}
                <Route path="design">
                  <Route path="product" element={<ProductToolbar />} />
                  {/* <Route path="product" element={<Test />} /> */}

                  <Route path="addText" element={<AddTextToolbar />} />
                  <Route path="addImage" element={<AddImageToolbar />} />
                  <Route path="products" element={<ProductContainer />} />
                  <Route path="uploadArt" element={<UploadArtToolbar />} />
                  <Route path="addArt" element={<AddArtToolbar />} />
                  <Route path="addNames" element={<NamesToolbar />} />

                  {/* Catch invalid nested routes in /design */}
                  {/* <Route path="*" element={<NotFound />} /> */}
                </Route>
                <Route path="quantity" element={<QuantityToolbar />} />

                {/* /review page with Layout (not nested under /design) */}
                <Route path="review" element={<Review />} />

                {/* Catch any other invalid top-level routes */}

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
          <ContinueEditPopup handleContinuePopup={handleContinuePopup} {...{ activeSide, canvasWidth, canvasHeight, present, DesignNotes, nameAndNumberDesignState, addName, addNumber, activeNameAndNumberPrintSide }} />
        )}

        <BottomBar />
      </div>

      <canvas id="canvas-export" style={{ display: "none" }} />
      <canvas id="HelperCanvas" style={{ display: "none" }}></canvas>
    </>
  );
}

export default App;
