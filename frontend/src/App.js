import { Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
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

enableMapSet();
function App() {
  usePersistQueryParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [continueEditPopup, setContinueEditPopup] = useState(false);
  const [willRenderContinue, setWillRenderContinue] = useState(false);
  const initialState = useSelector((state) => state.TextFrontendDesignSlice);

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
  useEffect(() => {
    const handleSaveState = () => {
      try {
        // localStorage.setItem("savedReduxState", JSON.stringify(reduxState));
      } catch (e) {
        console.error("Error saving Redux state to localStorage:", e);
      }
    };

    window.addEventListener("pagehide", handleSaveState);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleSaveState();
      }
    });

    return () => {
      window.removeEventListener("pagehide", handleSaveState);
      document.removeEventListener("visibilitychange", handleSaveState);
    };
  }, [reduxState]);

  // Fetch product list on mount
  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchProducts());
      dispatch(fetchSettings());

    }, 5000);
  }, [dispatch]);

  function restorePresentFromData(incomingPresent) {
    const sides = ["front", "back", "leftSleeve", "rightSleeve"];

    const restored = {};

    sides.forEach(side => {
      restored[side] = {
        selectedTextId: null,
        selectedImageId: null,
        loadingState: {
          loading: false,
          position: null
        },
        texts: incomingPresent?.[side]?.texts || [],
        images: incomingPresent?.[side]?.images || [],
        setRendering: false,
        nameAndNumberProductList: [],
      };
    });

    return restored;
  }

  // const location = useLocation();

  function editDesignHandler() {
    try {
      const searchParams = new URLSearchParams(location.search);
      const designId = searchParams.get("designId");
      // console.log(designId, "designId");
      if (designId) {

      }
      // const response = apiConnecter("")


    }
    catch (e) {
      console.log("error while fetching desing", e)
    }
    // const restoredState = {
    //   ...initialState,
    //   present: restorePresentFromData(apiData.present),
    //   DesignNotes: apiData.DesignNotes || initialState.DesignNotes,
    // };

  }
  editDesignHandler();
  // Check if saved state should trigger continue edit popup
  useEffect(() => {
    if (!willRenderContinue && rawProducts.length > 0) {
      let savedState = null;
      try {
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


  return (
    <>
      <div className="app-main-container">
        {/* <div
          id="html-delete-control"
          style={{
            position: "absolute",
            zIndex: 9999,
            display: "none",
            width: "28px",
            height: "28px",
            cursor: "pointer",
            backgroundColor: "white",
            borderRadius: "50%",         // 🟢 Make it a circle
            boxShadow: "0 0 4px rgba(0,0,0,0.2)", // Optional: subtle shadow
            display: "flex",             // 🟢 Center SVG
            alignItems: "center",
            justifyContent: "center",
            padding: "2px"
          }}
        >
          <img
            id="html-delete-btn"
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    `)}`}
            alt="Delete"
            width="16"
            height="16"
            style={{
              pointerEvents: "auto",
              display: "block"
            }}
          />
        </div> */}




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
            {/* <Routes>
              <Route path="/design" element={<Layout />}>
                <Route index element={<ProductToolbar />} />
                <Route path="product" element={<ProductToolbar />} />
                <Route path="addText" element={<AddTextToolbar />} />
                <Route path="addImage" element={<AddImageToolbar />} />
                <Route path="products" element={<ProductContainer />} />
                <Route path="uploadArt" element={<UploadArtToolbar />} />
                <Route path="addArt" element={<AddArtToolbar />} />
                <Route path="addNames" element={<NamesToolbar />} />
                <Route path="quantity" element={<QuantityToolbar />} />
                <Route path="/review" element={<Review />} />

              </Route>
              <Route path="*" element={<NotFound />} />

            </Routes> */}
            <Routes>
              {/* Layout wraps all valid pages including /design and /review */}
              <Route path="/" element={<Layout />}>
                {/* /design pages */}
                <Route path="design">
                  <Route index element={<ProductToolbar />} />
                  <Route path="product" element={<ProductToolbar />} />
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
          <ContinueEditPopup handleContinuePopup={handleContinuePopup} />
        )}

        <BottomBar />
      </div>
      <canvas id="HelperCanvas" style={{ display: "none" }}></canvas>
    </>
  );
}

export default App;
