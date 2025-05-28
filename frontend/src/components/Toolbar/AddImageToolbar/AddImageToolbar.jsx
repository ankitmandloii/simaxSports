import React, { useEffect, useRef, useState } from 'react';
import '../AddImageToolbar/AddImageToolbar.css';
import {
  AlignCenterIcon,
  LayeringFirstIcon,
  LayeringSecondIcon,
  FlipFirstIcon,
  FlipSecondIcon,
  LockIcon,
  DuplicateIcon,
  AngleActionIcon,
  FlipFirstWhiteColorIcon,
  FlipSecondWhiteColorIcon,
  LayeringFirstIconWithBlackBg,
  LayeringSecondIconWithBlackBg,
} from '../../iconsSvg/CustomIcon.js';
// import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
// import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
// import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
// import { duplicateTextState, addTextState, updateTextState, toggleLockState, moveTextForwardState, moveTextBackwardState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { setSelectedBackTextState } from '../../../redux/BackendDesign/TextBackendDesignSlice.js';
import { useLocation } from "react-router-dom";


const filters = [
  { name: 'Normal', src: '/images/normal.png' },
  { name: 'Single Color', src: '/images/single-color.png' },
  { name: 'Black/Whte', src: '/images/black-white.png' },
];


const AddImageToolbar = () => {

  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const [currentTextToolbarId, setCurrentTextToolbarId] = useState(String(Date.now()));  // current id of toolbar
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
  let textContaintObject = allTextInputData.find((text) => text.id === currentTextToolbarId);
  

const [currentImageToolbarId, setCurrentImageToolbarId] = useState(String(Date.now()));  // current id of toolbar
 

const image = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images[0]);
// let imageContaintObject = image.find((image) => image.id === currentImageToolbarId);

