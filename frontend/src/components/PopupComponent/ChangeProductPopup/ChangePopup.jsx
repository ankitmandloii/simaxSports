import React, { useState } from 'react';
import styles from './ChangePopup.module.css';
import CollectionPopupList from '../CollectionPopupList/CollectionPopupList';
import CollectionProductPopup from '../CollectionProductPopup/CollectionProductPopup';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';

const ChangePopup = ({ onClose, onProductSelect }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  // loading states for both children
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  // if either child is loading, this will be true
  const isAnyLoading = collectionLoading || productLoading;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <h2 className={styles.title}>Select a Collection</h2>
          <CloseButton onClose={onClose} />
          {/* <button
            className={styles.closeBtn}
            onClick={onClose}
          // disabled={isAnyLoading} // disable close while loading if needed
          >
            <CrossIcon />
          </button> */}
        </div>

        <div className={`${styles.popupBodyLayout} ${isAnyLoading ? styles.disabled : ''}`}>
          {/* Sidebar - Collection list */}
          <div className={styles.popupSidebar}>
            <CollectionPopupList
              onCollectionSelect={setSelectedCollectionId}
              mainloading={collectionLoading}
              setmainloading={setCollectionLoading}
            />
          </div>

          {/* Right panel - Products from collection */}
          <div className={styles.popupProducts}>
            <CollectionProductPopup
              collectionId={selectedCollectionId}
              onProductSelect={onProductSelect}
              onClose={onClose}
              setLoading={setProductLoading}
              setCollectionLoading={setCollectionLoading}
            />
          </div>
        </div>

        {isAnyLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePopup;
