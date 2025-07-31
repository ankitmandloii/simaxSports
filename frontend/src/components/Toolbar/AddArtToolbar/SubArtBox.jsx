// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { SearchIcon } from '../../iconsSvg/CustomIcon';
// import { RxCross1 } from 'react-icons/rx';
// import { Link, useNavigate } from 'react-router-dom';
// import style from './SubArt.module.css';
// import { useDispatch } from 'react-redux';
// import { addImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
// import { toast } from 'react-toastify';
// import UploadBox from '../../utils/UploadBox';

// const SubArtBox = ({ category, queries = [], goBack, searchTerm, setSearchTerm }) => {
//   const [unsplashImages, setUnsplashImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [showUploadBox, setShowUploadBox] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [currentUploadFileInfo, setCurrentUploadFileInfo] = useState(null);
//   const [uploadAbortController, setUploadAbortController] = useState(null); // 🔥 NEW

//   const [hasMore, setHasMore] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const clid = process.env.REACT_APP_UNSPLASH_CID;

//   const fetchUnsplashImages = async (query, pageNumber = 1) => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(`https://api.unsplash.com/search/photos`, {
//         params: {
//           query,
//           page: pageNumber,
//           per_page: 20,
//         },
//         headers: {
//           Authorization: `Client-ID ${clid}`,
//         },
//       });
//       const newResults = response.data.results;
//       setUnsplashImages(prev =>
//         pageNumber === 1 ? newResults : [...prev, ...newResults]
//       );
//       setHasMore(newResults.length > 0);
//     } catch (err) {
//       console.error("Unsplash API error:", err);
//       toast.error("Failed to fetch images from Unsplash.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       setPage(1);
//       const debounce = setTimeout(() => {
//         fetchUnsplashImages(searchTerm, 1);
//       }, 500);
//       return () => clearTimeout(debounce);
//     } else {
//       setUnsplashImages([]);
//     }
//   }, [searchTerm]);

//   const handleClear = () => {
//     setSearchTerm('');
//     setUnsplashImages([]);
//     goBack();
//   };

//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchUnsplashImages(searchTerm, nextPage);
//   };

//   const handleFiles = async (img) => {
//     setShowUploadBox(true);
//     setUploadProgress(0);
//     setUploadStatus('fetching');
//     setCurrentUploadFileInfo({
//       file: null,
//       imageUrl: img.urls.full,
//       name: img.alt_description || `${img.id}.jpg`,
//     });

//     const BASE_URL = process.env.REACT_APP_BASE_URL;
//     if (!img?.urls?.full) {
//       toast.error("Image URL from Unsplash not found.");
//       setUploadStatus('error');
//       setTimeout(() => {
//         setShowUploadBox(false);
//         setCurrentUploadFileInfo(null);
//       }, 2000);
//       return;
//     }

//     const controller = new AbortController(); // 🔥 create new controller
//     setUploadAbortController(controller);     // 🔥 save it globally

//     try {
//       const response = await fetch(img.urls.full, { signal: controller.signal });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const blob = await response.blob();
//       const file = new File([blob], `${img.id}.jpg`, { type: blob.type });

//       setCurrentUploadFileInfo(prev => ({ ...prev, file }));
//       setUploadStatus('uploading');

//       const formData = new FormData();
//       formData.append("images", file);

//       const uploadResponse = await axios.post(
//         `${BASE_URL}imageOperation/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data"
//           },
//           signal: controller.signal, // 🔥 attach signal to axios
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//             setUploadProgress(percentCompleted);
//           }
//         }
//       );

//       setUploadStatus('complete');
//       uploadResponse.data.files.forEach((fileObj) => {
//         dispatch(addImageState({ src: fileObj.url }));
//       });

//       setTimeout(() => {
//         setShowUploadBox(false);
//         setCurrentUploadFileInfo(null);
//         navigate("/design/addImage");
//       }, 1500);

//     } catch (err) {
//       if (err.name === 'AbortError') {
//         console.log("Upload aborted.");
//       } else {
//         toast.error("Error uploading image");
//         console.error("Upload error:", err.response?.data || err.message);
//       }

//       setUploadStatus('error');
//       setUploadProgress(0);
//       setTimeout(() => {
//         setShowUploadBox(false);
//         setCurrentUploadFileInfo(null);
//       }, 2000);
//     }
//   };

//   const handleCloseUploadBox = () => {
//     if (uploadAbortController) {
//       uploadAbortController.abort(); // 🔥 cancel ongoing fetch/axios
//       setUploadAbortController(null);
//     }

//     setShowUploadBox(false);
//     setUploadProgress(0);
//     setUploadStatus('');
//     setCurrentUploadFileInfo(null);
//   };

