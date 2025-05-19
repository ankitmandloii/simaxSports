import React from 'react';
import './ProductAvailableColor.css';

const ProductAvailableColor = ({ product, onClose, onAddColor, availableColors }) => {
  const colorsToShow = availableColors || product.colors || [];

  return (
    <div className="color-popup-container-span_box">
      <p>Select a Color for {product.name || product.title}</p>
      {colorsToShow.length > 0 ? (
        <div className="color-options-grid">
          {colorsToShow.map((color, idx) => (
            <div
              key={idx}
              className="color-option-card"
              onClick={() => onAddColor(product, color)}
            >
              {/* <img src={color.img} alt={color.name} /> */}
              <p>{color.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '20px', color: 'red', fontSize: '1rem' }}>
          No colors available
        </p>
      )}
      <button className="cancel-color-btn" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ProductAvailableColor;
