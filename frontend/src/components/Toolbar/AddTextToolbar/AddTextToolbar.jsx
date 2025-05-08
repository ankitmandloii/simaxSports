import React, { useCallback, useEffect, useState } from 'react';
import camera from '../../images/camera.jpg';
import { IoAdd } from "react-icons/io5";
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
  NoneIcon,
  FlipFirstWhiteColorIcon,
  FlipSecondWhiteColorIcon
} from '../../iconsSvg/CustomIcon';
import MyCompo from '../../style/MyCompo';
import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox';
import { useDispatch, useSelector } from 'react-redux';
// import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
import { duplicateTextState, addTextState, setSelectedTextState, updateTextState, toggleLockState } from '../../..//redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { setSelectedBackTextState } from '../../../redux/BackendDesign/TextBackendDesignSlice.js';

const AddTextToolbar = () => {
  const dispatch = useDispatch();
  const [currentTextToolbarId, setCurrentTextToolbarId] = useState(String(Date.now()));  // current id of toolbar
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present.texts);
  const textContaintObject = allTextInputData.find((text) => text.id == currentTextToolbarId);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present.selectedTextId);




  // const allTextBackInputData =  useSelector((state) => state.TextBackendDesignSlice.texts); 
  // const textBackContaintObject = allTextBackInputData.find((text) => text.id == currentTextToolbarId);
  // const selectedBackTextId = useSelector((state) => state.TextBackendDesignSlice.selectedTextId); // current id of toolbar



  // console.log("text", text)


  const [text, setText] = useState(textContaintObject ? textContaintObject.content : "")
  const [textColorPopup, setTextColorPopup] = useState(false);
  const [outlineColorPopup, setOutlineColorPopup] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState(textContaintObject ? textContaintObject.fontFamily : "Inter");
  const [textColor, setTextColor] = useState(textContaintObject ? textContaintObject.textColor : "#000000");
  const [outlineColor, setOutlineColor] = useState(textContaintObject ? textContaintObject.outlineColor : "");
  const [outlineSize, setOutlineSize] = useState(textContaintObject ? textContaintObject.outlineSize : 0);
  const [rangeValuesSize, setRangeValuesSize] = useState(textContaintObject ? textContaintObject.size : 16);
  const [rangeValuesRotate, setRangeValuesRotate] = useState(textContaintObject ? textContaintObject.rotate : 0);
  const [rangeValuesSpacing, setRangeValuesSpacing] = useState(textContaintObject ? textContaintObject.Spacing : 0);
  const [flipXValue, setflipXValue] = useState(textContaintObject ? textContaintObject.flipX : false);
  const [flipYValue, setflipYValue] = useState(textContaintObject ? textContaintObject.flipY : false);
  const [rangeValuesArc, setRangeValuesArc] = useState(textContaintObject ? textContaintObject.arc : 0);


  useEffect(() => {
    if (selectedTextId) {
      setCurrentTextToolbarId(selectedTextId);
      console.log("is selected id ", selectedTextId);
      setShowContent(true);
      const currentInputData = allTextInputData.find((text) => text.id == selectedTextId);
      if(!currentInputData) return
      setText(currentInputData.content);
      setTextColor(currentInputData.textColor);
      setOutlineColor(currentInputData.outlineColor);
      setOutlineSize(currentInputData.outLineSize);
      setSelectedFont(currentInputData.fontFamily);
      setOutlineColorPopup(false);
      setShowFontSelector(false);
      setRangeValuesSize(currentInputData.size);
      setRangeValuesSpacing(currentInputData.spacing);
      setRangeValuesArc(currentInputData.arc);
      setRangeValuesRotate(currentInputData.rotate);
      // setText(currentInputData.content);
      // setText(currentInputData.content);

    }
    //  else if(selectedBackTextId){
    //   setCurrentTextToolbarId(selectedBackTextId);
    //   console.log("is selected id ",selectedBackTextId);
    //    setShowContent(true);
    //   const currentInputData = allTextBackInputData.find((text) => text.id == selectedBackTextId);
    //   setText(currentInputData.content);
    //   setTextColor(currentInputData.textColor);
    //   setOutlineColor(currentInputData.outlineColor);
    //   setOutlineSize(currentInputData.outLineSize);
    //   setSelectedFont(currentInputData.fontFamily);
    //   setOutlineColorPopup(false);
    //   setShowFontSelector(false);
    //   setRangeValuesSize(currentInputData.size);
    //   setRangeValuesSpacing(currentInputData.spacing);
    //   setRangeValuesArc(currentInputData.arc);
    //   setRangeValuesRotate(currentInputData.rotate);
    //  }

    return () => {
      dispatch(setSelectedTextState(null));
      //  dispatch(setSelectedBackTextState(null));
    }
  }, [dispatch, selectedTextId])
  //  [dispatch,selectedTextId, selectedBackTextId ])


  const handleRangeInputSizeChange = (e) => {
    const { value } = e.target;
    setRangeValuesSize(value);
    globalDispatch("size", parseInt(value));
  };

  const handleRangeInputArcChange = (e) => {
    const { value } = e.target;
    setRangeValuesArc(value);
    globalDispatch("arc", parseInt(value));
  };

  const handleRangeInputRotateChange = (e) => {
    const { value } = e.target;
    setRangeValuesRotate(value);
    globalDispatch("rotate", parseInt(value));
  };

  const handleRangeInputSpacingChange = (e) => {
    const { value } = e.target;
    setRangeValuesSpacing(value);
    globalDispatch("spacing", parseInt(value));
  };


  const globalDispatch = (lable, value) => {
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { [lable]: value }
    }));
  }

  const handleShowContent = (e) => {
    const { value } = e.target;

    setShowContent(value.length > 0);
    setText(value);
    console.log("textContaintObject", textContaintObject);
    if (textContaintObject) {
      // Text exists: update it
      dispatch(updateTextState({
        id: String(currentTextToolbarId),
        changes: { content: value }
      }));
    }
    // else if(textBackContaintObject){
    //   dispatch(updateTextState({
    //     id: String(currentTextToolbarId),
    //     changes: { content: value }
    //   }));
    // }

    else {
      // Text doesn't exist: add new
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
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { "textColor": color }
    }));  // Update text color in Redux store
  }

  const textOutLineColorChangedFunctionCalled = (outlinecolor) => {


    setOutlineColor(outlinecolor);
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { "outLineColor": outlinecolor }
    })); // Update text color in Redux store
  }

  const textOutLineRangeChangedFunctionCalled = (outlinesize) => {
    setOutlineSize(outlinesize);
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { "outLineSize": outlinesize }
    }));  // Update text color in Redux store
  }


  const callForXFlip = () => {
    const value = !(textContaintObject.flipX);
    setflipXValue(value);
    globalDispatch("flipX", value);
    console.log("clicked", value);
  }


  const colorClassName = flipXValue !== true ? 'toolbar-box-icons-container-flip1' : 'toolbar-box-icons-container-clickStyle-flip1';
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;


  //for FLipY


  const callForYFlip = () => {
    const value = !(textContaintObject.flipY);
    setflipYValue(value);
    console.log("y value ", value);
    globalDispatch("flipY", value);
  }

  useEffect(() => {
    console.log(currentTextToolbarId, "id =>");
  }, [flipXValue, flipYValue])

  const colorClassNameForY = flipYValue !== true ? 'toolbar-box-icons-container-flip2' : 'toolbar-box-icons-container-clickStyle-flip2';
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  const handleDuplcateTextInput = () =>{

    dispatch(duplicateTextState(currentTextToolbarId));

  }

  return (
    <div className="toolbar-main-container">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Text Editor</h5>
        <h3>Add new Text</h3>
        <p>You can select multiple products and colors</p>
      </div>

      <div className="toolbar-box">
        {!showFontSelector ? (
          <>
            <textarea
              placeholder="Begin Typing...."
              onChange={handleShowContent}
              value={text || ''}
            />

            {showContent && (
              <>
                <div className='addText-first-toolbar-box-container'>
                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container' onClick={() => globalDispatch("position", { x: 320, y: textContaintObject.position.y })}><span><AlignCenterIcon /></span></div>
                    <div className='toolbar-box-heading-container'>Center</div>
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container-for-together'>
                      <div className='toolbar-box-icons-container-layering1' onClick={() => globalDispatch("layerIndex",1000)}><span><LayeringFirstIcon /></span></div>
                      <div className='toolbar-box-icons-container-layering2' onClick={() => globalDispatch("layerIndex",0)}><span><LayeringSecondIcon /></span></div>
                    </div>
                    Layering
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container-for-together'>
                      <div className={colorClassName} onClick={() => callForXFlip()}><span>{icon}</span></div>
                      <div className={colorClassNameForY} onClick={() => callForYFlip()}><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div className='toolbar-box-icons-and-heading-container' onClick={() => dispatch(toggleLockState(currentTextToolbarId))}>
                    <div className='toolbar-box-icons-container'><span><LockIcon /></span></div>
                    <div className='toolbar-box-heading-container'>Lock</div>
                  </div>

                  <div className='toolbar-box-icons-and-heading-container' onClick={() => handleDuplcateTextInput()}>
                    <div className='toolbar-box-icons-container' ><span><DuplicateIcon /></span></div>
                    <div className='toolbar-box-heading-container'>Duplicate</div>
                  </div>
                </div>

                <hr />

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
                    {outlineColor ? outlineColor : 'None'}
                    <span > <SpanColorBox color={outlineColor} /></span>
                    <span><AngleActionIcon /></span>
                    {outlineColorPopup && (
                      <ChooseColorBox
                        addColorPopupHAndler={toggleOutlineColorPopup}
                        title="Outline Color"
                        defaultColor={outlineColor}
                        onColorChange={textOutLineColorChangedFunctionCalled} // Update outline color
                        onRangeChange={textOutLineRangeChangedFunctionCalled} // Update outline size
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
                      id="min"
                      name="min"
                      min="0"
                      max="100"
                      value={rangeValuesSize}
                      onChange={(e) => handleRangeInputSizeChange(e)}
                    />

                    <span><SpanValueBox valueShow={rangeValuesSize} /></span>
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
                      min="0"
                      max="360"
                      value={rangeValuesArc}
                      onChange={(e) => handleRangeInputArcChange(e)}
                    />

                    <span><SpanValueBox valueShow={rangeValuesArc} /></span>
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
                      value={rangeValuesRotate}
                      onChange={(e) => handleRangeInputRotateChange(e)}
                    />

                    <span><SpanValueBox valueShow={rangeValuesRotate} /></span>
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
                      max="100"
                      value={rangeValuesSpacing}
                      onChange={(e) => handleRangeInputSpacingChange(e)}

                    />
                    <span><SpanValueBox valueShow={rangeValuesSpacing} /></span>

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