//   return (
//     <div className={style.toolbarMainContainerClipArt}>
//       {showUploadBox && currentUploadFileInfo ? (
//         <UploadBox
//           file={currentUploadFileInfo.file}
//           imageUrl={currentUploadFileInfo.imageUrl}
//           fileName={currentUploadFileInfo.name}
//           onRemoveFile={handleCloseUploadBox}
//           progress={uploadProgress}
//           status={uploadStatus}
//         />
//       ) : (
//         <div className="toolbar-box">
//           <Link to="/design/uploadArt">
//             <button className={style.uploadButton}>Upload Your Own Image</button>
//           </Link>

//           <div className={style.searchContainer}>
//             <div className={style.searchWrapper}>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 className={style.searchInputSubart}
//                 placeholder="Search for Clipart and AI Generated Art"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <span className={style.searchIcon}>
//                 <RxCross1 className={style.crossIcon} onClick={handleClear} />
//                 <SearchIcon />
//               </span>
//             </div>
//           </div>

//           {queries.length > 0 && !searchTerm && (
//             <>
//               <h2>{category}</h2>
//               <div className={style.textButtonGroup}>
//                 {queries.map((query) => (
//                   <button
//                     key={query}
//                     className={style.textButton}
//                     onClick={() => setSearchTerm(query)}
//                   >
//                     {query}
//                   </button>
//                 ))}
//               </div>
//             </>
//           )}

//           {unsplashImages.length > 0 && <h4 className="margin-bottom">Generated Results</h4>}
//           {loading && (
//             <div className={style.loaderWrapper}>
//               <div className={style.loader}></div>
//               <p>Loading amazing art...</p>
//             </div>
//           )}

//           <div className={style.clipartGrid}>
//             {unsplashImages.length > 0 ? (
//               unsplashImages.map((img) => (
//                 <img
//                   key={img.id}
//                   src={img.urls.full}
//                   alt={img.alt_description}
//                   className={style.clipartImage}
//                   onClick={() => handleFiles(img)}
//                 />
//               ))
//             ) : (
//               searchTerm && !loading && <p>No results found for "{searchTerm}"</p>
//             )}
//           </div>

