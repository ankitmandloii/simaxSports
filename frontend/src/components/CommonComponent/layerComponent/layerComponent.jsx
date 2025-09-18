import BringFront from '../../images/bring-to-front.png'
import BringBack from '../../images/send-backwards.png'
import SendBack from '../../images/send-to-back.png'
import style from './layerComponent.module.css';
import CopyImg from '../../images/copyPng.png'
import { useDispatch, useSelector } from 'react-redux';
import { copyElementToSide } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
const LayerModal = ({ isOpen, onClose, onLayerAction, Sleeve }) => {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedTextId = useSelector(
    (state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId
  );
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  // console.log("selectedTExtId", selectedTextId)

  if (!isOpen) return null;
  const selectedElementId = selectedTextId || selectedImageId;
  const elementType = selectedTextId ? 'text' : 'image';
  // -------------------Function to Copy element from one side to another side-------------
  const handleCopyToSide = (targetSide) => {
    if (selectedElementId) {
      dispatch(copyElementToSide({
        fromSide: activeSide,
        toSide: targetSide,
        elementId: selectedElementId,
        elementType: elementType
      }));
      onClose();
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>


        <div className={style.header}>
          <h2 className={style.headerTitle}>Layer Actions</h2>
          <span className={style.closeIconButton} onClick={onClose}><CrossIcon /> </span>



        </div>

        <div className={style.modalActions}>
          {/* -----------------Layering Actions---------------------- */}
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



          {/* --------------Copy elements on Sides----------------- */}
          {activeSide !== 'front' && (
            <button onClick={() => handleCopyToSide('front')}>
              <img src={CopyImg} alt="Copy to Front" title="Copy to Front" />Copy to Front
            </button>
          )}

          {activeSide !== 'back' && (
            <button onClick={() => handleCopyToSide('back')}>
              <img src={CopyImg} alt="Copy to Back" title="Copy to Back" />Copy to Back
            </button>
          )}

          {activeSide !== 'leftSleeve' && Sleeve !== 'Sleeveless' && (
            <button onClick={() => handleCopyToSide('leftSleeve')}>
              <img src={CopyImg} alt="Copy to Left Sleeve" title="Copy to Left Sleeve" />Copy to Left
            </button>
          )}

          {activeSide !== 'rightSleeve' && Sleeve !== 'Sleeveless' && (
            <button onClick={() => handleCopyToSide('rightSleeve')}>
              <img src={CopyImg} alt="Copy to Right Sleeve" title="Copy to Right Sleeve" />Copy to Right
            </button>
          )}
        </div>

        {/* <button className={style.closeButton} onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default LayerModal;
