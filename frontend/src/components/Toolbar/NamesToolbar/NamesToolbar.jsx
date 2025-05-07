import React, { useState } from 'react';
import './NamesToolbar.css';
import FrontBtn from '../../images/Frontbutton.png';
import BackBtn from '../../images/Backbuton.png';
import SmallBtn from '../../images/Smallbutton.png';
import LargeBtn from '../../images/Largebutton.png';
import InterStatebutton from '../../images/InterStatebutton.png';
import Collegiatebutton from '../../images/Collegiatebutton.png';
import AddNamesPopup from '../../PopupComponent/AddNamesPopup/AddNamesPopup';
import { AngleActionIcon } from '../../iconsSvg/CustomIcon';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx'
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx'

const NamesToolbar = () => {
  const [activeSide, setActiveSide] = useState(null);
  const [showAddnamesPopup,setshowAddnamesPopup]=useState(false);
  const [showColorpopup,setshowcolorpopup]=useState(false);
  const showAddnamesPopupHAndler=()=>{
    setshowAddnamesPopup(!showAddnamesPopup)
  }
  const showColorPopupHandler=()=>{
    setshowcolorpopup(!showColorpopup)
  }
 
  const [activeSize, setActiveSize] = useState(null);
  const [activeFont, setActiveFont] = useState(null);
  const [activeColor, setActiveColor] = useState("white");
  const handleColorChange = (color) => {
    setActiveColor(color); 
  };
  return (
    <div className="toolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Names And Numbers</h5>
        <h2>Add Names And Numbers</h2>
        <p>Use personalized Names & Numbers for projects like team jerseys where you need a unique name and/or number for each item.</p>
      </div>

      <div className="toolbar-box">
        {/* Step 1 */}
        <div className="add-names-numberrs-row">
          <h5>Step1</h5>
          <label className="namescheckbox-div">
            <input type='checkbox' defaultChecked/>
            <span>Add Names</span>
          </label>
          <label className="namescheckbox-div">
            <input type='checkbox' defaultChecked/>
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
            >
              <img src={FrontBtn} alt="Front"/>
            </button>
            <button
              className={`names-toolbar-button ${activeSide === 'back' ? 'active' : ''}`}
              onClick={() => setActiveSide('back')}
            >
              <img src={BackBtn} alt="Back"/>
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
            >
              <img src={SmallBtn} alt="Small"/>
            </button>
            <button
              className={`names-toolbar-button ${activeSize === 'large' ? 'active' : ''}`}
              onClick={() => setActiveSize('large')}
            >
              <img src={LargeBtn} alt="Large"/>
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
            >
              <img src={InterStatebutton} alt="Interstate"/>
            </button>
            <button
              className={`names-toolbar-button ${activeFont === 'collegiate' ? 'active' : ''}`}
              onClick={() => setActiveFont('collegiate')}
            >
              <img src={Collegiatebutton} alt="Collegiate"/>
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="add-names-numberrs-row">
          <h5>Color</h5>
          <div className="names-button-main-container">
              <div className="color-names-box" onClick={showColorPopupHandler}>
              <span>{activeColor}</span>
              <SpanColorBox color={activeColor}/>
                <AngleActionIcon/>
              </div>
              {showColorpopup && <ChooseColorBox showColorPopupHandler={showColorPopupHandler} onColorChange={handleColorChange}
      defaultColor={activeColor}/>}
            {/* <button
              className={`names-toolbar-button ${activeColor === 'frontColor' ? 'active' : ''}`}
              onClick={() => setActiveColor('frontColor')}
            >
              <img src={FrontBtn} alt="Color1"/>
            </button>
            <button
              className={`names-toolbar-button ${activeColor === 'backColor' ? 'active' : ''}`}
              onClick={() => setActiveColor('backColor')}
            >
              <img src={BackBtn} alt="Color2"/>
            </button> */}
          </div>
        </div>

        <button className='black-button' onClick={showAddnamesPopupHAndler}>Add Names/Numbers</button>
      </div>
      {showAddnamesPopup && <AddNamesPopup showAddnamesPopupHAndler={showAddnamesPopupHAndler}/>}
    </div>
  );
};

export default NamesToolbar;
