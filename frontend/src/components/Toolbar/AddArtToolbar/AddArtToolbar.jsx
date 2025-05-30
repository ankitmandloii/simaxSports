
import React, { useState } from 'react';
// import '../ProductToolbar/ProductToolbar.css';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import { aiContent } from '../../json/aiicontent';
import SubArtBox from './SubArtBox';
import { Link } from 'react-router-dom';
import style from './AddArtToolbar.module.css';
import '../../../App.css'
const AddArtToolbar = () => {
  const [subArt, setSubArt] = useState(false);
  const [category, setCategory] = useState("");
  // const handlesubArt=()=>{
  //   setSubArt(!subArt);
  // }
  const handleSubClick = (category) => {
    setCategory(category);
    setSubArt(!subArt);
  }
  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading ai-relative">
        <h5 className="Toolbar-badge">Art Powered By AI</h5>
        <h2 >Add Art</h2>
        <span className={style.aiSpannn}>AI</span>
        <p>Add your own artwork or choose from our library to personalize your design.</p>
      </div>
      {subArt ? <SubArtBox category={category} goBack={() => setSubArt(false)} /> : <div className="toolbar-box">
        {/* <div className="addArtToolbar-search-box">
          <input type="text" placeholder="Search for Clipart " />
          <SearchIcon />
        </div> */}
        <div className={style.searchContainer}>
          <div className={style.searchWrapper}>
            <input
              type="text"
              className={style.searchInput}
              placeholder="Search for Clipart and AI Generated Art"
            />
            <span className={style.searchIcon}>

              <SearchIcon />
            </span>
          </div>
        </div>

        <div className={style.addArtToolbarBoxContent}>
          {aiContent.map((item) => (
            <button key={item.id} className={style.artButton} onClick={() => handleSubClick(item.title)}>
              {item.svg}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <Link to='/uploadArt'><button className={style.uploadButton}>Upload Your Own Image</button></Link>
      </div>}

    </div>
  );
};

export default AddArtToolbar;
