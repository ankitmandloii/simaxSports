import React, { useState } from 'react';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { RxCross1 } from 'react-icons/rx'; // Cross icon
import { categoryImages } from '../../json/aiicontent';
import './SubArt.css';
import { Link } from 'react-router-dom';

const SubArtBox = ({ category, goBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const images = categoryImages[category] || [];

  const filteredImages = images.filter((img) =>
    img.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    setSearchTerm('');
    goBack(); // Go back to main categories
  };

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-box">
        <Link to='/uploadArt'><button className="upload-button margin-bottom">Upload Your Own Image</button></Link>

        <div className="addArtToolbar-search-box with-cross">
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
        </div>
       <h4 className='margin-bottom'>Clipart Results</h4>
        <div className="clipart-grid">
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
