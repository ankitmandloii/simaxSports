import { useEffect, useRef, useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import style from './ChooseColorBox.module.css'
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


  const [localOutlineSize, setLocalOutlineSize] = useState(outlineSize?.toString() || "0");

  useEffect(() => {
    setLocalOutlineSize(outlineSize?.toString() || "0");
  }, [outlineSize]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    setLocalOutlineSize(rawValue); // string for flexibility

    const parsed = parseFloat(rawValue);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onRangeChange(parsed); // Call parent handler only if valid
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(localOutlineSize);
    if (isNaN(parsed) || parsed < 0 || parsed > 10) {
      setLocalOutlineSize("5");
      onRangeChange(5);
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    onColorChange(newColor.hex);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!boxRef.current || boxRef.current.contains(event.target)) return;
      (addColorPopupHAndler || chngColorPopupHandler || showColorPopupHandler)?.();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [addColorPopupHAndler, chngColorPopupHandler, showColorPopupHandler]);

  return (
    <div className={style.chooseColorBox} ref={boxRef} onClick={e => e.stopPropagation()}>
      <div className={style.colorBoxTop}>
        <h6>{title}</h6>
        <span onClick={addColorPopupHAndler || chngColorPopupHandler || showColorPopupHandler}>
          <RxCross1 />
        </span>
      </div>

      <div className={style.middleColorPick}>
        <span>Color:</span>
        <SpanColorBox color={color.hex} />
        <span>{color.hex}</span>
      </div>

      <div className={style.reactColorfulWrapper} style={{ margin: '10px 0' }}>
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
        <div className={style.toolbarBoxFontValueSetInnerContainer}>
          <div className={style.toolbarBoxFontValueSetInnerActionHeading}>Size</div>
          <div className={style.toolbarBoxFontValueSetInnerActionLogo}>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={localOutlineSize}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={localOutlineSize}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={style.spanValueBoxInput}
          />
        </div>
      )}
    </div>
  );
};

export default ChooseColorBox;
