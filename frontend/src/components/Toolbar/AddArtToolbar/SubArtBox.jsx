import React, { useState } from 'react';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { RxCross1 } from 'react-icons/rx'; // Cross icon
import { categoryImages } from '../../json/aiicontent';
import { Link } from 'react-router-dom';
import style from './SubArt.module.css'

const SubArtBox = ({ category, goBack }) => {
  // const [searchTerm, setSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState(category);


  const images = categoryImages[category] || [];

  const filteredImages = images.filter((img) =>
    img.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    setSearchTerm('');
    goBack(); // Go back to main categories
  };

  return (
    <div className={style.toolbarMainContainerClipArt}>
      <div className="toolbar-box">
        <Link to='/uploadArt'><button className={style.uploadButton}>Upload Your Own Image</button></Link>

        {/* <div className="addArtToolbar-search-box with-cross">
          <input
            type="text"
            value={category + (searchTerm ? ` - ${searchTerm}` : '')}
            placeholder="Search for Clipart and AI Generated Art"
            onChange={(e) =>
              setSearchTerm(e.target.value.replace(`${category} - `, ''))
            }
          />
          <SearchIcon />
          <RxCross1 className="cross-icon" onClick={handleClear} />
        </div> */}
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
              <RxCross1 className="cross-icon" onClick={handleClear} />
              <SearchIcon />

            </span>
          </div>
        </div>
        <h4 className='margin-bottom'>Clipart Results</h4>
        <div className={style.clipartGrid}>
          {filteredImages.map((img) => (
            <img
              key={img.id}
              src={img.src}
              alt={img.alt}
              className="clipart-image"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubArtBox;
