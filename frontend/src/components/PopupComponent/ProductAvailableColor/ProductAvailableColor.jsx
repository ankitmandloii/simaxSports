// // // ---
// // import React, { useEffect, useRef } from 'react';
// // import { getHexFromName } from '../../utils/colorUtils';
// // import { CrossIcon } from '../../iconsSvg/CustomIcon';
// // import style from './ProductAvailableColor.module.css'

// // const ProductAvailableColor = ({
// //   product,
// //   onClose,
// //   onAddColor,
// //   availableColors,
// //   onHoverColor,
// //   onLeaveColor,
// //   actionType
// // }) => {
// //   const colorsToShow = availableColors || product.colors || [];

// //   const popupRef = useRef(null);
// //   console.log("-=-=-=-=-=-=-=actionType", actionType);

// //   // Close popup on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (popupRef.current && !popupRef.current.contains(event.target)) {
// //         onClose(); // Call the close function
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);

// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [onClose]);

// //   return (
// //     <div className="color-popup-overlay">
// //       <div className={style.colorPopupContainerSpanBox} ref={popupRef} style={{
// //         ...(actionType === 'change' ? { left: '-15%' } : { right: '0' })
// //       }}>
// //         <span onClick={onClose} className={style.crossProdIConn}>
// //           <CrossIcon />
// //         </span>
// //         {actionType == 'change' ? <p>Change  color</p> : <p>Add color</p>}
// //         {colorsToShow.length > 0 ? (
// //           <div className={style.colorOptionsGrid}>
// //             {colorsToShow.map((color, idx) => (
// //               <div
// //                 key={idx}
// //                 className={style.colorOptionCard}
// //                 onClick={() => onAddColor(product, color)}
// //                 onMouseEnter={() => onHoverColor && onHoverColor(color)}
// //                 onMouseLeave={() => onLeaveColor && onLeaveColor()}
// //               >
// //                 <img
// //                   src={color.swatchImg || color.img}
// //                   alt={color.name}
// //                   title={color.name}
// //                   className="color-swatch"
// //                   style={{
// //                     width: '33px',
// //                     height: '30px',
// //                     borderRadius: '20%',
// //                     display: 'inline-block',
// //                     border: '1px solid #888',
// //                     marginBottom: '8px',
// //                     objectFit: 'cover',
// //                     cursor: 'pointer'
// //                   }}
// //                 />
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p style={{
// //             textAlign: 'center',
// //             marginTop: '20px',
// //             color: 'grey',
// //             fontSize: '1rem'
// //           }}>
// //             No colors available
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductAvailableColor;

// import React, { useEffect, useRef, useState } from 'react';
// // Assuming this utility converts color names to hex codes for the demonstration
// import { getHexFromName } from '../../utils/colorUtils';
// import { CrossIcon } from '../../iconsSvg/CustomIcon';
// import style from './ProductAvailableColor.module.css';
// import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';

// const ProductAvailableColor = ({
//   product,
//   onClose,
//   onAddColor,
//   availableColors,
//   onHoverColor,
//   onLeaveColor,
//   actionType,
// }) => {
//   const colorsToShow = availableColors || product.colors || [];

//   const popupRef = useRef(null);
//   const [colorData, setColorData] = useState({ name: '', img: '' });


//   // Close popup on outside click (Keep this logic)
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         onClose(); // Call the close function
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onClose]);

//   // Function to get the color hex. Update this to use your actual color data.
//   const getColorHex = (color) => {
//     // **CRITICAL:** If your `color` object has a `hex` or `code` property, use that instead.
//     // E.g., return color.hexCode;
//     return color.name ? getHexFromName(color.name) : '#ccc';
//   };

//   return (
//     <div className="color-popup-overlay">
//       <div
//         className={style.colorPopupContainerSpanBox}
//         ref={popupRef}
//         style={{
//           // Adjusting position logic based on actionType
//           // ...(actionType === 'change' ? { left: '-15%' } : { right: '0' }),
//         }}
//       >
//         {/* --- Header Section --- */}
//         {/* The title will always be "ADD ANOTHER COLOR" or similar, based on the image's appearance */}
//         {/* Note: I'm keeping your actionType logic but overriding the text to be closer to the image's "ADD ANOTHER COLOR" style, which is often capital, bold, and colored. */}
//         <div className={style.popupHeader}>
//           <p className={style.popupTitle}>
//             {actionType === 'change' ? 'CHANGE COLOR' : 'ADD ANOTHER COLOR'}
//           </p>

//           <div className={style.closeButtonWrapper}>
//             <CloseButton onClose={onClose} />
//           </div>
//         </div>

//         {/* The "Color:" label visible in the image */}
//         <div className={style.currentColorDisplay}>
//           <p className={style.colorLabel}>Color:</p>
//           {colorData.img &&
//             <>
//               <img src={colorData.img ?? colorsToShow[0]?.swatchImg} alt={colorData.name} className={style.colorSwatch} />
//               <span
//                 className={style.colorName}
//                 style={{ color: colorData.hex || '#000' }}
//               >
//                 {colorData.name || 'Select a color'}
//               </span></>
//           }
//         </div>

//         {/* --- Color Grid Section --- */}
//         {colorsToShow.length > 0 ? (
//           <div className={style.colorOptionsGrid}>
//             {colorsToShow.map((color, idx) => (
//               <div
//                 key={idx}
//                 onClick={() => onAddColor(product, color)}
//                 onMouseEnter={() => onHoverColor && onHoverColor(color)}
//                 onMouseLeave={() => onLeaveColor && onLeaveColor()}
//                 title={color.name}
//                 onMouseOver={() => setColorData({ name: color.name, img: color.swatchImg })}
//                 onMouseOut={() => setColorData({ name: '', img: '' })}
//               >

