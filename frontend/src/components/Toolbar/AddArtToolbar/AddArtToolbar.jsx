
import React, { useState } from 'react';
import '../ProductToolbar/ProductToolbar.css';
import { SearchIcon } from '../../iconsSvg/CustomIcon';
import {aiContent} from '../../json/aiicontent';
import SubArtBox from './SubArtBox';
import { Link } from 'react-router-dom';
import './AddArtToolbar.css'
const AddArtToolbar = () => {
  const [subArt,setSubArt]=useState(false);
  const [category,setCategory]=useState("");
  const handlesubArt=()=>{
    setSubArt(!subArt);
  }
  const handleSubClick=(category)=>{
setCategory(category);
setSubArt(!subArt);
  }
  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading ai-relative">
        <h5 className="Toolbar-badge">Art Powered By AI</h5>
        <h2 >Add Art</h2>
        <span className='ai-spannn'>AI</span>
        <p>Add your own artwork or choose from our library to personalize your design.</p>
      </div>
{subArt ? <SubArtBox category={category} goBack={() => setSubArt(false)}/> : <div className="toolbar-box">
        <div className="addArtToolbar-search-box">
          <input type="text" placeholder="Search for Clipart " />
          <SearchIcon />
        </div>

        <div className="addArtToolbarBoxContent">
          {aiContent.map((item) => (
            <button key={item.id} className="art-button" onClick={()=>handleSubClick(item.title)}>
              {item.svg}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

       <Link to='/uploadArt'><button className="upload-button">Upload Your Own Image</button></Link> 
      </div>}
      
    </div>
  );
};

export default AddArtToolbar;
