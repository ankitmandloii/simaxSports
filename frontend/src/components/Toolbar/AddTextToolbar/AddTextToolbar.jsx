import React, { useEffect, useRef, useState } from 'react';
import '../AddTextToolbar/AddTextToolbar.css';
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
} from '../../iconsSvg/CustomIcon';
import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox';
import { useDispatch, useSelector } from 'react-redux';
// import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
import { duplicateTextState, addTextState, updateTextState, toggleLockState, moveTextForwardState, moveTextBackwardState } from '../../..//redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { setSelectedBackTextState } from '../../../redux/BackendDesign/TextBackendDesignSlice.js';

const AddTextToolbar = () => {
  // const outlineBoxRef = useRef(null);
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const [currentTextToolbarId, setCurrentTextToolbarId] = useState(String(Date.now()));  // current id of toolbar
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
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
  const [rangeValuesRotate, setRangeValuesRotate] = useState(textContaintObject ? textContaintObject.rotate : 0);
  const [rangeValuesSpacing, setRangeValuesSpacing] = useState(textContaintObject ? textContaintObject.Spacing : 0);
  const [flipXValue, setflipXValue] = useState(textContaintObject ? textContaintObject.flipX : false);
  const [flipYValue, setflipYValue] = useState(textContaintObject ? textContaintObject.flipY : false);
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
    setRangeValuesRotate(parseFloat(textContaintObject?.rotate));

    return () => {
      // dispatch(setSelectedTextState(null));
      //  dispatch(setSelectedBackTextState(null));
    }
  }, [dispatch, selectedTextId, allTextInputData, textContaintObject])
  //  [dispatch,selectedTextId, selectedBackTextId ])


  const handleRangeInputSizeChange = (e) => {
    const rawValue = e.target.value;

    // Update the UI state immediately (even for partially typed values)
    setRangeValuesSize(rawValue);

    const parsed = parseFloat(rawValue);

    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    const scaleRatio = parsed / prevSize;
    const scaleX = textContaintObject.scaleX;
    const scaleY = textContaintObject.scaleY;

    globalDispatch("scaleX", scaleX * scaleRatio);
    globalDispatch("scaleY", scaleY * scaleRatio);
    globalDispatch("scaledValue", parsed);

    setPrevSize(parsed);
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


  // const handleRangeInputRotateChange = (e) => {
  //   const { value } = e.target;
  //   setRangeValuesRotate(value);
  //   globalDispatch("rotate", parseFloat(value));
  // };



  const handleRangeInputRotateChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesRotate(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) return;

    globalDispatch("rotate", parsed);
  };


  const handleRotateBlur = () => {
    const parsed = parseFloat(rangeValuesRotate);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) {
      setRangeValuesRotate("0");
      globalDispatch("rotate", 0);
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
    setShowContent(value.length > 0);

    // Remove only leading spaces
    setText(value.replace(/^\s+/, ''));

    if (textContaintObject) {
      globalDispatch("content", value.replace(/^\s+/, ''));
    } else {
      dispatch(addTextState({
        value: value,
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


  const colorClassName = flipXValue !== true ? 'toolbar-box-icons-container-flip1' : 'toolbar-box-icons-container-clickStyle-flip1';
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

  const colorClassNameForY = flipYValue !== true ? 'toolbar-box-icons-container-flip2' : 'toolbar-box-icons-container-clickStyle-flip2';
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  const handleDuplcateTextInput = () => {
    const islocked = textContaintObject.locked;
    if (islocked) return;
    setDuplicateActive(prev => !prev);
    dispatch(duplicateTextState(currentTextToolbarId));

  }

  const handleBringBackward = () => {
    // console.log("sending id ", selectedTextId)
    dispatch(moveTextBackwardState(selectedTextId));
  };
  const handleBringForward = () => {
    dispatch(moveTextForwardState(selectedTextId));
  };

  function getRenderIconForSendToTop() {
    if (!textContaintObject || !allTextInputData) return;
    // console.log(textContaintObject.layerIndex + 1, allTextInputData.length, "both values");
    const layerIndex = textContaintObject.layerIndex;
    const ArraySize = allTextInputData.length - 1;


    // console.log(layerIndex, ArraySize, "layer data")

    if (layerIndex > 0 && layerIndex < ArraySize) return false;

    if (layerIndex < ArraySize) return false

    return true;

  }
  function getRenderIconForSendToBack() {
    if (!textContaintObject || !allTextInputData) return;
    const layerIndex = textContaintObject.layerIndex;
    const ArraySize = allTextInputData.length;

    // console.log(layerIndex, ArraySize, "layer data")

    if (layerIndex > 0 && layerIndex < ArraySize) return false;

    if (layerIndex > 0) return false

    return true;
  }
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  return (
    <div className="toolbar-main-container AddTextToolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Text Editor</h5>
        <h3>Add new Text</h3>
        <p>You can select multiple products and colors</p>
      </div>

      <div className="toolbar-box">
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
                <div className='addText-first-toolbar-box-container'>
                  <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                    <div
                      className={`toolbar-box-icons-container ${centerActive ? 'active' : ''}`}
                      onClick={() => {
                        globalDispatch("position", { x: 325, y: textContaintObject.position.y });
                        setCenterActive(!centerActive);
                      }}
                    >
                      <span><AlignCenterIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container'>Center</div>
                  </div>

                  <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                    <div className='toolbar-box-icons-container-for-together'>

                      {
                        getRenderIconForSendToTop() ? <div className='toolbar-box-icons-container-layering1'  > <span><LayeringFirstIcon /></span> </div> : <div className='toolbar-box-icons-container-layering1' onClick={() => handleBringForward()} > <span><LayeringFirstIconWithBlackBg /></span></div>
                      }

                      {
                        getRenderIconForSendToBack() ? <div className='toolbar-box-icons-container-layering2' > <span><LayeringSecondIcon /></span> </div> : <div className='toolbar-box-icons-container-layering2' onClick={() => handleBringBackward()}>  <span><LayeringSecondIconWithBlackBg /></span></div>
                      }
                    </div>
                    Layering
                  </div>

                  <div className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`}>
                    <div className='toolbar-box-icons-container-for-together'>
                      <div className={colorClassName} onClick={() => callForXFlip()}><span>{icon}</span></div>
                      <div className={colorClassNameForY} onClick={() => callForYFlip()}><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div
                    className="toolbar-box-icons-and-heading-container"
                    onClick={() => dispatch(toggleLockState(currentTextToolbarId))}
                  >
                    <div className={`toolbar-box-icons-container ${isLocked ? 'active' : ''}`}>
                      <span><LockIcon /></span>
                    </div>
                    <div className="toolbar-box-heading-container">Lock</div>
                  </div>

                  <div
                    className={`toolbar-box-icons-and-heading-container ${isLocked ? 'locked-toolbar' : ''}`} onClick={() => handleDuplcateTextInput()}
                  >
                    <div className={`toolbar-box-icons-container ${duplicateActive ? 'active' : ''}`}>
                      <span><DuplicateIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container'>Duplicate</div>
                  </div>

                </div>

                <hr />
                <div className={`addText-inner-main-containerr ${isLocked ? 'locked-toolbar' : ''}`}>
                  <div className='toolbar-box-Font-Value-set-inner-container'>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>Font</div>
                    <div className='toolbar-box-Font-Value-set-inner-actionlogo cursor' onClick={() => setShowFontSelector(true)}>
                      {selectedFont} <span><AngleActionIcon /></span>
                    </div>
                  </div>

                  <hr />

                  <div className='toolbar-box-Font-Value-set-inner-container'>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>Color</div>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading' onClick={toggleTextColorPopup}>
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
                  <div className='toolbar-box-Font-Value-set-inner-container'>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>Outline</div>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading' onClick={toggleOutlineColorPopup}>
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
                        className="SpanValueBox-input"
                      />
                      {/* Size end here */}



                    </div>
                  </div>


                  <hr></hr>


                  <div className='toolbar-box-Font-Value-set-inner-container'>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>
                      Arc
                    </div>
                    <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
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
                        className="SpanValueBox-input"
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesArc} /></span> */}
                    </div>
                  </div>
                  {/* arc end here */}
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
                        className="SpanValueBox-input"
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesRotate} /></span> */}
                    </div>
                  </div>

                  <hr></hr>
                  <div className='toolbar-box-Font-Value-set-inner-container'>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>
                      Spacing
                    </div>
                    <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
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
                        className="SpanValueBox-input"
                      />

                      {/* <span><SpanValueBox valueShow={rangeValuesSpacing} /></span> */}

                    </div>
                  </div>

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
