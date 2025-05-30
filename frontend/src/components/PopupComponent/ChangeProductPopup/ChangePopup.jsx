
import React, { useState } from 'react';
import styles from './ChangePopup.module.css'
import CollectionPopupList from '../CollectionPopupList/CollectionPopupList';
import CollectionProductPopup from '../CollectionProductPopup/CollectionProductPopup';

const ChangePopup = ({ onClose, onProductSelect }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <h2>Select a Collection</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.popupBodyLayout}>
          {/* Sidebar - Collection list */}
          <div className={styles.popupSidebar}>
            <CollectionPopupList onCollectionSelect={setSelectedCollectionId} />
          </div>

          {/* Right panel - Products from collection */}
          <div className={styles.popupProducts}>
            <CollectionProductPopup collectionId={selectedCollectionId} onProductSelect={onProductSelect} onClose={onClose} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChangePopup;
