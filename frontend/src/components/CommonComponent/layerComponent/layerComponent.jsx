import React, { useState } from 'react';
import './layerComponent.css';

const LayerModal = ({ isOpen, onClose, onLayerAction }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Layer Actions</h2>
        <div className="modal-actions">
          <button onClick={() => onLayerAction('bringForward')}>Bring Forward</button>
          <button onClick={() => onLayerAction('sendBackward')}>Send Backward</button>
          <button onClick={() => onLayerAction('bringToFront')}>Bring to Front</button>
          <button onClick={() => onLayerAction('sendToBack')}>Send to Back</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LayerModal;
