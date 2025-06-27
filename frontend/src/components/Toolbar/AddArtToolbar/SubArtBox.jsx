import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon } from '../../iconsSvg/CustomIcon'; // Assuming this path is correct
import { RxCross1 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import style from './SubArt.module.css'; // Assuming this path is correct
import { useDispatch } from 'react-redux';
import { addImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice'; // Assuming this path is correct
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed
import UploadBox from '../../utils/UploadBox'; // Path to your UploadBox component

const SubArtBox = ({ category, queries = [], goBack, searchTerm, setSearchTerm }) => {
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // States for controlling the UploadBox
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(''); // 'fetching', 'uploading', 'complete', 'error'
  const [currentUploadFileInfo, setCurrentUploadFileInfo] = useState(null); // Stores { file: File, imageUrl: string, name: string }

  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clid = process.env.REACT_APP_UNSPLASH_CID; // Ensure this env variable is set

  const fetchUnsplashImages = async (query, pageNumber = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query,
            page: pageNumber,
            per_page: 20,
          },
          headers: {
            Authorization: `Client-ID ${clid}`,
          },
        }
      );
      const newResults = response.data.results;
      setUnsplashImages(prev =>
        pageNumber === 1 ? newResults : [...prev, ...newResults]
      );
      setHasMore(newResults.length > 0);
    } catch (err) {
      console.error("Unsplash API error:", err);
      // Optionally show a toast error for Unsplash API
      toast.error("Failed to fetch images from Unsplash.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
      const debounce = setTimeout(() => {
        fetchUnsplashImages(searchTerm, 1);
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setUnsplashImages([]);
    }
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
    setUnsplashImages([]);
    goBack();
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUnsplashImages(searchTerm, nextPage);
  };

  const handleFiles = async (img) => {
    // 1. Show the UploadBox immediately with the Unsplash small image
    setShowUploadBox(true);
    setUploadProgress(0); // Reset progress
    setUploadStatus('fetching'); // Initial status
    setCurrentUploadFileInfo({
      file: null, // Actual File object will come later
      imageUrl: img.urls.small, // Immediate thumbnail
      name: img.alt_description || `${img.id}.jpg` // Display name
    });

    const BASE_URL = process.env.REACT_APP_BASE_URL; // Ensure this env variable is set
    if (!img?.urls?.full) {
      toast.error("Image URL from Unsplash not found.");
      setUploadStatus('error'); // Set status to error
      // Keep box open briefly to show error, then close
      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
      }, 2000); // Show error for 2 seconds
      return;
    }

    try {
      // 2. Fetch image from Unsplash (this part still takes time)
      const response = await fetch(img.urls.full);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], `${img.id}.jpg`, { type: blob.type });

      // Update the UploadBox with the actual File object now that it's available
      setCurrentUploadFileInfo(prev => ({ ...prev, file: file }));
      setUploadStatus('uploading'); // Change status to uploading

      // 3. Create FormData and append File
      const formData = new FormData();
      formData.append("images", file);

      // 4. Upload to server with progress tracking
      const uploadResponse = await axios.post(
        `${BASE_URL}imageOperation/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted); // Update progress for the UploadBox
          }
        }
      );

      console.log("Uploaded successfully:", uploadResponse.data.files);
      setUploadStatus('complete'); // Set status to complete

      uploadResponse.data.files.forEach((fileObj) => {
        dispatch(addImageState({ src: fileObj.url }));
      });

     
      // 5. Keep the UploadBox open briefly to show "Complete!"
      setTimeout(() => {
        setShowUploadBox(false); // Hide the box
        setCurrentUploadFileInfo(null); // Clear info
        navigate("/design/addImage"); // Navigate AFTER box is hidden
      }, 1500); // Show "Complete!" for 1.5 seconds

    } catch (err) {
      toast.error("Error uploading image");
      console.error("Upload error:", err.response?.data || err.message);
      setUploadStatus('error'); // Set status to error
      setUploadProgress(0); // Reset progress

      // Keep box open briefly to show error, then close
      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
      }, 2000); // Show error for 2 seconds

    }
  };

  const handleCloseUploadBox = () => {
    // This function is called by the 'X' button on UploadBox
    // Or internally when an upload process needs to be cleared.
    setShowUploadBox(false);
    setUploadProgress(0);
    setUploadStatus('');
    setCurrentUploadFileInfo(null);
    // If you have a way to cancel the ongoing axios request, you'd do it here.
    // For example, by using AbortController and passing a signal to axios.
  };


  return (
    <div className={style.toolbarMainContainerClipArt}>
      {showUploadBox && currentUploadFileInfo ? ( // Render UploadBox based on showUploadBox state
        <UploadBox
          file={currentUploadFileInfo.file} // Will be null initially, then updated
          imageUrl={currentUploadFileInfo.imageUrl} // Always available for initial display
          fileName={currentUploadFileInfo.name} // Pass the display name
          onRemoveFile={handleCloseUploadBox}
          progress={uploadProgress} // Controlled by SubArtBox
          status={uploadStatus}     // Controlled by SubArtBox
        />
      ) : (
        <div className="toolbar-box">
          {/* Your existing UI for searching and displaying Unsplash images */}
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

          {unsplashImages.length > 0 && <h4 className="margin-bottom">Generated Results</h4>}
          {loading && (
            <div className={style.loaderWrapper}>
              <div className={style.loader}></div>
              <p>Loading amazing art...</p>
            </div>
          )}


          <div className={style.clipartGrid}>
            {unsplashImages.length > 0 ? (
              unsplashImages.map((img) => (
                <img
                  key={img.id}
                  src={img.urls.small}
                  alt={img.alt_description}
                  className={style.clipartImage}
                  onClick={() => handleFiles(img)}
                />
              ))
            ) : (
              searchTerm && !loading && <p>No results found for "{searchTerm}"</p>
            )}
          </div>

          {!loading && hasMore && unsplashImages.length > 0 && (
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