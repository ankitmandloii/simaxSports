import './layerComponent.css';
import icons from '../../../data/icons';
import BringFront from '../../images/bring-to-front.png'
import BringBack from '../../images/send-backwards.png'
import SendBack from '../../images/send-to-back.png'



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
            <img src={BringFront} alt="Bring Forward" title="Bring Forward" />Bring Forward</button>
          <button onClick={() => {
            onLayerAction('sendBackward');
            onClose();
          }}> <img src={BringBack} alt="Bring Forward" title="Bring Forward" />Send Backward</button>
          <button onClick={() => {
            onLayerAction('bringToFront');
            onClose();
          }}> <img src={BringFront} alt="Bring Forward" title="Bring Forward" />Bring to Front</button>
          <button onClick={() => {
            onLayerAction('sendToBack');
            onClose();
          }}> <img src={SendBack} alt="Bring Forward" title="Bring Forward" /> Send to Back</button>
        </div>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LayerModal;
