import React, { useEffect, useState } from 'react';
import styles from './SleeveDesignPopup.module.css';
// Import your image assets here. Replace with actual paths to your images.
// For demonstration, I'm using placeholder names.
import printSampleDark from '../../images/sleeveImagePopup.png'
import printSampleGrey from '../../images/sleeveImagePopup2.png';
import printSampleGreen from '../../images/sleeveImagePopup3.png';
import printSampleLight from '../../images/sleeveImagePopup4.png';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';
function getProductSleeveType(title) {

  const keywords = [
    "Sleeveless",
    "Long Sleeve",
  ];

  const lowerTitle = title?.toLowerCase();

  for (let key of keywords) {
    const regex = new RegExp(`\\b${key}\\b`, "i"); // \b ensures whole word match
    if (regex.test(title)) {
      return key;
    }
  }

  return "Unknown";
}

const SleeveDesignPopup = ({ onClose, onAddDesign, activeProductTitle }) => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (getProductSleeveType(activeProductTitle) == "Sleeveless") {
      setHidden(true)
    }
  }, [activeProductTitle])
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>

        <div className={styles.header}>
          <h2 className={styles.title}>MORE PRINT AREAS</h2>
          {/* <button className={styles.closeButton} onClick={onClose}>
            &times; 
          </button> */}
          <CloseButton onClose={onClose} />
        </div>
        <div className={styles.popupMainContent}>
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

          <button className={styles.addDesignButton} onClick={onAddDesign} disabled={hidden}>
            Add Sleeve Design
          </button>

          <button className={styles.noThanksButton} onClick={onClose}>
            No thanks, take me back to the Design Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleeveDesignPopup;