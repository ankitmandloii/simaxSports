import { useEffect, useRef, useState } from 'react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { RxCross1 } from "react-icons/rx";
import SpanColorBox from "../SpanColorBox/SpanColorBox";
import style from './ChooseColorBox.module.css'; // reuse same styles

const ReplaceBackgroundColorPicker = ({
  closePopupHandler,
  defaultColor = "#FF0000",
  onApply = () => {},
}) => {
  const boxRef = useRef(null);
  const [color, setColor] = useColor("hex", defaultColor);
  const [tempColor, setTempColor] = useState(defaultColor);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setTempColor(newColor.hex); // don't apply yet
  };

  const handleApply = () => {
    onApply(tempColor);         // only dispatch when Apply is clicked
    closePopupHandler?.();      // close the popup
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!boxRef.current || boxRef.current.contains(event.target)) return;
      closePopupHandler?.();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopupHandler]);

  return (
    <div className={style.chooseColorBox} ref={boxRef} onClick={e => e.stopPropagation()}>
      <div className={style.colorBoxTop}>
        <h6>Replace Background With AI</h6>
        <span onClick={closePopupHandler}><RxCross1 /></span>
      </div>

      <div className={style.middleColorPick}>
        <span>Color:</span>
        <SpanColorBox color={tempColor} />
        <span>{tempColor}</span>
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

      <div className={style.applyButtonWrapper}>
        <button onClick={handleApply} className={style.applyButton}>Apply</button>
      </div>
    </div>
  );
};

export default ReplaceBackgroundColorPicker;
