import React from 'react';
import './SleeveDesignPopup.css'; // We'll create this CSS file next

// Import your image assets here. Replace with actual paths to your images.
// For demonstration, I'm using placeholder names.
import printSampleDark from '../../images/sleeveImagePopup.png'
import printSampleGrey from '../../images/sleeveImagePopup2.png';
import printSampleGreen from '../../images/sleeveImagePopup3.png';
import printSampleLight from '../../images/sleeveImagePopup4.png';


const SleeveDesignPopup = ({ onClose, onAddDesign }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>MORE PRINT AREAS</h2>
          <button className="close-button" onClick={onClose}>
            &times; {/* This is an 'x' character for the close button */}
          </button>
        </div>

        <div className="image-grid">
          <div className="image-item">
            <img src={printSampleDark} alt="Print Sample Dark Tee" />
          </div>
          <div className="image-item">
            <img src={printSampleGrey} alt="Print Sample Grey Tee" />
          </div>
          <div className="image-item">
            <img src={printSampleGreen} alt="Print Sample Green Hoodie" />
          </div>
          <div className="image-item">
            <img src={printSampleLight} alt="Print Sample Light Tee" />
          </div>
        </div>

        <p className="description">
          Enhance your product's appeal with a custom sleeve design
        </p>

        <button className="add-design-button" onClick={onAddDesign}>
          Add Sleeve Design
        </button>

        <button className="no-thanks-button" onClick={onClose}>
          No thanks, take me back to the Design Studio
        </button>
      </div>
    </div>
  );
};

export default SleeveDesignPopup;