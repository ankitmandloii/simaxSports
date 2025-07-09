import React, { useEffect, useRef, useState } from 'react';
import style from './AddTextToolbar.module.css';
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
  // LayeringFirstIconWithBlackBg,
  // LayeringSecondIconWithBlackBg,
} from '../../iconsSvg/CustomIcon';
import { FaBold } from "react-icons/fa";
import { ImItalic } from "react-icons/im";
import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox';
import { useDispatch, useSelector } from 'react-redux';
// import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
// import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
import { duplicateTextState, addTextState, updateTextState, toggleLockState, moveTextForwardState, moveTextBackwardState, moveElementForwardState, moveElementBackwardState } from '../../..//redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { setSelectedBackTextState } from '../../../redux/BackendDesign/TextBackendDesignSlice.js';

const AddTextToolbar = () => {
  // const outlineBoxRef = useRef(null);
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const [currentTextToolbarId, setCurrentTextToolbarId] = useState(String(Date.now()));  // current id of toolbar
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
  const allImagesData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  let textContaintObject = allTextInputData.find((text) => text.id === currentTextToolbarId);
  // console.log(allTextInputData, textContaintObject, "render data");
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId);
  const isLocked = textContaintObject?.locked;
  const [prevSize, setPrevSize] = useState(1);
  const textareaRef = useRef(null)
  // console.log("-------lock", isLocked, "---", textContaintObject?.locked)
  // const allTextBackInputData =  useSelector((state) => state.TextBackendDesignSlice.texts); 
  // const textBackContaintObject = allTextBackInputData.find((text) => text.id == currentTextToolbarId);
  // const selectedBackTextId = useSelector((state) => state.TextBackendDesignSlice.selectedTextId); // current id of toolbar
  // //console.log("text", text)
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
  const [rangeValuesRotate, setRangeValuesRotate] = useState(textContaintObject ? textContaintObject.angle : 0);
  const [rangeValuesSpacing, setRangeValuesSpacing] = useState(textContaintObject ? textContaintObject.Spacing : 0);
  const [flipXValue, setflipXValue] = useState(textContaintObject ? textContaintObject.flipX : false);
  const [flipYValue, setflipYValue] = useState(textContaintObject ? textContaintObject.flipY : false);
  const [fontweightValue, setFontweightValue] = useState(textContaintObject ? textContaintObject.fontWeight : "normal");
  const [fontStyleValue, setFontStyleValue] = useState(textContaintObject ? textContaintObject.fontStyle : "normal");



  const colorClassNameForBold = fontweightValue === 'bold'
    ? style.toolbarIconActive
    : style.toolbarIcon;

  const colorClassNameForItalic = fontStyleValue === 'italic'
    ? style.toolbarIconActive
    : style.toolbarIcon;





  const [rangeValuesArc, setRangeValuesArc] = useState(textContaintObject ? textContaintObject.arc : 0);
  // const [prevValue, setPrevValue] = useState("");
  const [duplicateActive, setDuplicateActive] = useState(false);
  const [centerActive, setCenterActive] = useState(false);
  useEffect(() => {
    // setText(textContaintObject.content);
    if (selectedTextId) {

      setCurrentTextToolbarId(selectedTextId);
      // console.log("is selected id ", selectedTextId);
      // setShowContent(true);
      textContaintObject = allTextInputData.find((text) => text.id === selectedTextId);
      if (!textContaintObject) return

      // setText(currentInputData.content);
      // setTextColor(currentInputData.textColor);
      // setOutlineColor(currentInputData.outLineColor);
      // setOutlineSize(currentInputData.outLineSize);
      // setSelectedFont(currentInputData.fontFamily);
      // setShowFontSelector(false);
      // setRangeValuesSize(currentInputData.scaledValue);
      // setRangeValuesSpacing(currentInputData.spacing);
      // setRangeValuesArc(currentInputData.arc);
      // setRangeValuesRotate(currentInputData.rotate);
      // setText(currentInputData.content);
      // setText(currentInputData.content);

    }
    setShowContent(textContaintObject?.content.length > 0);
    setText(textContaintObject?.content);
    setTextColor(textContaintObject?.textColor);
    setOutlineColor(textContaintObject?.outLineColor);
    setOutlineSize(textContaintObject?.outLineSize);
    setSelectedFont(textContaintObject?.fontFamily);
    setShowFontSelector(false);
    setRangeValuesSize(textContaintObject?.scaledValue);
    setRangeValuesSpacing(textContaintObject?.spacing);
    setRangeValuesArc(textContaintObject?.arc);
    setRangeValuesRotate(parseFloat(textContaintObject?.angle));

    return () => {
      // dispatch(setSelectedTextState(null));
      //  dispatch(setSelectedBackTextState(null));
    }
  }, [dispatch, selectedTextId, allTextInputData, textContaintObject])
  //  [dispatch,selectedTextId, selectedBackTextId ])


  const handleRangeInputSizeChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesSize(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    const scaleX = textContaintObject.scaleX;
    const scaleY = textContaintObject.scaleY;

    // Use average of current X and Y scale as "prev size"
    const currentAvg = (scaleX + scaleY) / 2;

    const scaleRatio = parsed / currentAvg;

    globalDispatch("scaleX", scaleX * scaleRatio);
    globalDispatch("scaleY", scaleY * scaleRatio);
    globalDispatch("scaledValue", parsed);

    setPrevSize(parsed); // if shared across
  };


  const handleBlur = () => {
    const parsed = parseFloat(rangeValuesSize);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
      setRangeValuesSize("5");
      setPrevSize(5);
      globalDispatch("scaleX", 5);
      globalDispatch("scaleY", 5);
      globalDispatch("scaledValue", 5);
    }
  };


  // const handleRangeInputSizeChange = (e) => {

  //   const value = parseFloat(e.target.value)
  //   const scaleRatio = value / prevSize; // e.g. from 4.2 → 5 = 1.19x
  //   const scaleX = textContaintObject.scaleX;
  //   const scaleY = textContaintObject.scaleY;
  //   globalDispatch("scaleX", scaleX * scaleRatio);
  //   globalDispatch("scaleY", scaleY * scaleRatio);
  //   globalDispatch("scaledValue", value);
  //   setRangeValuesSize(parseFloat(value));
  //   setPrevSize(value);
  // };

  // const handleRangeInputArcChange = (e) => {
  //   const { value } = e.target;
  //   setRangeValuesArc(value);
  //   globalDispatch("arc", parseFloat(value));
  // };

  const handleRangeInputArcChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesArc(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < -100 || parsed > 100) return;

    globalDispatch("arc", parsed);
  };


  const handleArcBlur = () => {
    const parsed = parseFloat(rangeValuesArc);
    if (isNaN(parsed) || parsed < -100 || parsed > 100) {
      setRangeValuesArc("0");
      globalDispatch("arc", 0);
    }
  };





  const handleRangeInputRotateChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesRotate(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) return;

    globalDispatch("angle", parsed);
  };


  const handleRotateBlur = () => {
    const parsed = parseFloat(rangeValuesRotate);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) {
      setRangeValuesRotate("0");
      globalDispatch("angle", 0);
    }
  };




  // const handleRangeInputSpacingChange = (e) => {
  //   const value = parseFloat(e.target.value);
  //   globalDispatch("spacing", parseFloat(value));
  //   setRangeValuesSpacing(value);
  // };

  const handleRangeInputSpacingChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesSpacing(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 50) return;

    globalDispatch("spacing", parsed);
  };


  const handleSpacingBlur = () => {
    const parsed = parseFloat(rangeValuesSpacing);
    if (isNaN(parsed) || parsed < 0 || parsed > 50) {
      setRangeValuesSpacing("25");
      globalDispatch("spacing", 25);
    }
  };


  const globalDispatch = (lable, value) => {
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { [lable]: value },
      isRenderOrNot: true,
    }));
  }

  const handleShowContent = (e) => {
    const { value } = e.target;
    setShowContent(value.trim().length > 0);
    console.log("value", value, value.length);
    if (value.trim().length == 0 && value.trim() == "") {
      setText("");
      globalDispatch("content", '');
      return;
    }


    // Remove only leading spaces
    setText(value.replace(/^\s+/, ''));

    if (textContaintObject) {
      globalDispatch("content", value.replace(/^\s+/, ''));
    } else {
      dispatch(addTextState({
        value: value.replace(/^\s+/, ''),
        id: String(currentTextToolbarId)
      }));
    }
  };


  const handleFontSelect = (fontFamilyName, fontFamily) => {
    setSelectedFont(fontFamily);
    // Update font in Redux store
    setShowFontSelector(false);
    globalDispatch("fontFamily", fontFamily);
  };

  const handleClose = () => {
    setShowFontSelector(false);
  };

  const toggleTextColorPopup = () => {
    setTextColorPopup(!textColorPopup);
  };

  const toggleOutlineColorPopup = () => {
    setOutlineColorPopup(!outlineColorPopup);
  };

  const textColorChangedFunctionCalled = (color) => {
    setTextColor(color);
    globalDispatch("textColor", color);
  }

  const textOutLineColorChangedFunctionCalled = (outLineColor) => {


    setOutlineColor(outLineColor);
    globalDispatch("outLineColor", outLineColor);
  }

  const textOutLineRangeChangedFunctionCalled = (outlinesize) => {

    setOutlineSize(outlinesize);
    if (!isNaN(outlinesize) && outlinesize >= 0 && outlinesize <= 10) {
      globalDispatch("outLineSize", outlinesize);
    }
  }


  const callForXFlip = () => {
    const value = !(textContaintObject.flipX);
    setflipXValue(value);
    globalDispatch("flipX", value);
    //console.log("clicked", value);
  }

  const callForBold = () => {
    const value = textContaintObject.fontWeight === "bold" ? "normal" : "bold";
    setFontweightValue(value);
    globalDispatch("fontWeight", value);
    //console.log("clicked", value);
  }
  const callForItalic = () => {
    const value = textContaintObject.fontStyle === "italic" ? "normal" : "italic";
    setFontStyleValue(value);
    globalDispatch("fontStyle", value);
  }


  const colorClassName = flipXValue !== true ? style.toolbarBoxIconsContainerFlip1 : style.toolbarBoxIconsContainerClickStyleFlip1;
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;


  //for FLipY


  const callForYFlip = () => {
    const value = !(textContaintObject.flipY);
    setflipYValue(value);
    //console.log("y value ", value);
    globalDispatch("flipY", value);
  }

  useEffect(() => {
    //console.log(currentTextToolbarId, "id =>");
  }, [flipXValue, flipYValue])

  const colorClassNameForY = flipYValue !== true ? style.toolbarBoxIconsContainerFlip2 : style.toolbarBoxIconsContainerClickStyleFlip2;
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  const handleDuplcateTextInput = () => {
    const islocked = textContaintObject.locked;
    if (islocked) return;
    setDuplicateActive(prev => !prev);
    dispatch(duplicateTextState(currentTextToolbarId));

  }

  const handleBringBackward = () => {
    // console.log("sending id ", selectedTextId)
    // dispatch(moveTextBackwardState(selectedTextId));
    dispatch(moveElementBackwardState(selectedTextId));

  };
  const handleBringForward = () => {
    // dispatch(moveTextForwardState(selectedTextId));
    dispatch(moveElementForwardState(selectedTextId));

  };
  function getRenderIconForSendToTop() {
    if (!textContaintObject || (!allTextInputData && !allImagesData)) return;

    // Calculate total number of elements (texts + images)
    const totalElements = (allTextInputData?.length || 0) + (allImagesData?.length || 0);
    const layerIndex = textContaintObject.layerIndex;

    // If the element is already at the top (highest layerIndex)
    if (layerIndex >= totalElements - 1) return true;

    return false;
  }

  function getRenderIconForSendToBack() {
    if (!textContaintObject || (!allTextInputData && !allImagesData)) return;

    const layerIndex = textContaintObject.layerIndex;

    // If the element is already at the bottom (layerIndex 0)
    if (layerIndex <= 0) return true;

    return false;
  }
  // function getRenderIconForSendToTop() {
  //   if (!textContaintObject || !allTextInputData) return;
  //   // console.log(textContaintObject.layerIndex + 1, allTextInputData.length, "both values");
  //   const layerIndex = textContaintObject.layerIndex;
  //   const ArraySize = allTextInputData.length - 1;


  //   // console.log(layerIndex, ArraySize, "layer data")

  //   if (layerIndex > 0 && layerIndex < ArraySize) return false;

  //   if (layerIndex < ArraySize) return false

  //   return true;

  // }
  // function getRenderIconForSendToBack() {
  //   if (!textContaintObject || !allTextInputData) return;
  //   const layerIndex = textContaintObject.layerIndex;
  //   const ArraySize = allTextInputData.length;

  //   // console.log(layerIndex, ArraySize, "layer data")

  //   if (layerIndex > 0 && layerIndex < ArraySize) return false;

  //   if (layerIndex > 0) return false

  //   return true;
  // }
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  return (
    <div className="toolbar-main-container ">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Text Editor</h5>
        {!showContent ? <h3>Add New Text</h3>
          : <h3>Edit Your Text</h3>}

        {/* <p>You can select multiple products and colors</p> */}
      </div>

      <div className={style.toolbarBox}>
        {!showFontSelector ? (
          <>
            <textarea
              ref={textareaRef}
              placeholder="Begin Typing...."
              onInput={handleShowContent}
              value={text || ''}
              maxLength={250}
            />

            {showContent && (
              <>
                <div className={style.addTextFirstToolbarBoxContainer}>
                  <div className={`${style.toolbarBoxIconsAndHeadingContainer} ${isLocked ? style.lockedToolbar : ''}`}>
                    <div
                      // className={`toolbar-box-icons-container ${centerActive ? 'active' : ''}`}
                      className={`${style.toolbarBoxIconsContainer} center-btn ${centerActive ? 'active' : ''}`}

                      onClick={() => {
                        globalDispatch("position", { x: 280, y: textContaintObject.position.y });
                        setCenterActive(!centerActive);
                      }}
                    >
                      <span><AlignCenterIcon /></span>
                    </div>
                    <div className={style.toolbarBoxHeadingContainer}>Center</div>
                  </div>

                  <div className={`${style.toolbarBoxIconsAndHeadingContainer} ${isLocked ? style.lockedToolbar : ''}`}>
                    <div className={style.toolbarBoxIconsContainerForTogether}>

                      {
                        getRenderIconForSendToTop() ? <div className={style.toolbarBoxIconsContainerLayering1}  > <span><LayeringFirstIcon /></span> </div> : <div className={style.toolbarBoxIconsContainerLayering1Active} onClick={() => handleBringForward()} > <span><LayeringFirstIcon /></span></div>
                      }

                      {
                        getRenderIconForSendToBack() ? <div className={style.toolbarBoxIconsContainerLayering2} > <span><LayeringSecondIcon /></span> </div> : <div className={style.toolbarBoxIconsContainerLayering2Active} onClick={() => handleBringBackward()}>  <span><LayeringSecondIcon /></span></div>
                      }
                    </div>
                    Layering
                  </div>

                  <div className={`${style.toolbarBoxIconsAndHeadingContainer} ${isLocked ? style.lockedToolbar : ''}`}>
                    <div className={style.toolbarBoxIconsContainerForTogether}>
                      <div className={colorClassName} onClick={() => callForXFlip()}><span>{icon}</span></div>
                      <div className={colorClassNameForY} onClick={() => callForYFlip()}><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div
                    className={style.toolbarBoxIconsAndHeadingContainer}
                    onClick={() => dispatch(toggleLockState(currentTextToolbarId))}
                  >
                    <div className={`${style.toolbarBoxIconsContainer} ${isLocked ? style.toolbarBoxIconsContainerActive : ''}`}>
                      <span><LockIcon /></span>
                    </div>
                    <div className="toolbar-box-heading-container">Lock</div>
                  </div>



                  <div className={`${style.toolbarBoxIconsAndHeadingContainer} ${isLocked ? style.lockedToolbar : ''}`}>
                    <div className={style.toolbarBoxIconsContainerForTogether}>
                      <div className={colorClassNameForBold} onClick={callForBold}>
                        <span><FaBold /></span>
                      </div>
                      <div className={colorClassNameForItalic} onClick={callForItalic}>
                        <span><ImItalic /></span>
                      </div>
                    </div>
                    B/I
                  </div>




                  <div
                    className={`${style.toolbarBoxIconsAndHeadingContainer} ${isLocked ? style.lockedToolbar : ''}`} onClick={() => handleDuplcateTextInput()}
                  >
                    <div
                      className={`${style.toolbarBoxIconsContainer} ${style.duplicateBtn}`}>

                      {/* className={`toolbar-box-icons-container ${duplicateActive ? 'active' : ''}`} */}

                      <span><DuplicateIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container'>Duplicate</div>
                  </div>

                </div>

                <hr />
                <div className={`${style.addTextInnerMainContainerr} ${isLocked ? style.lockedToolbar : ''}`}>
                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>Font</div>
                    <div className={style.toolbarBoxFontValueSetInnerActionLogo} onClick={() => setShowFontSelector(true)}>
                      {selectedFont} <span><AngleActionIcon /></span>
                    </div>
                  </div>

                  <hr />

                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>Color</div>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading} onClick={toggleTextColorPopup}>
                      {textColor}
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
                  </div>

                  <hr />
                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>Outline</div>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading} onClick={toggleOutlineColorPopup}>
                      {outlineColor === '' ? 'None' : outlineColor}
                      <SpanColorBox color={outlineColor} />
                      <span><AngleActionIcon /></span>
                      {outlineColorPopup && (
                        <ChooseColorBox
                          addColorPopupHAndler={toggleOutlineColorPopup}
                          title="Outline Color"
                          defaultColor={outlineColor}
                          onColorChange={textOutLineColorChangedFunctionCalled}
                          onRangeChange={textOutLineRangeChangedFunctionCalled}
                          button={true}
                          range={true}
                          outlineSize={outlineSize}
                        />

                      )}
                    </div>
                  </div>



                  <hr />



                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>
                      Size
                    </div>
                    <div className={style.toolbarBoxFontValueSetInnerActionLogo}>
                      <input
                        type="range"
                        name="size"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={rangeValuesSize}
                        onChange={handleRangeInputSizeChange}
                      />

                      <input
                        type="number"
                        min="0.2"
                        max="10"
                        step="0.1"
                        value={rangeValuesSize}
                        onChange={handleRangeInputSizeChange}
                        onBlur={handleBlur}
                        className={style.spanValueBoxInput}
                      />
                      {/* Size end here */}



                    </div>
                  </div>


                  <hr></hr>


                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>
                      Arc
                    </div>
                    <div className={style.toolbarBoxFontValueSetInnerActionLogo}>
                      <input
                        type="range"
                        id="min"
                        name="min"
                        min="-100"
                        max="100"
                        step="0.1"
                        value={rangeValuesArc}
                        onChange={handleRangeInputArcChange}
                      />

                      <input
                        type="number"
                        min="-100"
                        max="100"
                        step="0.1"
                        value={rangeValuesArc}
                        onChange={handleRangeInputArcChange}
                        onBlur={handleArcBlur}
                        className={style.spanValueBoxInput}
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesArc} /></span> */}
                    </div>
                  </div>
                  {/* arc end here */}
                  <hr></hr>



                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>
                      Rotate
                    </div>
                    <div className={style.toolbarBoxFontValueSetInnerActionLogo}>
                      <input
                        type="range"
                        id="min"
                        name="min"
                        min="0"
                        max="360"
                        step="0.1"
                        value={rangeValuesRotate}
                        onChange={handleRangeInputRotateChange}
                      />

                      <input
                        type="number"
                        min="0"
                        max="360"
                        step="0.1"
                        value={rangeValuesRotate}
                        onChange={handleRangeInputRotateChange}
                        onBlur={handleRotateBlur}
                        className={style.spanValueBoxInput}
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesRotate} /></span> */}
                    </div>
                  </div>

                  <hr></hr>
                  <div className={style.toolbarBoxFontValueSetInnerContainer}>
                    <div className={style.toolbarBoxFontValueSetInnerActionHeading}>
                      Spacing
                    </div>
                    <div className={style.toolbarBoxFontValueSetInnerActionLogo}>
                      <input
                        type="range"
                        id="min"
                        name="min"
                        min="0"
                        max="50"
                        step="0.1"
                        value={rangeValuesSpacing}
                        onChange={handleRangeInputSpacingChange}
                      />

                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        value={rangeValuesSpacing}
                        onChange={handleRangeInputSpacingChange}
                        onBlur={handleSpacingBlur}
                        className={style.spanValueBoxInput}
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesSpacing} /></span> */}

                    </div>
                  </div>
                  <hr></hr>
                </div>

              </>
            )}
          </>
        ) : (
          <FontCollectionList onSelect={handleFontSelect} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default AddTextToolbar;
