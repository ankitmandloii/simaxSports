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

  useEffect(() => {
    const calculatePosition = () => {
      if (triggerRef?.current && popupRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popupWidth = popupRef.current.offsetWidth;
        const popupHeight = popupRef.current.offsetHeight;

        let newLeft = triggerRect.right + 10;  // Default to right of trigger
        let newTop = triggerRect.top - (popupHeight / 2) + (triggerRect.height / 2);  // Vertically aligned with trigger

        // Mobile/Tablet adjustment (small screens)
        const isMobileOrTablet = window.innerWidth <= 768;

        if (isMobileOrTablet) {
          newTop = triggerRect.bottom + 10;  // Below the trigger
          newLeft = triggerRect.left;       // Align left of the trigger
          const availableHeight = window.innerHeight - newTop;
          const availableWidth = window.innerWidth - newLeft;

          // Adjust if modal overflows vertically
          if (popupHeight > availableHeight) {
            newTop = triggerRect.top - popupHeight - 10; // Try above
            if (newTop < 10) {
              newTop = 10; // Ensure it doesn't go off-screen at the top
              if (popupHeight > window.innerHeight - 20) {
                newTop = 10; // If still too tall, align to top with scroll
              }
            }
          }

          // Adjust if modal overflows horizontally
          if (popupWidth > availableWidth) {
            newLeft = 10; // Align to left edge if too wide
            if (popupWidth > window.innerWidth - 20) {
              newLeft = 10; // If still too wide, align to left with scroll
            }
          }
        } else {
          // Check if the popup overflows the right side of the screen
          if (newLeft + popupWidth > window.innerWidth) {
            newLeft = window.innerWidth - popupWidth; // Reposition near the right edge
            if (newLeft < 10) newLeft = 10; // Ensure it doesn't go off-screen at the left
          }

          // Check if the popup overflows the bottom side of the screen
          if (newTop + popupHeight > window.innerHeight) {
            newTop = window.innerHeight - popupHeight;  // Reposition near the bottom
            if (newTop < 10) newTop = 10; // Ensure it doesn't go off-screen at the top
          }
        }

        // Set the new position
        setPosition({
          left: `${newLeft}px`,
          top: `${newTop}px`,
        });
      }
    };

    // Initial calculation
    calculatePosition();

    // Recalculate on window resize to handle layout changes
    window.addEventListener('resize', calculatePosition);

    // Cleanup resize event listener on component unmount
    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  }, [triggerRef]);

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