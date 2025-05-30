import React from 'react';
import styles from './SleeveDesignPopup.module.css';
// Import your image assets here. Replace with actual paths to your images.
// For demonstration, I'm using placeholder names.
import printSampleDark from '../../images/sleeveImagePopup.png'
import printSampleGrey from '../../images/sleeveImagePopup2.png';
import printSampleGreen from '../../images/sleeveImagePopup3.png';
import printSampleLight from '../../images/sleeveImagePopup4.png';


const SleeveDesignPopup = ({ onClose, onAddDesign }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h2>MORE PRINT AREAS</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times; {/* This is an 'x' character for the close button */}
          </button>
        </div>

        <div className={styles.imageGrid}>
          <div className={styles.imageItem}>
            <img src={printSampleDark} alt="Print Sample Dark Tee" />
          </div>
          <div className={styles.imageItem}>
            <img src={printSampleGrey} alt="Print Sample Grey Tee" />
          </div>
          <div className={styles.imageItem}>
            <img src={printSampleGreen} alt="Print Sample Green Hoodie" />
          </div>
          <div className={styles.imageItem}>
            <img src={printSampleLight} alt="Print Sample Light Tee" />
          </div>
        </div>

        <p className={styles.description}>
          Enhance your product's appeal with a custom sleeve design
        </p>

        <button className={styles.addDesignButton} onClick={onAddDesign}>
          Add Sleeve Design
        </button>

        <button className={styles.noThanksButton} onClick={onClose}>
          No thanks, take me back to the Design Studio
        </button>
      </div>
    </div>
  );
};

export default SleeveDesignPopup;