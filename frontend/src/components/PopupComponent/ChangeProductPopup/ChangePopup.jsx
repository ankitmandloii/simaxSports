
import React, { useState } from 'react';
import './ChangePopup.css';
import CollectionPopupList from '../CollectionPopupList/CollectionPopupList';
import CollectionProductPopup from '../CollectionProductPopup/CollectionProductPopup';

const ChangePopup = ({ onClose, onProductSelect }) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  return (
    <div className="changeProdcutPopup-mainContainer">
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-header">
            <h2>Select a Collection</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="popup-body-layout">
            {/* Sidebar - Collection list */}
            <div className="popup-sidebar">
              <CollectionPopupList onCollectionSelect={setSelectedCollectionId} />
            </div>

            {/* Right panel - Products from collection */}
            <div className="popup-products">
              <CollectionProductPopup collectionId={selectedCollectionId} onProductSelect={onProductSelect} onClose={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChangePopup;
