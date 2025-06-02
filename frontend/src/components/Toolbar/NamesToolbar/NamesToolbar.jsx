import React, { useEffect, useState } from 'react';
// import './NamesToolbar.css';
import style from './NamesToolbar.module.css'
import FrontBtn from '../../images/Frontbutton.png';
import BackBtn from '../../images/Backbuton.png';
import SmallBtn from '../../images/sm-btn.png';

import LargeBtn from '../../images/Largebutton.png';
import InterStatebutton from '../../images/InterStatebutton.png';
import Collegiatebutton from '../../images/Collegiatebutton.png';
import AddNamesPopup from '../../PopupComponent/AddNamesPopup/AddNamesPopup';
import { AngleActionIcon } from '../../iconsSvg/CustomIcon';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx'
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx'
import { useDispatch, useSelector } from 'react-redux';
import { removeNameAndNumberProduct, setActiveSide, setAddName, UpdateNameAndNumberProduct, setAddNumber, updateNameAndNumberDesignState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { RxFontFamily } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NamesToolbar = () => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberDesignState)
  // console.log(addNumber,addName,nameAndNumberDesign,"values");
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddnamesPopup, setshowAddnamesPopup] = useState(false);
  const [showColorpopup, setshowcolorpopup] = useState(false);

  const showAddnamesPopupHAndler = () => {
    if (!selectedProducts || selectedProducts.length == 0) {
      toast.info("Please Add Product First");      // Orange
      navigate("/product?productId=8847707537647&title=Dusty%20Rose%20/%20S");
      return;
    }
    setshowAddnamesPopup(!showAddnamesPopup)
  }
  const showColorPopupHandler = () => {
    setshowcolorpopup(!showColorpopup)
  }
  const [activeNumber, setActiveNumber] = useState(addNumber);
  const [activeName, setActiveName] = useState(addName);

  // console.log(activeName,activeNumber,"local state")

  const [activeSize, setActiveSize] = useState(nameAndNumberDesign?.fontSize);
  const [activeFont, setActiveFont] = useState(nameAndNumberDesign?.fontFamily);
  const [activeColor, setActiveColor] = useState(nameAndNumberDesign?.fontColor);

  const sideHandler = (value) => {
    dispatch(updateNameAndNumberDesignState({ changes: { side: value } }));
    dispatch(setActiveSide(value))
  }
  const handleColorChange = (color) => {
    dispatch(updateNameAndNumberDesignState({ changes: { fontColor: color } }));
    setActiveColor(color);
  };

  const handleAddNames = () => {
    const value = !(addName);
    setActiveName(value)
    dispatch(setAddName(value));
    // setTimeout(() => {
    //   dispatch(setAddName(value));
    // }, 50);

  }
  const handleAddNumber = () => {
    const value = !(addNumber);
    setActiveNumber(value)
    dispatch(setAddNumber(value));
    // setTimeout(() => {
    //   dispatch(setAddNumber(value));
    // }, 50);
  }

  // ************************************************* WE HAVE TO CHANGE THIS DYNAMICALLY LATER ***********************************************************************************
  // ************************************************* WE HAVE TO CHANGE THIS DYNAMICALLY LATER ***********************************************************************************

  const sizeHandler = (value) => {
    dispatch(updateNameAndNumberDesignState({ changes: { fontSize: value } }));
    // if (value == "small") {
    //   if (activeSide === 'front') {
    //     dispatch(updateNameAndNumberDesignState({ changes: { position: { x: 393, y: 272 } } }));
    //   }
    //   else {
    //     dispatch(updateNameAndNumberDesignState({ changes: { position: { x: 325, y: 300 } } }));
    //   }
    // }
    // else {
    //   dispatch(updateNameAndNumberDesignState({ changes: { position: { x: 330, y: 350 } } }));
    // }
    setActiveSize(value);
  }

  const fontHandler = (value) => {
    dispatch(updateNameAndNumberDesignState({ changes: { fontFamily: value } }));
    // const cle = setTimeout(() => {
    //   dispatch(updateNameAndNumberDesignState({ changes: { fontFamily: value } }));
    // }, 50);
    setActiveFont(value);
  }


  // Keep local state in sync with Redux on load/update

  useEffect(() => {
    setActiveName(addName);
    setActiveNumber(addNumber);
    setActiveColor(nameAndNumberDesign?.fontColor);
    setActiveFont(nameAndNumberDesign?.fontFamily);
    setActiveSize(nameAndNumberDesign?.fontSize);

  }, [nameAndNumberDesign]);
  return (
    <div className={`toolbar-main-container ${style.NamesToolbarBox}`}>

      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Names And Numbers</h5>
        <h2>Add Names And Numbers</h2>
        <p>Use personalized Names & Numbers for projects like team jerseys where you need a unique name and/or number for each item.</p>
      </div>

      <div className="toolbar-box
      ">
        {/* Step 1 */}
        <div className={style.addNamesNumberrsRow}>
          <h5>Step1</h5>
          <label className={style.namescheckboxDiv} >
            <input
              type="checkbox"
              checked={activeName}
              value={activeName}
              onChange={handleAddNames}
              readOnly
            />
            <span>Add Names</span>
          </label>
          <label className={style.namescheckboxDiv}>
            <input
              type="checkbox"
              checked={activeNumber}
              onChange={handleAddNumber}
              readOnly
            />
            <span>Add Numbers</span>
          </label>
        </div>
        {/* ***************************show only when either number or name checked************ */}
        <div className={`${(activeName || activeNumber) ? style.Active : style.Deactive} step-toggle-container`}>
          {/* Side */}
          <div className={style.addNamesNumberrsRow}>
            <h5>Side</h5>
            <div className={style.namesButtonMainContainer}>
              <button
                className={`${style.namesToolbarButton} ${activeSide === 'front' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => sideHandler("front")}
              >
                <img src={FrontBtn} alt="Front" />
              </button>
              <button
                className={`${style.namesToolbarButton} ${activeSide === 'back' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => sideHandler("back")}
              >
                <img src={BackBtn} alt="Back" />
              </button>
            </div>
          </div>

          {/* Size */}
          <div className={style.addNamesNumberrsRow}>
            <h5>Size</h5>
            <div className={style.namesButtonMainContainer}>
              <button
                className={`${style.namesToolbarButton} ${activeSize === 'small' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => sizeHandler("small")}
              >
                <img src={SmallBtn} alt="Small" />
              </button>
              <button
                className={`${style.namesToolbarButton} ${activeSize === 'large' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => sizeHandler("large")}
              >
                <img src={LargeBtn} alt="Large" />
              </button>
            </div>
          </div>

          {/* Font */}
          <div className={style.addNamesNumberrsRow}>
            <h5>Font</h5>
            <div className={style.namesButtonMainContainer}>
              <button
                // className={`names-toolbar-button ${activeFont === "Oswald" ? 'active' : ''}`}
                className={`${style.namesToolbarButton} ${activeFont === 'Oswald' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => fontHandler("Oswald")}
              >
                <img src={InterStatebutton} alt="Interstate" />
              </button>
              <button
                // className={`names-toolbar-button ${activeFont == 'Chakra Petch' ? 'active' : ''}`}
                className={`${style.namesToolbarButton} ${activeFont === 'Chakra Petch' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => fontHandler('Chakra Petch')}
              >
                <img src={Collegiatebutton} alt="Collegiate" />
              </button>
            </div>
          </div>

          {/* Color */}
          <div className={style.addNamesNumberrsRow}>
            <h5>Color</h5>
            <div className={style.namesButtonMainContainer}>
              <div className={style.colorNamesBox} onClick={showColorPopupHandler}>
                <span>{activeColor}</span>
                <SpanColorBox color={activeColor} />
                <AngleActionIcon />
              </div>
              {showColorpopup && <ChooseColorBox showColorPopupHandler={showColorPopupHandler} onColorChange={handleColorChange}
                defaultColor={activeColor} />}
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
          <button className={style.blackButton} onClick={showAddnamesPopupHAndler}>Add Names/Numbers</button>

        </div>

      </div>
      {showAddnamesPopup && <AddNamesPopup showAddnamesPopupHAndler={showAddnamesPopupHAndler} />}
    </div>
  );
};

export default NamesToolbar;
