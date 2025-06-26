import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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


function App() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [continueEditPopup, setContinueEditPopup] = useState(false);
  const [willRenderContinue, setWillRenderContinue] = useState(false);

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
        localStorage.setItem("savedReduxState", JSON.stringify(reduxState));
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
    }, 5000);
  }, [dispatch]);

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

      if ((textObjects.length > 0) || addName || addNumber) {
        setWillRenderContinue(true);
        setContinueEditPopup(true);
      }
    }
  }, [rawProducts, willRenderContinue]);

  const handleContinuePopup = () => {
    setContinueEditPopup(false);
  };
  // set initial
  useEffect(() => {
    // if (location.pathname === "/") {
    // }
    navigate("design/product", { replace: true });
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
        />

        {continueEditPopup && (
          <ContinueEditPopup handleContinuePopup={handleContinuePopup} />
        )}

        <BottomBar />
      </div>
    </>
  );
}

export default App;
