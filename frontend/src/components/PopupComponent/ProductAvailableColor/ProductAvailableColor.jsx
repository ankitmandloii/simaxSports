import React, { useEffect, useRef } from 'react';
import './ProductAvailableColor.css';
import { getHexFromName } from '../../utils/colorUtils';
import { CrossIcon } from '../../iconsSvg/CustomIcon';

const ProductAvailableColor = ({
  product,
  onClose,
  onAddColor,
  availableColors,
  onHoverColor,
  onLeaveColor
}) => {
  const colorsToShow = availableColors || product.colors || [];
  const popupRef = useRef(null);

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
      <div className="color-popup-container-span_box" ref={popupRef}>
        <span onClick={onClose} className='crossProdIConn'>
          <CrossIcon />
        </span>
        <p>Select a Color for {product.name || product.title}</p>
        {colorsToShow.length > 0 ? (
          <div className="color-options-grid">
            {colorsToShow.map((color, idx) => (
              <div
                key={idx}
                className="color-option-card"
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
    </div>
  );
};

export default ProductAvailableColor;
