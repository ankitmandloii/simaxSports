import React, { useState } from 'react';
import './NamesToolbar.css';
import FrontBtn from '../../images/Frontbutton.png';
import BackBtn from '../../images/Backbuton.png';
import SmallBtn from '../../images/sm-btn.png';
import LargeBtn from '../../images/Largebutton.png';
import InterStatebutton from '../../images/InterStatebutton.png';
import Collegiatebutton from '../../images/Collegiatebutton.png';
import AddNamesPopup from '../../PopupComponent/AddNamesPopup/AddNamesPopup';
import { AngleActionIcon } from '../../iconsSvg/CustomIcon';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';

const NamesToolbar = () => {
  // Checkbox states
  const [addNamesChecked, setAddNamesChecked] = useState(false);
  const [addNumbersChecked, setAddNumbersChecked] = useState(false);

  // Other states
  const [activeSide, setActiveSide] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [activeFont, setActiveFont] = useState(null);
  const [activeColor, setActiveColor] = useState('white');

  const [showAddnamesPopup, setShowAddnamesPopup] = useState(false);
  const [showColorpopup, setShowColorpopup] = useState(false);

  // Derived state - if at least one checkbox is checked
  const isAnyChecked = addNamesChecked || addNumbersChecked;

  // Handlers
  const toggleAddNamesPopup = () => {
    if (isAnyChecked) setShowAddnamesPopup(!showAddnamesPopup);
  };

  const toggleColorPopup = () => {
    if (isAnyChecked) setShowColorpopup(!showColorpopup);
  };

  const handleColorChange = (color) => {
    setActiveColor(color);
  };

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Names And Numbers</h5>
        <h2>Add Names And Numbers</h2>
        <p>
          Use personalized Names & Numbers for projects like team jerseys where you
          need a unique name and/or number for each item.
        </p>
      </div>

      <div className="toolbar-box">
        {/* Step 1 */}
        <div className="add-names-numberrs-row">
          <h5>Step 1</h5>
          <label className="namescheckbox-div">
            <input
              type="checkbox"
              checked={addNamesChecked}
              onChange={() => setAddNamesChecked(!addNamesChecked)}
            />
            <span>Add Names</span>
          </label>
          <label className="namescheckbox-div">
            <input
              type="checkbox"
              checked={addNumbersChecked}
              onChange={() => setAddNumbersChecked(!addNumbersChecked)}
            />
            <span>Add Numbers</span>
          </label>
        </div>

        {/* Side */}
        <div className="add-names-numberrs-row">
          <h5>Side</h5>
          <div className="names-button-main-container">
            <button
              className={`names-toolbar-button ${activeSide === 'front' ? 'active' : ''}`}
              onClick={() => setActiveSide('front')}
              disabled={!isAnyChecked}
            >
              <img src={FrontBtn} alt="Front" />
            </button>
            <button
              className={`names-toolbar-button ${activeSide === 'back' ? 'active' : ''}`}
              onClick={() => setActiveSide('back')}
              disabled={!isAnyChecked}
            >
              <img src={BackBtn} alt="Back" />
            </button>
          </div>
        </div>

        {/* Size */}
        <div className="add-names-numberrs-row">
          <h5>Size</h5>
          <div className="names-button-main-container">
            <button
              className={`names-toolbar-button ${activeSize === 'small' ? 'active' : ''}`}
              onClick={() => setActiveSize('small')}
              disabled={!isAnyChecked}
            >
              <img src={SmallBtn} alt="Small" />
            </button>
            <button
              className={`names-toolbar-button ${activeSize === 'large' ? 'active' : ''}`}
              onClick={() => setActiveSize('large')}
              disabled={!isAnyChecked}
            >
              <img src={LargeBtn} alt="Large" />
            </button>
          </div>
        </div>

        {/* Font */}
        <div className="add-names-numberrs-row">
          <h5>Font</h5>
          <div className="names-button-main-container">
            <button
              className={`names-toolbar-button ${activeFont === 'interstate' ? 'active' : ''}`}
              onClick={() => setActiveFont('interstate')}
              disabled={!isAnyChecked}
            >
              <img src={InterStatebutton} alt="Interstate" />
            </button>
            <button
              className={`names-toolbar-button ${activeFont === 'collegiate' ? 'active' : ''}`}
              onClick={() => setActiveFont('collegiate')}
              disabled={!isAnyChecked}
            >
              <img src={Collegiatebutton} alt="Collegiate" />
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="add-names-numberrs-row">
          <h5>Color</h5>
          <div className="names-button-main-container">
            <div
              className="color-names-box"
              onClick={toggleColorPopup}
              style={{ cursor: isAnyChecked ? 'pointer' : 'not-allowed', opacity: isAnyChecked ? 1 : 0.5 }}
            >
              <span>{activeColor}</span>
              <SpanColorBox color={activeColor} />
              <AngleActionIcon />
            </div>
            {showColorpopup && isAnyChecked && (
              <ChooseColorBox
                showColorPopupHandler={toggleColorPopup}
                onColorChange={handleColorChange}
                defaultColor={activeColor}
              />
            )}
          </div>
        </div>

        <button className="black-button" onClick={toggleAddNamesPopup} disabled={!isAnyChecked}>
          Add Names/Numbers
        </button>
      </div>

      {showAddnamesPopup && <AddNamesPopup showAddnamesPopupHAndler={toggleAddNamesPopup} />}
    </div>
  );
};

export default NamesToolbar;
