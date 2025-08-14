import React, { useState } from 'react';
import { CrossIcon, SearchIcon } from '../../iconsSvg/CustomIcon';
import { aiContent } from '../../json/aiicontent';
import SubArtBox from './SubArtBox';
import { useNavigate } from 'react-router-dom';
import style from './AddArtToolbar.module.css';
import '../../../App.css';
import PromptGuide from '../../PopupComponent/PromptGuide/PromptGuide';
import screenshot from '../../images/Screenshot .png'
import { RiInformation2Fill } from "react-icons/ri";

const AddArtToolbar = () => {
  const [subArt, setSubArt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [triggeredSearchTerm, setTriggeredSearchTerm] = useState('');
  const [promptGuide, setPromptGuide] = useState(false);

  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      setTriggeredSearchTerm(searchTerm.trim());
      setSubArt(true);
      setSelectedCategory(null);
    }
  };

  const handleSubClick = (title) => {
    const categoryObj = aiContent.find((item) => item.title === title);
    setSelectedCategory(categoryObj);
    setSubArt(true);
    setSearchTerm('');
    setTriggeredSearchTerm('');
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
          searchTerm={triggeredSearchTerm}
          setSearchTerm={setSearchTerm}
          goBack={() => {
            setSubArt(false);
            setSelectedCategory(null);
            setSearchTerm('');
            setTriggeredSearchTerm('');
          }}
        />
      ) : (
        <div className="toolbar-box">
          <div className={style.searchContainer}>
            <div className={style.searchWrapper}>
              {/* <input
                type="text"
                className={style.searchInput}
                placeholder="Search for Clipart and AI Generated Art"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              /> */}
              {/* <span className={style.searchIcon} onClick={handleSearchClick}>
                <SearchIcon />
              </span> */}
              <input
                type="text"
                className={style.searchInput}
                placeholder="Search for Clipart and AI Generated Art"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  if (value.trim()) {
                    setTriggeredSearchTerm(value.trim());
                    setSubArt(true);
                    setSelectedCategory(null);
                  } else {
                    setSubArt(false);
                  }
                }}
              />
              <p onClick={() => setPromptGuide(true)} className={style.promptGuidePara}> AI Prompt Guide</p>
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

          <button className={style.uploadButton} onClick={() => navigate('/design/uploadArt')}>
            UPLOAD YOUR OWN IMAGE
          </button>
        </div>
      )}
      {promptGuide && <PromptGuide onClose={() => setPromptGuide(false)} />}
    </div>


  );
};

export default AddArtToolbar;
