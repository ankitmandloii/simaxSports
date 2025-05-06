import React, { useCallback, useState } from 'react';
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
import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState,  setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';

const AddTextToolbar = () => {
  const dispatch = useDispatch();
  const text = useSelector((state) => state.canvas.text);

  // const [SizeRangeValue, setRangeValue] = useState([20, 80]);
  const [textColorPopup, setTextColorPopup] = useState(false);
  const [outlineColorPopup, setOutlineColorPopup] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Interstate');

  const [textColor, setTextColor] = useState("#FFFFFF");

  const [outlineColor, setOutlineColor] = useState('#FFFFFF');
  const [outlineSize, setOutlineSize] = useState(0);



  const rangeValues = useSelector(state => state.canvas);



  const handleRangeInputChange = (e, key) => {
    const { value } = e.target;


    dispatch(setRangeState({
      key,
      value: parseInt(value)
    }));


  };

  const handleShowContent = (e) => {
    const { name, value } = e.target;
    if (value.length > 0) {
      setShowContent(true);
      dispatch(setText(e.target.value));
    } else {
      setShowContent(false);
      dispatch(setText(e.target.value));
    }
  }



  const handleFontSelect = (fontFamilyName, fontFamily) => {
    setSelectedFont(fontFamilyName);
  // Update font in Redux store
    setShowFontSelector(false);
    dispatch(setFontFamilyState(fontFamily)); 
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
    dispatch(setTextColorState(color)); // Update text color in Redux store
  }

  const textOutLineColorChangedFunctionCalled = (color) => {
    setOutlineColor(color);
    dispatch(setOutLineColorState(color)); // Update text color in Redux store
  }

  const textOutLineRangeChangedFunctionCalled = (size) => {
    setOutlineSize(size);
    dispatch(setOutLineSizeState(size)); // Update text color in Redux store
  }

  const [flipXValue, setflipXValue] = useState(-1);
  const callForXFlip = useCallback(() => {
   
    setflipXValue((prevDirection) => prevDirection * -1); 
    dispatch(setFlipXState(flipXValue));// Toggle between -1 and 1
  }, [dispatch, flipXValue, setFlipXState]);

  const colorClassName = flipXValue === -1 ? 'toolbar-box-icons-container-flip1' : 'toolbar-box-icons-container-clickStyle-flip1';
  const icon =    flipXValue === -1  ?   <FlipFirstIcon/> : <FlipFirstWhiteColorIcon />  ;


  //for FLipY

  const [flipYValue, setflipYValue] = useState(-1);
  const callForYFlip = useCallback(() => {
    
    setflipYValue((prevDirection) => prevDirection * -1); 
    dispatch(setFlipYState(flipYValue)); 
  }, [dispatch, flipYValue, setFlipYState]);
  

  const colorClassNameForY = flipYValue === -1 ? 'toolbar-box-icons-container-flip2' : 'toolbar-box-icons-container-clickStyle-flip2';
  const iconY =    flipYValue === -1  ?   <FlipSecondIcon/> : <FlipSecondWhiteColorIcon />  ;


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
            <textarea placeholder='Begin Typing....' value={text} onChange={handleShowContent}></textarea>
            {showContent && (
              <>
                <div className='addText-first-toolbar-box-container'>
                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container' onClick={()=>dispatch(setCenterState("center"))}><span><AlignCenterIcon /></span></div>
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
                      <div className={colorClassName}   onClick={callForXFlip}><span>{icon}</span></div>
                      <div className={colorClassNameForY} onClick={callForYFlip}><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div className='toolbar-box-icons-and-heading-container'>
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
