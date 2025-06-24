import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { RxCross1 } from 'react-icons/rx';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import style from './SubArt.module.css';
import { useDispatch } from 'react-redux';
import { addImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
const SubArtBox = ({ category, queries = [], goBack, searchTerm, setSearchTerm }) => {
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const navigate= useNavigate();

  const clid = '058b6f5e36ed6b7502e24b8f83f8badaf529e88609981f3315d5c751e8d623a7';

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

  const clickForDispatch =(files) => {
    // console.log("Files",files.full);
    dispatch(addImageState({ "src": files.full }));
    navigate("/design/addImage");
  }
  return (
    <div className={style.toolbarMainContainerClipArt}>
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

        <h4 className="margin-bottom">Generated Results</h4>
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
                onClick={()=>clickForDispatch(img.urls)}
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
    </div>
  );
};

export default SubArtBox;