const [selectedFilter, setSelectedFilter] = useState('Normal');
  const imgRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);




  useEffect(() => {
    if (image?.src) {
      setPreviewUrl(image.src);
    }
  }, [image?.src]);


  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId);
  const isLocked = textContaintObject?.locked;
  const [prevSize, setPrevSize] = useState(1);
  const textareaRef = useRef(null)



  const [text, setText] = useState(textContaintObject ? textContaintObject.content : "")
  const [textColorPopup, setTextColorPopup] = useState(false);
  const [outlineColorPopup, setOutlineColorPopup] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState(textContaintObject ? textContaintObject.fontFamily : "Inter");
  const [textColor, setTextColor] = useState(textContaintObject ? textContaintObject.textColor : "#000000");
  const [outlineColor, setOutlineColor] = useState(textContaintObject ? textContaintObject.outLineColor : '');
  const [outlineSize, setOutlineSize] = useState(textContaintObject ? textContaintObject.outlineSize : 0);
  const [rangeValuesSize, setRangeValuesSize] = useState(textContaintObject ? textContaintObject.scaledValue : 1);
  const [rangeValuesRotate, setRangeValuesRotate] = useState(textContaintObject ? textContaintObject.rotate : 0);
  const [rangeValuesSpacing, setRangeValuesSpacing] = useState(textContaintObject ? textContaintObject.Spacing : 0);
  const [flipXValue, setflipXValue] = useState(textContaintObject ? textContaintObject.flipX : false);
  const [flipYValue, setflipYValue] = useState(textContaintObject ? textContaintObject.flipY : false);
  const [rangeValuesArc, setRangeValuesArc] = useState(textContaintObject ? textContaintObject.arc : 0);

  const [duplicateActive, setDuplicateActive] = useState(false);
  const [centerActive, setCenterActive] = useState(false);
  useEffect(() => {

    // if (selectedTextId) {

    //   setCurrentTextToolbarId(selectedTextId);

    //   textContaintObject = allTextInputData.find((text) => text.id === selectedTextId);
    //   if (!textContaintObject) return


    // }
    // setShowContent(textContaintObject?.content.length > 0);
    // setText(textContaintObject?.content);
    // setTextColor(textContaintObject?.textColor);
    // setOutlineColor(textContaintObject?.outLineColor);
    // setOutlineSize(textContaintObject?.outLineSize);
    // setSelectedFont(textContaintObject?.fontFamily);
    // setShowFontSelector(false);
    // setRangeValuesSize(textContaintObject?.scaledValue);
    // setRangeValuesSpacing(textContaintObject?.spacing);
    // setRangeValuesArc(textContaintObject?.arc);
    // setRangeValuesRotate(parseFloat(textContaintObject?.rotate));

    // return () => {

    // }
  }, [dispatch, selectedTextId, allTextInputData, textContaintObject])



  const handleRangeInputSizeChange = (e) => {
    // const rawValue = e.target.value;

    // // Update the UI state immediately (even for partially typed values)
    // setRangeValuesSize(rawValue);

    // const parsed = parseFloat(rawValue);

    // if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    // const scaleRatio = parsed / prevSize;
    // const scaleX = textContaintObject.scaleX;
    // const scaleY = textContaintObject.scaleY;

    // globalDispatch("scaleX", scaleX * scaleRatio);
    // globalDispatch("scaleY", scaleY * scaleRatio);
    // globalDispatch("scaledValue", parsed);

    // setPrevSize(parsed);
  };


  const handleBlur = () => {
    // const parsed = parseFloat(rangeValuesSize);
    // if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
    //   setRangeValuesSize("5");
    //   setPrevSize(5);
    //   globalDispatch("scaleX", 5);
    //   globalDispatch("scaleY", 5);
    //   globalDispatch("scaledValue", 5);
    // }
  };


  const handleRangeInputArcChange = (e) => {
    // const rawValue = e.target.value;
    // setRangeValuesArc(rawValue);

    // const parsed = parseFloat(rawValue);
    // if (isNaN(parsed) || parsed < -100 || parsed > 100) return;

    // globalDispatch("arc", parsed);
  };


  const handleArcBlur = () => {
    // const parsed = parseFloat(rangeValuesArc);
    // if (isNaN(parsed) || parsed < -100 || parsed > 100) {
    //   setRangeValuesArc("0");
    //   globalDispatch("arc", 0);
    // }
  };






  const handleRangeInputRotateChange = (e) => {
    // const rawValue = e.target.value;
    // setRangeValuesRotate(rawValue);

    // const parsed = parseFloat(rawValue);
    // if (isNaN(parsed) || parsed < 0 || parsed > 360) return;

    // globalDispatch("rotate", parsed);
  };


  const handleRotateBlur = () => {
    // const parsed = parseFloat(rangeValuesRotate);
    // if (isNaN(parsed) || parsed < 0 || parsed > 360) {
    //   setRangeValuesRotate("0");
    //   globalDispatch("rotate", 0);
    // }
  };





  const handleRangeInputSpacingChange = (e) => {
    // const rawValue = e.target.value;
    // setRangeValuesSpacing(rawValue);

    // const parsed = parseFloat(rawValue);
    // if (isNaN(parsed) || parsed < 0 || parsed > 50) return;

    // globalDispatch("spacing", parsed);
  };


  const handleSpacingBlur = () => {
    // const parsed = parseFloat(rangeValuesSpacing);
    // if (isNaN(parsed) || parsed < 0 || parsed > 50) {
    //   setRangeValuesSpacing("25");
    //   globalDispatch("spacing", 25);
    // }
  };


  const globalDispatch = (lable, value) => {
    // dispatch(updateTextState({
    //   id: String(currentTextToolbarId),
    //   changes: { [lable]: value },
    //   isRenderOrNot: true,
    // }));
  }

  const handleShowContent = (e) => {
    // const { value } = e.target;
    // setShowContent(value.length > 0);

    // // Remove only leading spaces
    // setText(value.replace(/^\s+/, ''));

    // if (textContaintObject) {
    //   globalDispatch("content", value.replace(/^\s+/, ''));
    // } else {
    //   dispatch(addTextState({
    //     value: value,
    //     id: String(currentTextToolbarId)
    //   }));
    // }
  };


  const handleFontSelect = (fontFamilyName, fontFamily) => {
    // setSelectedFont(fontFamily);
    // // Update font in Redux store
    // setShowFontSelector(false);
    // globalDispatch("fontFamily", fontFamily);
  };

  const handleClose = () => {
    // setShowFontSelector(false);
  };

  const toggleTextColorPopup = () => {
    // setTextColorPopup(!textColorPopup);
  };

  const toggleOutlineColorPopup = () => {
    // setOutlineColorPopup(!outlineColorPopup);
  };

  const textColorChangedFunctionCalled = (color) => {
    // setTextColor(color);
    // globalDispatch("textColor", color);
  }

  const textOutLineColorChangedFunctionCalled = (outLineColor) => {


    // setOutlineColor(outLineColor);
    // globalDispatch("outLineColor", outLineColor);
  }

  const textOutLineRangeChangedFunctionCalled = (outlinesize) => {

    // setOutlineSize(outlinesize);
    // if (!isNaN(outlinesize) && outlinesize >= 0 && outlinesize <= 10) {
    //   globalDispatch("outLineSize", outlinesize);
    // }
  }


  const callForXFlip = () => {
    // const value = !(textContaintObject.flipX);
    // setflipXValue(value);
    // globalDispatch("flipX", value);
    //console.log("clicked", value);
  }


  const colorClassName = flipXValue !== true ? 'toolbar-box-icons-container-flip1' : 'toolbar-box-icons-container-clickStyle-flip1';
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;


  //for FLipY


  const callForYFlip = () => {
    // const value = !(textContaintObject.flipY);
    // setflipYValue(value);
    // //console.log("y value ", value);
    // globalDispatch("flipY", value);
  }

  useEffect(() => {
    //console.log(currentTextToolbarId, "id =>");
  }, [flipXValue, flipYValue])

  const colorClassNameForY = flipYValue !== true ? 'toolbar-box-icons-container-flip2' : 'toolbar-box-icons-container-clickStyle-flip2';
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  const handleDuplcateTextInput = () => {
    // const islocked = textContaintObject.locked;
    // if (islocked) return;
    // setDuplicateActive(prev => !prev);
    // dispatch(duplicateTextState(currentTextToolbarId));

  }

  const handleBringBackward = () => {

    // dispatch(moveTextBackwardState(selectedTextId));
  };
  const handleBringForward = () => {
    //dispatch(moveTextForwardState(selectedTextId));
  };

  function getRenderIconForSendToTop() {
    // if (!textContaintObject || !allTextInputData) return;
    // // console.log(textContaintObject.layerIndex + 1, allTextInputData.length, "both values");
    // const layerIndex = textContaintObject.layerIndex;
    // const ArraySize = allTextInputData.length - 1;


    // // console.log(layerIndex, ArraySize, "layer data")

    // if (layerIndex > 0 && layerIndex < ArraySize) return false;

    // if (layerIndex < ArraySize) return false

    // return true;

  }
  function getRenderIconForSendToBack() {
    // if (!textContaintObject || !allTextInputData) return;
    // const layerIndex = textContaintObject.layerIndex;
    // const ArraySize = allTextInputData.length;

    // // console.log(layerIndex, ArraySize, "layer data")

    // if (layerIndex > 0 && layerIndex < ArraySize) return false;

    // if (layerIndex > 0) return false

    // return true;
  }
  useEffect(() => {
    // if (textareaRef.current) {
    //   textareaRef.current.focus();
    // }
  }, []);

  // const [removeBackground, setRemoveBackground] = useState(false);

  // const toggleRemoveBackground = () => {
  //   setRemoveBackground(prev => !prev);
  // };


  //   const [cropAndTrim, setCropAndTrim] = useState(false);

  // const toggleCropAndTrim = () => {
  //   setCropAndTrim(prev => !prev);
  // };


  //   const [superResolution, setSuperResolution] = useState(false);

  // const toggleSuperResolution = () => {
  //   setSuperResolution(prev => !prev);
  // };




