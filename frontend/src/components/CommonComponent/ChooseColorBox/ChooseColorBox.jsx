import React, { useState } from 'react';
import './ChooseColorBox.css';
import { RxCross1 } from "react-icons/rx";
import SpanColorBox from '../SpanColorBox/SpanColorBox';

const ChooseColorBox = ({
  addColorPopupHAndler,
  title = "Choose Color",
  button = false,
  range = false,
  defaultColor = '#FF0000',
  onColorChange = () => {},
  onRangeChange = () => {},
}) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [rangeValue, setRangeValue] = useState(10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    

   

    setRangeValue(parseInt(value));
    onRangeChange(parseInt(value)); // Notify parent
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorChange(color); // Notify parent
  };

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

  return (
    <div className="choose-color-box">
      <div className="color-box-top">
        <h6>{title}</h6>
        <span style={{ cursor: "pointer" }} onClick={addColorPopupHAndler}><RxCross1 /></span>
      </div>

      <div className="middle-color-pick">
        <span>Color:</span>
        <SpanColorBox color={selectedColor} />
        <span>{selectedColor}</span>
      </div>

      <div className="small-color-box">
        {colors.map((color, index) => (
          <SpanColorBox
            key={index}
            color={color}
            onClick={() => handleColorSelect(color)}
          />
        ))}
      </div>


      {range && (
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
              max="10"
              value={rangeValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
      {button && <button className="black-button select-color-btn">Select Color</button>}

    </div>
  );
};

export default ChooseColorBox;
