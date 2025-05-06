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
import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
import { addTextState, setSelectedTextState, updateTextState } from '../../..//redux/FrontendDesign/TextFrontendDesignSlice.js';

const AddTextToolbar = () => {
  const dispatch = useDispatch();
  const [currentTextToolbarId, setCurrentTextToolbarId] = useState(String(Date.now()));  // current id of toolbar
  const allTextInputData =  useSelector((state) => state.TextFrontendDesignSlice.texts);
  const textContaintObject = allTextInputData.find((text) => text.id == currentTextToolbarId);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.selectedTextId);

  // const [SizeRangeValue, setRangeValue] = useState([20, 80]);




  // console.log("text", text)
  const [text,setText] = useState(textContaintObject?textContaintObject.content:"")
  const [textColorPopup, setTextColorPopup] = useState(false);
  const [outlineColorPopup, setOutlineColorPopup] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState(textContaintObject?textContaintObject.fontFamily:"");
  const [textColor, setTextColor] = useState(textContaintObject?textContaintObject.textColor:"");
  const [outlineColor, setOutlineColor] = useState(textContaintObject?textContaintObject.outlineColor:"");
  const [outlineSize, setOutlineSize] = useState(textContaintObject?textContaintObject.outlineSize:"");
  const rangeValues = useSelector(state => state.canvas);


  useEffect(() => {
     if(selectedTextId){
      setCurrentTextToolbarId(selectedTextId);
      console.log("is selected id ",selectedTextId);
       setShowContent(true);
      const currentInputData = allTextInputData.find((text) => text.id == selectedTextId);
      setText(currentInputData.content);
      setTextColor(currentInputData.textColor);
      setOutlineColor(currentInputData.outlineColor);
      setOutlineSize(currentInputData.outLineSize);
      

      // setText(currentInputData.content);
      // setText(currentInputData.content);

     }
    return () => {
       dispatch(setSelectedTextState(null));
    }
  }, [dispatch,selectedTextId ])
  

  const handleRangeInputChange = (e, key) => {
    const { value } = e.target;

    dispatch(setRangeState({
      key,
      value: parseInt(value)
    }));
    globalDispatch(key,parseInt(value));
  };


  const globalDispatch = (lable,value)=>{
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { [lable] : value }
    }));
  }

  const handleShowContent = (e) => {
    const { value } = e.target;
    console.log("valueeeeeeeeeeeeeee", value);
    setShowContent(value.length > 0);
    setText(value);
    console.log("textContaintObject", textContaintObject);
    if (textContaintObject) {
      // Text exists: update it
      dispatch(updateTextState({
        id: String(currentTextToolbarId),
        changes: { content: value }
      }));
    } else {
      // Text doesn't exist: add new
      dispatch(addTextState({
        value: value,
        id: String(currentTextToolbarId)
      }));
    }
  };


  const handleFontSelect = (fontFamilyName, fontFamily) => {
    setSelectedFont(fontFamilyName);
    // Update font in Redux store
    setShowFontSelector(false);
    globalDispatch("fontFamily",selectedFont);
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
      changes: { textColor: color }
    }));  // Update text color in Redux store
  }

  const textOutLineColorChangedFunctionCalled = (color) => {
    setOutlineColor(color);
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { outlineColor: outlineColor }
    })); // Update text color in Redux store
  }

  const textOutLineRangeChangedFunctionCalled = (size) => {
    setOutlineSize(size);
    dispatch(updateTextState({
      id: String(currentTextToolbarId),
      changes: { outLineSize: outlineSize }
    }));  // Update text color in Redux store
  }

  const [flipXValue, setflipXValue] = useState(-1);
  const callForXFlip = useCallback(() => {

    setflipXValue((prevDirection) => prevDirection * -1);
    globalDispatch("flipX",flipXValue);// Toggle between -1 and 1
  }, [dispatch, flipXValue, setFlipXState]);


  const colorClassName = flipXValue === -1 ? 'toolbar-box-icons-container-flip1' : 'toolbar-box-icons-container-clickStyle-flip1';
  const icon = flipXValue === -1 ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;


  //for FLipY

  const [flipYValue, setflipYValue] = useState(-1);
  const callForYFlip = useCallback(() => {

    setflipYValue((prevDirection) => prevDirection * -1);
    globalDispatch("flipY",flipYValue);
  }, [dispatch, flipYValue, setFlipYState]);

  useEffect(() => {

    console.log(currentTextToolbarId, "id =>");
  }, [])

  const colorClassNameForY = flipYValue === -1 ? 'toolbar-box-icons-container-flip2' : 'toolbar-box-icons-container-clickStyle-flip2';
  const iconY = flipYValue === -1 ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;


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
                    <div className='toolbar-box-icons-container' onClick={() => globalDispatch("center","center")}><span><AlignCenterIcon /></span></div>
                    <div className='toolbar-box-heading-container'>Center</div>
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container-for-together'>
                      <div className='toolbar-box-icons-container-layering1'><span><LayeringFirstIcon /></span></div>
                      <div className='toolbar-box-icons-container-layering2'><span><LayeringSecondIcon /></span></div>
                    </div>
                    Layering
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container-for-together'>
                      <div className={colorClassName} onClick={callForXFlip}><span>{icon}</span></div>
                      <div className={colorClassNameForY} onClick={callForYFlip}><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div className='toolbar-box-icons-and-heading-container' onClick={() => globalDispatch("locked",false)}>
                    <div className='toolbar-box-icons-container'><span><LockIcon /></span></div>
                    <div className='toolbar-box-heading-container'>Lock</div>
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container'><span><DuplicateIcon /></span></div>
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
                      value={rangeValues.size}
                      onChange={(e) => handleRangeInputChange(e, 'size')}
                    />

                    <span><SpanValueBox valueShow={rangeValues.size} /></span>
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
                      value={rangeValues.arc}
                      onChange={(e) => handleRangeInputChange(e, 'arc')}
                    />

                    <span><SpanValueBox valueShow={rangeValues.arc} /></span>
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
                      value={rangeValues.rotate}
                      onChange={(e) => handleRangeInputChange(e, 'rotate')}
                    />

                    <span><SpanValueBox valueShow={rangeValues.rotate} /></span>
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
                      value={rangeValues.spacing}
                      onChange={(e) => handleRangeInputChange(e, 'spacing')}

                    />
                    <span><SpanValueBox valueShow={rangeValues.spacing} /></span>

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