console.log("previewUrl", previewUrl, "image src", image?.src);
  return (
    <div className="toolbar-main-container AddTextToolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Upload Art</h5>
        <h3>Edit Your Artwork</h3>
        <p>Our design professionals will select ink colors <br></br> for you or tellus your preferred colors at checkout.</p>
      </div>

      <div className="toolbar-box">

        <>




          <>



            {/* <hr /> */}


            <div className={`addText-inner-main-containerr ${isLocked ? 'locked-toolbar' : ''}`}>
              <div className="filter-section">
                <div className="filter-title">Filters</div>
                <div className="filter-options">
                  {filters.map(filter => (
                    <div
                      key={filter.name}
                      className={`filter-option ${selectedFilter === filter.name ? 'active' : ''}`}
                      onClick={() => setSelectedFilter(filter.name)}
                    >
                      <img 
                        src={previewUrl} alt={filter.name} className="filter-image" onError={() => alert("Image not publicly accessible")} />
                      <div className="filter-label">{filter.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedFilter === "Normal" || selectedFilter === "Single Color" && (<hr />)}

              {selectedFilter === "Normal" && (<div className='toolbar-box-Font-Value-set-inner-container'>
                <div className='toolbar-box-Font-Value-set-inner-actionheading'>Edit Colors</div>
                <div className='toolbar-box-Font-Value-set-inner-actionheading' onClick={toggleTextColorPopup}>
                  <SpanColorBox color={textColor} />
                  <SpanColorBox color={textColor} />
                  <SpanColorBox color={textColor} />
                  <span><AngleActionIcon /></span>
                  {textColorPopup && (
                    <ChooseColorBox
                      addColorPopupHAndler={toggleTextColorPopup}
                      title="Text Color"
                      defaultColor={textColor}
                      onColorChange={textColorChangedFunctionCalled}  // Update text color
                      button={true}
                    />

                  )}
                </div>
              </div>)}



              {selectedFilter === "Single Color" && (<div className='toolbar-box-Font-Value-set-inner-container'>
                <div className='toolbar-box-Font-Value-set-inner-actionheading'>Colors</div>
                <div className='toolbar-box-Font-Value-set-inner-actionheading' onClick={toggleTextColorPopup}>
                  <SpanColorBox color={textColor} />
                  <span><AngleActionIcon /></span>
                  {textColorPopup && (
                    <ChooseColorBox
                      addColorPopupHAndler={toggleTextColorPopup}
                      title="Text Color"
                      defaultColor={textColor}
                      onColorChange={textColorChangedFunctionCalled}  // Update text color
                      button={true}
                    />

                  )}
                </div>
              </div>)}
              {selectedFilter === "Black/Whte" && null}


              {selectedFilter === "Single Color" && (<hr />)}



              {selectedFilter === "Single Color" && (<div className="toolbar-box-Font-Value-set-inner-container">
                <div className="toolbar-box-Font-Value-set-inner-actionheading">
                  Inverts Colors

                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                  // checked={"removeBackground"}
                  // onChange={"toggleRemoveBackground"}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              )}
              <hr />


              {selectedFilter === "Single Color" && (<div className="toolbar-box-Font-Value-set-inner-container">
                <div className="toolbar-box-Font-Value-set-inner-actionheading">
                  Make Solid

                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                  // checked={"removeBackground"}
                  // onChange={"toggleRemoveBackground"}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              )}
              {(selectedFilter === "Single Color" && <hr />)}

              <div className="toolbar-box-Font-Value-set-inner-container">
                <div className="toolbar-box-Font-Value-set-inner-actionheading">
                  Remove Background
                  <span className="ai-badge">AI</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                  // checked={"removeBackground"}
                  // onChange={"toggleRemoveBackground"}
                  />
                  <span className="slider round"></span>
                </label>
              </div>



              <hr />
              <div className="toolbar-box-Font-Value-set-inner-container">
                <div className="toolbar-box-Font-Value-set-inner-actionheading">
                  Crop & Trim
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                  // checked={cropAndTrim}
                  // onChange={toggleCropAndTrim}
                  />
                  <span className="slider round"></span>
                </label>
              </div>




              <hr />
              <div className="toolbar-box-Font-Value-set-inner-container">
                <div className="toolbar-box-Font-Value-set-inner-actionheading">
                  Super Resolution
                  <span className="ai-badge">AI</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                  // checked={superResolution}
                  // onChange={toggleSuperResolution}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <hr />


              <div className='toolbar-box-Font-Value-set-inner-container'>
                <div className='toolbar-box-Font-Value-set-inner-actionheading'>Replace Background With AI<span className="ai-badge">AI</span></div>

                <div className='toolbar-box-Font-Value-set-inner-actionheading' onClick={toggleOutlineColorPopup}>


                  <span><AngleActionIcon /></span>



                </div>
              </div>

              <hr />

              <div className='toolbar-box-Font-Value-set-inner-container'>
                <div className='toolbar-box-Font-Value-set-inner-actionheading'>
                  Size
                </div>
                <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
                  <input
                    type="range"
                    name="size"
                    min="0.2"
                    max="10"
                    step="0.1"
                  // value={rangeValuesSize}
                  // onChange={handleRangeInputSizeChange}
                  />

                  <input
                    type="number"
                    min="0.2"
                    max="10"
                    step="0.1"
                    value={rangeValuesSize}
                    // onChange={handleRangeInputSizeChange}
                    // onBlur={handleBlur}
                    className="SpanValueBox-input"
                  />
                  {/* Size end here */}



                </div>
              </div>


              <hr></hr>






              <div className='toolbar-box-Font-Value-set-inner-container'>
                <div className='toolbar-box-Font-Value-set-inner-actionheading'>
                  Rotate
                </div>
                <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
                  <input
                    type="range"
                    id="min"
                    name="min"
                    min="0"
                    max="360"
                    step="0.1"
                  // value={rangeValuesRotate}
                  // onChange={handleRangeInputRotateChange}
                  />

                  <input
                    type="number"
                    min="0"
                    max="360"
                    step="0.1"
                    // value={rangeValuesRotate}
                    // onChange={handleRangeInputRotateChange}
                    // onBlur={handleRotateBlur}
                    className="SpanValueBox-input"
                  />


                </div>
              </div>

              <hr></hr>
              <p className='add-image-reset-text'>Reset To Default</p>



            </div>











            {/* this is toolbar of image for upload art exm- layring, flip, color, size, arc, rotate, spacing */}
            <div className='addText-first-toolbar-box-container'>

              <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                <div
                  className={`toolbar-box-icons-container ${centerActive ? 'active' : ''}`}
                  onClick={() => {
                    // globalDispatch("position", { x: 325, y: textContaintObject.position.y });
                    // setCenterActive(!centerActive);
                  }}
                >
                  <span><AlignCenterIcon /></span>
                </div>
                <div className='toolbar-box-heading-container'>Center</div>
              </div>

              <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                <div className='toolbar-box-icons-container-for-together'>

                  {
                    getRenderIconForSendToTop() ? <div className='toolbar-box-icons-container-layering1'  > <span><LayeringFirstIcon /></span> </div> : <div className='toolbar-box-icons-container-layering1'
                    // onClick={() => handleBringForward()}
                    >
                      <span><LayeringFirstIconWithBlackBg /></span></div>
                  }

                  {
                    getRenderIconForSendToBack() ? <div className='toolbar-box-icons-container-layering2' > <span><LayeringSecondIcon /></span> </div> : <div className='toolbar-box-icons-container-layering2'
                    // onClick={() => handleBringBackward()}
                    >  <span><LayeringSecondIconWithBlackBg /></span></div>
                  }
                </div>
                Layering
              </div>

              <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                <div className='toolbar-box-icons-container-for-together'>
                  <div className={colorClassName}
                  // onClick={() => callForXFlip()}
                  ><span>{icon}</span></div>
                  <div className={colorClassNameForY}
                  //  onClick={() => callForYFlip()}
                  ><span>{iconY}</span></div>
                </div>
                Flip
              </div>

              <div
                className="toolbar-box-icons-and-heading-container"
              // onClick={() => dispatch(toggleLockState(currentTextToolbarId))}
              >
                <div className={`toolbar-box-icons-container ${isLocked ? 'active' : ''}`}>
                  <span><LockIcon /></span>
                </div>
                <div className="toolbar-box-heading-container">Lock</div>
              </div>

              <div
                className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}
              // onClick={() => handleDuplcateTextInput()}
              >
                <div className={`toolbar-box-icons-container ${duplicateActive ? 'active' : ''}`}>
                  <span><DuplicateIcon /></span>
                </div>
                <div className='toolbar-box-heading-container'>Duplicate</div>
              </div>
            </div>


            {/* toolbar ends here */}
          </>

        </>

      </div>
    </div>
  );
};

export default AddImageToolbar;
