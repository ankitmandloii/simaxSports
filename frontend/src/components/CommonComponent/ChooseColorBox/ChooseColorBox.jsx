import React, { useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';


import './ChooseColorBox.css';
import { RxCross1 } from "react-icons/rx";
import SpanColorBox from "../SpanColorBox/SpanColorBox";
import SpanValueBox from "../SpanValueBox/SpanValueBox";

const ChooseColorBox = ({
  showColorPopupHandler,
  chngColorPopupHandler,
  addColorPopupHAndler,
  title = "Choose Color",
  button = false,
  range = false,
  defaultColor = "#FF0000",
  onColorChange = () => { },
  onRangeChange = () => { },
  outlineSize,
}) => {
  const [color, setColor] = useColor("hex", defaultColor);

  const handleInputChange = (e) => {
    onRangeChange(parseInt(e.target.value));
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onColorChange(newColor.hex);
  };

  return (
    <div className="choose-color-box" onClick={(e) => e.stopPropagation()}>
      <div className="color-box-top">
        <h6>{title}</h6>
        <span onClick={addColorPopupHAndler || chngColorPopupHandler || showColorPopupHandler}>
          <RxCross1 />
        </span>
      </div>

      <div className="middle-color-pick">
        <span>Color:</span>
        <SpanColorBox color={color.hex} />
        <span>{color.hex}</span>
      </div>

      <div className="react-colorful-wrapper" style={{ margin: '10px 0' }}>
        <ColorPicker
          width={200}
          height={100}
          color={color}
          onChange={handleColorChange}
          hideInput={["hsv", "rgb"]}
          // hideHSV
          dark
        // hideRGB
        />
      </div>

      {range && (
        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>Size</div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              id="min"
              name="min"
              min="0"
              max="10"
              value={outlineSize}
              onChange={handleInputChange}
            />
          </div>
          <span>
            <SpanValueBox valueShow={outlineSize} />
          </span>
        </div>
      )}

      {/* {button && <button className="black-button select-color-btn">Select Color</button>} */}
    </div>
  );
};

export default ChooseColorBox;