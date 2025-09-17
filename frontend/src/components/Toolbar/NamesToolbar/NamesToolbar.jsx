import React, { useEffect, useState } from 'react';
import style from './NamesToolbar.module.css';
import FrontBtn from '../../images/Front.png';
import BackBtn from '../../images/Back.png';
import SmallBtn from '../../images/small.png';
import LargeBtn from '../../images/large.png';
import InterStatebutton from '../../images/font1.png';
import Collegiatebutton from '../../images/font2.png';
import AddNamesPopup from '../../PopupComponent/AddNamesPopup/AddNamesPopup';
import { AngleActionIcon } from '../../iconsSvg/CustomIcon';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setactiveNameAndNumberPrintSide, setActiveSide, setAddName, setAddNumber, updateNameAndNumberDesignState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NamesToolbar = () => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);

  // const { addName, addNumber } = useSelector(
  //   (state) => ({
  //     addName: state.TextFrontendDesignSlice.present[activeSide]?.addName || false,
  //     addNumber: state.TextFrontendDesignSlice.present[activeSide]?.addNumber || false,
  //   })
  // );
  const { addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice)
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice?.nameAndNumberDesignState);
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddnamesPopup, setShowAddnamesPopup] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [activeNumber, setActiveNumber] = useState(addNumber);
  const [activeName, setActiveName] = useState(addName);
  const [activeSize, setActiveSize] = useState(nameAndNumberDesign?.fontSize);
  const [activeFont, setActiveFont] = useState(nameAndNumberDesign?.fontFamily);
  const [activeColor, setActiveColor] = useState(nameAndNumberDesign?.fontColor);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  console.log("-----------activeFont", activeFont)

  const showAddnamesPopupHandler = () => {
    // console.log("--------------------nameeee")
    if (!selectedProducts || selectedProducts.length === 0) {
      toast.info("Please Add Product First");
      navigate("/design/product");
      return;
    }
    setShowAddnamesPopup(!showAddnamesPopup);
  };

  const showColorPopupHandler = () => {
    setShowColorPopup(!showColorPopup);
  };

  const sideHandler = (value) => {
    // console.log("---------value", value)
    dispatch(setActiveSide(value));
    dispatch(setactiveNameAndNumberPrintSide(value, activeSide));

  };

  const handleColorChange = (color) => {
    dispatch(updateNameAndNumberDesignState({ side: activeSide, changes: { fontColor: color } }));
    setActiveColor(color);
  };

  const handleAddNames = () => {
    const value = !addName;
    setActiveName(value);
    dispatch(setAddName(value));
  };

  const handleAddNumber = () => {
    const value = !addNumber;
    setActiveNumber(value);
    dispatch(setAddNumber(value));
  };

  const sizeHandler = (value) => {
    dispatch(updateNameAndNumberDesignState({ side: activeSide, changes: { fontSize: value } }));
    setActiveSize(value);
  };

  const fontHandler = (value) => {
    dispatch(updateNameAndNumberDesignState({ side: activeSide, changes: { fontFamily: value } }));
    setActiveFont(value);
  };

  useEffect(() => {
    setActiveName(addName);
    setActiveNumber(addNumber);
    setActiveColor(nameAndNumberDesign?.fontColor);
    setActiveFont(nameAndNumberDesign?.fontFamily);
    setActiveSize(nameAndNumberDesign?.fontSize);
  }, [addName, addNumber, nameAndNumberDesign, activeSide]);

  useEffect(() => {
    dispatch(setActiveSide("back"));
  }, []);

  return (
    <div className={`toolbar-main-container ${style.NamesToolbarBox}`}>
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Names And Numbers</h5>
        <h2>Names & Numbers Tools</h2>

      </div>

      <div className="toolbar-box">
        {/* Step 1 */}
        <div className={style.addNamesNumberrsRow}>
          <h5>Step 1 :</h5>
          <label className={style.namescheckboxDiv}>
            <label className={style.switch}>
              <input
                type="checkbox"
                checked={activeName}
                onChange={handleAddNames}
                disabled={activeSide === "rightSleeve" || activeSide === "leftSleeve"}
              />
              <span className={style.slider}></span>
            </label>
            <span>Add Names</span>
          </label>
          <label className={style.namescheckboxDiv}>
            <label className={style.switch}>
              <input
                type="checkbox"
                checked={activeNumber}
                onChange={handleAddNumber}
                disabled={activeSide === "rightSleeve" || activeSide === "leftSleeve"}
              />
              <span className={style.slider}></span>
            </label>
            <span>Add Numbers</span>
          </label>
        </div>

        {/* Show only when either name or number is checked */}
        <div className={`${(activeName || activeNumber) ? style.Active : style.Deactive} step-toggle-container`}>
          {/* Side */}
          <div className={style.addNamesNumberrsRow}>
            <h5>Side</h5>
            <div className={style.namesButtonMainContainer}>
              <button
                className={`${style.namesToolbarButton} ${activeNameAndNumberPrintSide === 'front' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => sideHandler("front")}
              >
                <img src={FrontBtn} alt="Front" />
              </button>
              <button
                className={`${style.namesToolbarButton} ${activeNameAndNumberPrintSide === 'back' ? style.namesToolbarButtonActive : ''}`}
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
                className={`${style.namesToolbarButton} ${activeFont === 'Interstate' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => fontHandler("Interstate")}

              >
                <img src={InterStatebutton} alt="Interstate" />
              </button>
              <button
                className={`${style.namesToolbarButton} ${activeFont === 'Collegiate' ? style.namesToolbarButtonActive : ''}`}
                onClick={() => fontHandler('Collegiate')}
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
              {showColorPopup && (
                <ChooseColorBox
                  showColorPopupHandler={showColorPopupHandler}
                  onColorChange={handleColorChange}
                  defaultColor={activeColor}
                />
              )}
            </div>
          </div>
          {/* <button className={style.blackButton} onClick={showAddnamesPopupHandler}>
            Step 2: Enter Names/Numbers
          </button> */}
          <button className={`${style.blackButton} ${isButtonClicked ? style.clicked : ''}`} onClick={showAddnamesPopupHandler}>
            Step 2: Enter Names/Numbers
          </button>
        </div>
      </div>
      {showAddnamesPopup && <AddNamesPopup showAddnamesPopupHandler={showAddnamesPopupHandler} />}
    </div>
  );
};

export default NamesToolbar;