import { useEffect, useRef } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

import './ChooseColorBox.css';
import { RxCross1 } from "react-icons/rx";
import SpanColorBox from "../SpanColorBox/SpanColorBox";

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
  const boxRef = useRef(null);
  const [color, setColor] = useColor("hex", defaultColor);

  const handleInputChange = (e) => {
    onRangeChange(parseInt(e.target.value));
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onColorChange(newColor.hex);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If no ref or click is inside the box, do nothing
      if (!boxRef.current || boxRef.current.contains(event.target)) {
        return;
      }
      // Click is outside — call close handler
      (addColorPopupHAndler || chngColorPopupHandler || showColorPopupHandler)?.();
    };

    // Use mousedown for faster response (before focus changes)
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addColorPopupHAndler, chngColorPopupHandler, showColorPopupHandler]);

  return (
    <div
      className="choose-color-box"
      ref={boxRef}
      // Prevent clicks inside from bubbling up if you have parent handlers
      onClick={e => e.stopPropagation()}
    >
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
          dark
        />
      </div>

      {range && (
        <div className='toolbar-box-Font-Value-set-inner-container'>
          <div className='toolbar-box-Font-Value-set-inner-actionheading'>Size</div>
          <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
            <input
              type="range"
              min="0"
              max="10"
              value={outlineSize}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="number"
            min="0"
            max="10"
            value={outlineSize}
            onChange={handleInputChange}
            className="SpanValueBox-input"
          />
        </div>
      )}
    </div>
  );
};

export default ChooseColorBox;