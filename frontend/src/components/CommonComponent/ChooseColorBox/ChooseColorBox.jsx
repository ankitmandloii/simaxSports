// import React, { useState } from 'react';
// import './ChooseColorBox.css';
// import { RxCross1 } from "react-icons/rx";
// import SpanColorBox from '../SpanColorBox/SpanColorBox';
// import SpanValueBox from '../SpanValueBox/SpanValueBox';

// const ChooseColorBox = ({
//   showColorPopupHandler,
//   chngColorPopupHandler,
//   addColorPopupHAndler,
//   title = "Choose Color",
//   button = false,
//   range = false,
//   defaultColor = '#FF0000',
//   onColorChange = () => {},
//   onRangeChange = () => {},
//   outlineSize
// }) => {
//   const [selectedColor, setSelectedColor] = useState(defaultColor);
//   const [hoveredColor, setHoveredColor] = useState(null);
//   // const [rangeValue, setRangeValue] = useState(10);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    

   

//     // setRangeValue(parseInt(value));
//     onRangeChange(parseInt(value)); // Notify parent
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     onColorChange(color); // Notify parent
//     // showColorPopupHandler();
//   };

//   const colors = [
//     '#FFFFFF', '#C0C0C0', '#808080', '#800000', '#FF0000', '#800080', '#008080', '#000080',
//     '#FF6600', '#FF9900', '#993300', '#FF9999', '#CC3366', '#CC66FF', '#9999FF', '#3366FF',
//     '#0000FF', '#003366', '#339966', '#00FF00', '#66CC00', '#999900', '#FFFF00', '#FFCC00',
//     '#FFCC99', '#CC9966', '#996633', '#660000', '#CC0000', '#9900CC', '#6633CC', '#3366CC',
//     '#3399FF', '#66FFFF', '#66FF66', '#CCFF66', '#FFFF66', '#FF9966', '#FF6633', '#FF3300',
//     '#993366', '#FF66CC', '#FF99FF', '#FFCCCC', '#CC9999', '#996666', '#999966', '#CCCC99'
//   ];
  
//   return (
//     <div className="choose-color-box">
//       <div className="color-box-top">
//         <h6>{title}</h6>
//         <span  onClick={addColorPopupHAndler || chngColorPopupHandler || showColorPopupHandler}><RxCross1 /></span>
//       </div>

//       <div className="middle-color-pick">
//         <span>Color:</span>
//         <SpanColorBox color={hoveredColor || selectedColor} />
//         <span>{hoveredColor || selectedColor}</span>
//       </div>

//       <div className="small-color-box">
//         {colors.map((color, index) => (
//           <SpanColorBox
//             key={index}
//             color={color}
//             onClick={() => handleColorSelect(color)}
//             onMouseEnter={() => setHoveredColor(color)}
//             onMouseLeave={() => setHoveredColor(null)}
//           />
//         ))}
//       </div>


//       {range && (
//         <div className='toolbar-box-Font-Value-set-inner-container'>
//           <div className='toolbar-box-Font-Value-set-inner-actionheading'>
//             Size
//           </div>
//           <div className='toolbar-box-Font-Value-set-inner-actionlogo'>
//             <input
//               type="range"
//               id="min"
//               name="min"
//               min="0"
//               max="10"
//               value={outlineSize}
//               onChange={handleInputChange}
//             />
//           </div>
//           <span><SpanValueBox valueShow={outlineSize} /></span>
//         </div>
//       )}
//       {button && <button className="black-button select-color-btn">Select Color</button>}

//     </div>
//   );
// };

// export default ChooseColorBox;
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
  onColorChange = () => {},
  onRangeChange = () => {},
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
          hideInput={["hsv","rgb"]}
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
