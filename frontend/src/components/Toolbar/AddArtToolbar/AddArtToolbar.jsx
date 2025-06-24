import React, { useState, useEffect } from 'react';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { aiContent } from '../../json/aiicontent';
import SubArtBox from './SubArtBox';
import { useNavigate } from 'react-router-dom';
import style from './AddArtToolbar.module.css';
import '../../../App.css';

const AddArtToolbar = () => {
  const [subArt, setSubArt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      setSubArt(true);
    }
  }, [searchTerm]);

  const handleSubClick = (title) => {
    const categoryObj = aiContent.find((item) => item.title === title);
    setSelectedCategory(categoryObj);
    setSubArt(true);
    setSearchTerm(''); // optional: clear previous search
  };

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading ai-relative">
        <h5 className="Toolbar-badge">Art Powered By AI</h5>
        <h2>Add Art</h2>
        <p>Add your own artwork or choose from our library to personalize your design.</p>
      </div>

      {subArt ? (
        <SubArtBox
          category={selectedCategory?.title}
          queries={selectedCategory?.queries || []}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          goBack={() => {
            setSubArt(false);
            setSelectedCategory(null);
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="toolbar-box">
          <div className={style.searchContainer}>
            <div className={style.searchWrapper}>
              <input
                type="text"
                className={style.searchInput}
                placeholder="Search for Clipart and AI Generated Art"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className={style.searchIcon}>
                <SearchIcon />
              </span>
            </div>
          </div>

          <div className={style.addArtToolbarBoxContent}>
            {aiContent.map((item) => (
              <button
                key={item.id}
                className={style.artButton}
                onClick={() => handleSubClick(item.title)}
              >
                {item.svg}
                <span>{item.title}</span>
              </button>
            ))}
          </div>


          <button className={style.uploadButton} onClick={() => navigate('/design/uploadArt')}>Upload Your Own Image</button>

        </div>
      )}
    </div>
  );
};

export default AddArtToolbar;