//                 <img
//                   src={color.swatchImg || color.img}
//                   alt={color.name}
//                   title={color.name}
//                   className="color-swatch"
//                   style={{
//                     width: '33px',
//                     height: '30px',
//                     borderRadius: '20%',
//                     display: 'inline-block',
//                     border: '1px solid #888',
//                     marginBottom: '8px',
//                     objectFit: 'cover',
//                     cursor: 'pointer'
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p
//             style={{
//               textAlign: 'center',
//               marginTop: '20px',
//               color: 'grey',
//               fontSize: '1rem',
//             }}
//           >
//             No colors available
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductAvailableColor;

import React, { useEffect, useRef, useState } from 'react';
// Assuming this utility converts color names to hex codes
import { getHexFromName } from '../../utils/colorUtils';
// Assuming CrossIcon and style imports are correct
import style from './ProductAvailableColor.module.css';
import { IoMdArrowDropleft } from "react-icons/io";
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';

// Assuming you have a reusable CloseButton component for your 'X' icon
// If not, you can replace <CloseButton onClose={onClose} /> with the original span/CrossIcon
// import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon'; 

const ProductAvailableColor = ({
  product,
  onClose,
  onAddColor,
  availableColors,
  onHoverColor,
  onLeaveColor,
  actionType,
  triggerRef // <-- The Reference to the element that opened the pop-up
}) => {
  const colorsToShow = availableColors || product.colors || [];

  const popupRef = useRef(null);
  const [colorData, setColorData] = useState({ name: '', img: '' });
  // State to hold the calculated { top, left } position
  const [position, setPosition] = useState({});

  // --- Positioning Logic (The Core Change) ---
  useEffect(() => {
    const calculatePosition = () => {
      if (triggerRef?.current && popupRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        // Using outer dimensions to ensure the pop-up doesn't overlap
        const popupWidth = popupRef.current.offsetWidth;
        const popupHeight = popupRef.current.offsetHeight;

        // Calculate Position: Pop-up should appear to the right of the trigger

        // 1. Determine Horizontal Position (Right of the trigger)
        // We want the pop-up to start near the right edge of the trigger element.
        // Adding 10px for a slight gap
        let newLeft = triggerRect.right + 10;

        // 2. Determine Vertical Position (Align top edge with trigger)
        //center align the top edges
        let newTop = triggerRect.top - (popupHeight / 2) + (triggerRect.height / 2);

        // Optional: Add viewport collision detection (to keep it on screen)
        // If the pop-up overflows the right edge of the viewport, move it left
        if (newLeft + popupWidth > window.innerWidth) {
          // Position it to the left of the trigger instead
          newLeft = triggerRect.left - popupWidth - 10;
        }

        // If the pop-up overflows the bottom edge, move it up
        if (newTop + popupHeight > window.innerHeight) {
          // Align its bottom edge with the trigger's bottom edge
          newTop = triggerRect.bottom - popupHeight;
        }

        setPosition({
          left: `${newLeft}px`,
          top: `${newTop}px`,
        });
      }
    };

    // Run on mount and when triggerRef changes
    calculatePosition();

    // Recalculate position on window resize or scroll
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [triggerRef]); // Dependency ensures recalculation if the trigger changes

  // --- Outside Click Logic (Kept) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // --- Helper Function (Kept) ---
  const getColorHex = (color) => {
    return color.name ? getHexFromName(color.name) : '#ccc';
  };

  return (
    <div className="color-popup-overlay">
      <div
        className={style.colorPopupContainerSpanBox}
        ref={popupRef}
        // Apply the calculated { top, left } position here
        style={{ ...position }}
      >
        <div className={style.arrowLeft}>
          <span></span>
        </div>
        {/* --- Header Section --- */}
        <div className={style.popupHeader}>
          <p className={style.popupTitle}>
            {actionType === 'change' ? 'CHANGE COLOR' : 'ADD ANOTHER COLOR'}
          </p>

          {/* Using the original CrossIcon implementation for compatibility */}
          <CloseButton onClose={onClose} />
        </div>

        {/* The "Color:" label and current color display */}
        <div className={style.currentColorDisplay}>
          <p className={style.colorLabel}>Color:</p>
          {colorData.img &&
            <>
              <img src={colorData.img ?? colorsToShow[0]?.swatchImg} alt={colorData.name} className={style.colorSwatch} />
              <span
                className={style.colorName}
                style={{ color: '#888' }}
              >
                {colorData.name || 'Select a color'}
              </span></>
          }
        </div>

        {/* --- Color Grid Section --- */}
        {colorsToShow.length > 0 ? (
          <div className={style.colorOptionsGrid}>
            {colorsToShow.map((color, idx) => (
              <div
                key={idx}
                className={style.colorOptionCard} // Use the CSS color swatch style
                onClick={() => onAddColor(product, color)}
                onMouseEnter={() => onHoverColor && onHoverColor(color)}
                onMouseLeave={() => onLeaveColor && onLeaveColor()}
                title={color.name}
                // Update state on mouse over for the preview
                onMouseOver={() => setColorData({ name: color.name, img: color.swatchImg, hex: getColorHex(color) })}
                onMouseOut={() => setColorData({ name: '', img: '' })}
              // This ensures compatibility if you are using image swatches
              >
                <img
                  src={color.swatchImg || color.img}
                  alt={color.name}
                  title={color.name}
                  className="colorSwatch" // Use a new class for the image swatches
                 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={style.noColorsMessage}
          >
            No colors available
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductAvailableColor;