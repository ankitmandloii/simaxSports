import React, { useState } from 'react';
import './layerComponent.css';
import icons from '../../../data/icons';

const LayerModal = ({ isOpen, onClose, onLayerAction }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Layer Actions</h2>
        <div className="modal-actions">
          <button onClick={() => {
            onLayerAction('bringForward');
            onClose();
          }}
          >
            <img src={icons.layerUp} alt="Bring Forward" title="Bring Forward" />Bring Forward</button>
          <button onClick={() => {
            onLayerAction('sendBackward');
            onClose();
          }}> <img src={icons.layerUp} alt="Bring Forward" title="Bring Forward" />Send Backward</button>
          <button onClick={() => {
            onLayerAction('bringToFront');
            onClose();
          }}> <img src={icons.layerUp} alt="Bring Forward" title="Bring Forward" />Bring to Front</button>
          <button onClick={() => {
            onLayerAction('sendToBack');
            onClose();
          }}> <img src={icons.layerUp} alt="Bring Forward" title="Bring Forward" /> Send to Back</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LayerModal;
