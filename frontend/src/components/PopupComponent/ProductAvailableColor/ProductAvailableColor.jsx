import React, { useEffect, useRef } from 'react';
import { getHexFromName } from '../../utils/colorUtils';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import style from './ProductAvailableColor.module.css'

const ProductAvailableColor = ({
  product,
  onClose,
  onAddColor,
  availableColors,
  onHoverColor,
  onLeaveColor,
  actionType
}) => {
  const colorsToShow = availableColors || product.colors || [];
  const popupRef = useRef(null);
  console.log("actionType", actionType)
  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose(); // Call the close function
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="color-popup-overlay"> {/* Add a dimmed background if needed */}
      <div className={style.colorPopupContainerSpanBox} ref={popupRef} style={{
        ...(actionType === 'change' ? { left: '0' } : { right: '0' })
      }}>
        <span onClick={onClose} className={style.crossProdIConn}>
          <CrossIcon />
        </span>
        <p>Select a Color for {product.name || product.title}</p>
        {colorsToShow.length > 0 ? (
          <div className={style.colorOptionsGrid}>
            {colorsToShow.map((color, idx) => (
              <div
                key={idx}
                className={style.colorOptionCard}
                onClick={() => onAddColor(product, color)}
                onMouseEnter={() => onHoverColor && onHoverColor(color)}
                onMouseLeave={() => onLeaveColor && onLeaveColor()}
              >
                <span
                  className="color-swatch"
                  style={{
                    backgroundColor: getHexFromName(color.name),
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    border: '1px solid #888',
                    marginBottom: '8px',
                  }}
                />
                <p style={{ textAlign: 'center', fontSize: '10px' }}>{color.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '20px',
            color: 'red',
            fontSize: '1rem'
          }}>
            No colors available
          </p>
        )}
      </div>
    </div >
  );
};

export default ProductAvailableColor;
