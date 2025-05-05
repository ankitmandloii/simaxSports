import React, { useState } from 'react';
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
  NoneIcon
} from '../../iconsSvg/CustomIcon';
import MyCompo from '../../style/MyCompo';
import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox';
import { useDispatch, useSelector } from 'react-redux';
import { setText } from '../../../redux/canvasSlice/CanvasSlice.js';

const AddTextToolbar = () => {
  const dispatch = useDispatch();
  const text = useSelector((state) => state.canvas.text);

  const [rangeValue, setRangeValue] = useState([20, 80]);
  const [textColorPopup, setTextColorPopup] = useState(false);
  const [outlineColorPopup, setOutlineColorPopup] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Interstate');

  const [textColor, setTextColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#FF0000');
  const [outlineSize, setOutlineSize] = useState(20);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newRangeValue = [...rangeValue];

    if (name === 'min') {
      newRangeValue[0] = parseInt(value);
    } else if (name === 'max') {
      newRangeValue[1] = parseInt(value);
    }

    setRangeValue(newRangeValue);
  };

  const handleShowContent = (e) => {
    const { name, value } = e.target;
    if(value.length > 0) {
      setShowContent(true);
      dispatch(setText(e.target.value));
    }else{
      setShowContent(false);
      dispatch(setText(e.target.value));
    }
  }



  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setShowFontSelector(false);
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
           <textarea  placeholder='Begain Typing....' value={text} onChange={handleShowContent}></textarea>
            {showContent && (
              <>
                <div className='addText-first-toolbar-box-container'>
                  <div className='toolbar-box-icons-and-heading-container'>
                    <div className='toolbar-box-icons-container'><span><AlignCenterIcon /></span></div>
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
                      <div className='toolbar-box-icons-container-flip1'><span><FlipFirstIcon /></span></div>
                      <div className='toolbar-box-icons-container-flip2'><span><FlipSecondIcon /></span></div>
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
                        onColorChange={(color) => setTextColor(color)}  // Update text color
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
                    <span className='none-svg-icon'><NoneIcon /></span>
                    <span><AngleActionIcon /></span>
                    {outlineColorPopup && (
                      <ChooseColorBox
                        addColorPopupHAndler={toggleOutlineColorPopup}
                        title="Outline Color"
                        defaultColor={outlineColor}
                        onColorChange={(color) => setOutlineColor(color)} // Update outline color
                        onRangeChange={(range) => setOutlineSize(range[0])} // Update outline size
                        button={true}
                        range={true}
                      />
                    )}
                  </div>
                </div>

                <hr />

                {['Size', 'Arc', 'Rotate', 'Spacing'].map((label) => (
                  <div className='toolbar-box-Font-Value-set-inner-container' key={label}>
                    <div className='toolbar-box-Font-Value-set-inner-actionheading'>{label}</div>
                    <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
                      <input
                        type="range"
                        id="min"
                        name="min"
                        min="0"
                        max="100"
                        value={rangeValue[0]}
                        onChange={handleInputChange}
                      />
                      <span><AngleActionIcon /></span>
                    </div>
                    <hr />
                  </div>
                ))}
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