//           {!loading && hasMore && unsplashImages.length > 0 && (
//             <button onClick={handleLoadMore} className={style.loadMoreButton}>
//               Load More
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubArtBox;
// --
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { RxCross1 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import style from './SubArt.module.css';
import { useDispatch } from 'react-redux';
import { addImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { toast } from 'react-toastify';
import UploadBox from '../../utils/UploadBox';

const SubArtBox = ({ category, queries = [], goBack, searchTerm, setSearchTerm }) => {
  const [dalleImages, setDalleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [currentUploadFileInfo, setCurrentUploadFileInfo] = useState(null);
  const [uploadAbortController, setUploadAbortController] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_DALLE_API_KEY;

  const fetchDalleImages = async (query, pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const imagesPerPage = 5;
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-2',
          prompt: query,
          n: imagesPerPage,
          size: '512x512',
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newResults = response.data.data.map((item, index) => ({
        id: `${query}-${pageNumber}-${index}`,
        urls: { full: item.url },
        alt_description: query,
      }));

      setDalleImages(prev =>
        pageNumber === 1 ? newResults : [...prev, ...newResults]
      );
      setHasMore(newResults.length === imagesPerPage);
    } catch (err) {
      console.error("DALL-E API error:", JSON.stringify({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      }, null, 2));
      toast.error("Failed to fetch images from DALL-E.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
      const debounce = setTimeout(() => {
        fetchDalleImages(searchTerm, 1);
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setDalleImages([]);
    }
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
    setDalleImages([]);
    goBack();
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDalleImages(searchTerm, nextPage);
  };

  const handleFiles = async (img) => {
    console.log("Starting image upload for:", JSON.stringify({ id: img.id, url: img.urls.full, alt: img.alt_description }, null, 2));
    setShowUploadBox(true);
    setUploadProgress(0);
    setUploadStatus('fetching');
    setCurrentUploadFileInfo({
      file: null,
      imageUrl: img.urls.full,
      name: img.alt_description || `${img.id}.jpg`,
    });

    const BASE_URL = process.env.REACT_APP_BASE_URL; // Remove trailing slashes
    if (!img?.urls?.full) {
      console.error("Missing image URL:", JSON.stringify(img, null, 2));
      toast.error("Image URL from DALL-E not found.");
      setUploadStatus('error');
      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
      }, 2000);
      return;
    }

    const controller = new AbortController();
    setUploadAbortController(controller);

    try {
      const fetchUrl = `${BASE_URL}imageOperation/fetch-image?url=${encodeURIComponent(img.urls.full)}`;
      console.log("Fetching image via proxy from:", fetchUrl);
      const response = await fetch(fetchUrl, {
        signal: controller.signal,
      });
      console.log("Fetch response:", JSON.stringify({
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      }, null, 2));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fetch failed:", JSON.stringify({ status: response.status, statusText: response.statusText, body: errorText }, null, 2));
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        const errorText = await response.text();
        console.error("Invalid content type:", JSON.stringify({ contentType, body: errorText }, null, 2));
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const blob = await response.blob();
      console.log("Blob received:", JSON.stringify({ type: blob.type, size: blob.size }, null, 2));

      if (!blob.size) {
        throw new Error("Empty blob received from image fetch.");
      }

      const file = new File([blob], `${img.id}.jpg`, { type: blob.type });
      console.log("File created:", JSON.stringify({ name: file.name, type: file.type, size: file.size }, null, 2));

      setCurrentUploadFileInfo(prev => ({ ...prev, file }));
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append("images", file);
      console.log("Uploading to:", `${BASE_URL}imageOperation/upload`);

      const uploadResponse = await axios.post(
        `${BASE_URL}imageOperation/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log("Upload progress:", percentCompleted);
            setUploadProgress(percentCompleted);
          },
        }
      );

      console.log("Upload response:", JSON.stringify(uploadResponse.data, null, 2));
      if (!uploadResponse.data.files || !Array.isArray(uploadResponse.data.files)) {
        throw new Error("Invalid upload response structure: files array missing or not an array");
      }

      setUploadStatus('complete');
      uploadResponse.data.files.forEach((fileObj) => {
        if (!fileObj.url) {
          console.error("Missing URL in file object:", JSON.stringify(fileObj, null, 2));
          throw new Error("File object missing URL");
        }
        dispatch(addImageState({ src: fileObj.url }));
      });

      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
        navigate("/design/addImage");
      }, 1500);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Upload aborted.");
      } else {
        console.error("Upload error details:", JSON.stringify({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          stack: err.stack
        }, null, 2));
        toast.error(`Error uploading image: ${err.message}`);
      }

      setUploadStatus('error');
      setUploadProgress(0);
      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
      }, 2000);
    }
  };

  const handleCloseUploadBox = () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
      setUploadAbortController(null);
    }

    setShowUploadBox(false);
    setUploadProgress(0);
    setUploadStatus('');
    setCurrentUploadFileInfo(null);
  };

  return (
    <div className={style.toolbarMainContainerClipArt}>
      {showUploadBox && currentUploadFileInfo ? (
        <UploadBox
          file={currentUploadFileInfo.file}
          imageUrl={currentUploadFileInfo.imageUrl}
          fileName={currentUploadFileInfo.name}
          onRemoveFile={handleCloseUploadBox}
          progress={uploadProgress}
          status={uploadStatus}
        />
      ) : (
        <div className="toolbar-box">
          <Link to="/design/uploadArt">
            <button className={style.uploadButton}>Upload Your Own Image</button>
          </Link>

          <div className={style.searchContainer}>
            <div className={style.searchWrapper}>
              <input
                type="text"
                value={searchTerm}
                className={style.searchInputSubart}
                placeholder="Search for Clipart and AI Generated Art"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className={style.searchIcon}>
                <RxCross1 className={style.crossIcon} onClick={handleClear} />
                <SearchIcon />
              </span>
            </div>
          </div>

          {queries.length > 0 && !searchTerm && (
            <>
              <h2>{category}</h2>
              <div className={style.textButtonGroup}>
                {queries.map((query) => (
                  <button
                    key={query}
                    className={style.textButton}
                    onClick={() => setSearchTerm(query)}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </>
          )}

          {dalleImages.length > 0 && <h4 className="margin-bottom">Generated Results</h4>}
          {loading && (
            <div className={style.loaderWrapper}>
              <div className={style.loader}></div>
              <p>Generating amazing art...</p>
            </div>
          )}

          <div className={style.clipartGrid}>
            {dalleImages.length > 0 ? (
              dalleImages.map((img) => (
                <img
                  key={img.id}
                  src={img.urls.full}
                  alt={img.alt_description}
                  className={style.clipartImage}
                  onClick={() => handleFiles(img)}
                />
              ))
            ) : (
              searchTerm && !loading && <p>No results found for "{searchTerm}"</p>
            )}
          </div>

          {!loading && hasMore && dalleImages.length > 0 && (
            <button onClick={handleLoadMore} className={style.loadMoreButton}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubArtBox;