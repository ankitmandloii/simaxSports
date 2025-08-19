import React, { useState } from 'react';
import axios from 'axios';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { RxCross1 } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import style from './SubArt.module.css';
import { useDispatch } from 'react-redux';
import { addImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { toast } from 'react-toastify';
import starImage from '../../images/ai-magic.png';
import UploadBox from '../../utils/UploadBox';

const SubArtBox = ({ category, queries = [], goBack, searchTerm: initialSearchTerm }) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm || '');
  const [dalleImages, setDalleImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [currentUploadFileInfo, setCurrentUploadFileInfo] = useState(null);
  const [uploadAbortController, setUploadAbortController] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://simax-sports-x93p.vercel.app/api/';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiKey = process.env.GENERATE_API_KEY;
  const fetchDalleImages = async (query, pageNumber = 1) => {
    if (!query) {
      toast.error('Please enter a search query.');
      return;
    }

    const imagesPerPage = 5;
    const requestBody = {
      model: 'dall-e-3',
      prompt: query,
      n: 1,
      size: '1024x1024',
      count: imagesPerPage
    };

    console.log('Request Body:', requestBody);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}imageOperation/generateImageByAi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json(); // read as text first
      // let data;
      // try {
      //   data = JSON.parse(text);
      // } catch (err) {
      //   throw new Error(`Server returned non-JSON: ${text}`);
      // }

      console.log('API Response:', data);

      if (!data.urls || !Array.isArray(data.urls)) {
        throw new Error('Invalid response: urls not found');
      }

      const newResults = data.urls.map((url, index) => ({
        id: `${query}-${pageNumber}-${index}`,
        urls: { full: url },
        alt_description: query
      }));

      setDalleImages(prev => (pageNumber === 1 ? newResults : [...prev, ...newResults]));
      setHasMore(newResults.length === imagesPerPage);

    } catch (err) {
      console.error('API error:', err.message);
      toast.error(err.message || 'Failed to generate images');
    } finally {
      setLoading(false);
    }
  };




  const handleClear = () => {
    setInputValue('');
    setDalleImages([]);
    goBack();
  };

  const handleSearchClick = () => {
    const query = inputValue.trim();
    if (query !== '') {
      setPage(1);
      setDalleImages([]);
      fetchDalleImages(query, 1);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDalleImages(inputValue, nextPage);
  };

  const handleFiles = async (img) => {
    setShowUploadBox(true);
    setUploadProgress(0);
    setUploadStatus('fetching');
    setCurrentUploadFileInfo({
      file: null,
      imageUrl: img.urls.full,
      name: img.alt_description || `${img.id}.jpg`,
    });

    // const BASE_URL = process.env.REACT_APP_BASE_URL;

    if (!img?.urls?.full) {
      toast.error('Image URL not found.');
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
      console.log("fetchhhhh", fetchUrl);
      const response = await fetch(fetchUrl, { signal: controller.signal });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) throw new Error(`Invalid content type: ${contentType}`);

      const blob = await response.blob();
      if (!blob.size) throw new Error('Empty blob received from image fetch.');

      const file = new File([blob], `${img.id}.jpg`, { type: blob.type });
      setCurrentUploadFileInfo(prev => ({ ...prev, file }));
      setUploadStatus('uploading');

      const formData = new FormData();
      formData.append('images', file);

      const uploadResponse = await axios.post(
        `${BASE_URL}imageOperation/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (!Array.isArray(uploadResponse.data.files)) {
        throw new Error('Invalid upload response structure');
      }

      setUploadStatus('complete');
      uploadResponse.data.files.forEach((fileObj) => {
        if (!fileObj.url) throw new Error('File object missing URL');
        dispatch(addImageState({ src: fileObj.url }));
      });

      setTimeout(() => {
        setShowUploadBox(false);
        setCurrentUploadFileInfo(null);
        navigate('/design/addImage');
      }, 1500);
    } catch (err) {
      if (err.name !== 'AbortError') {
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
          <div className={style.searchContainer}>
            <div className={style.searchWrapper}>
              <input
                type="text"
                value={inputValue}
                className={style.searchInputSubart}
                placeholder="Search for Clipart and AI Generated Art"
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                autoFocus
              />
              <span className={style.searchIcon}>
                <RxCross1 className={style.crossIcon} onClick={handleClear} />
              </span>
            </div>
          </div>
          <div className={style.generrateBtn}>
            <div className={style.searchWrapper}>
              <button
                onClick={handleSearchClick}
                className={`${style.uploadButton2} ${(loading || !inputValue.trim()) ? style.disabledButton : ''}`}
                disabled={loading}
              >
                <img className={style.starImage} src={starImage} />
                <span>{loading ? 'Generating...' : 'GENERATE AI IMAGES'}</span>
              </button>
            </div>
          </div>

          {queries.length > 0 && !inputValue && (
            <>
              <div className={style.queryContainer}>
                <h2>{category}</h2>
                <div className={style.textButtonGroup}>
                  {queries.map((query) => (
                    <button
                      key={query}
                      className={style.textButton}
                      onClick={() => {
                        setInputValue(query);
                        setPage(1);
                      }}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {dalleImages.length > 0 && <h4 className={style.marginBottom}>Generated Results</h4>}
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
              <></>
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