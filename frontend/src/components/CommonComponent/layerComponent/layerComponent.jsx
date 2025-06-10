import BringFront from '../../images/bring-to-front.png'
import BringBack from '../../images/send-backwards.png'
import SendBack from '../../images/send-to-back.png'
import style from './layerComponent.module.css';
import CopyImg from '../../images/copyPng.png'
import { useDispatch, useSelector } from 'react-redux';
import { copyTextToSide } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
const LayerModal = ({ isOpen, onClose, onLayerAction }) => {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const currentProductId = useSelector((state) => state.TextFrontendDesignSlice.currentProductId);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);

  const productState = useSelector(
    (state) => state.TextFrontendDesignSlice.products?.[currentProductId]
  );

  const nameAndNumberDesignState = productState?.present?.[activeSide]?.nameAndNumberDesignState;
  const isRender = productState?.present?.[activeSide]?.setRendering;
  const selectedTextId = productState?.present?.[activeSide]?.selectedTextId;
  // const selectedTextId = useSelector(
  //   (state) => state.TextFrontendDesignSlice.present[activeSide].selectedTextId
  // );
  // console.log("selectedTExtId", selectedTextId)

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={style.closeIconButton} onClick={onClose}><CrossIcon /> </span>
        <h2>Layer Actions</h2>
        <div className={style.modalActions}>
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

          {activeSide !== 'front' && (<button
            onClick={() => {
              if (selectedTextId) {
                dispatch(copyTextToSide({ fromSide: activeSide, toSide: 'front', textId: selectedTextId }));
                onClose();
              }
            }}> <img src={CopyImg} alt="Bring Forward" title="Bring Forward" />Copy to Front</button>)}

          {activeSide !== 'back' && (<button onClick={() => {
            if (selectedTextId) {
              dispatch(copyTextToSide({ fromSide: activeSide, toSide: 'back', textId: selectedTextId }));
              onClose();
            }
          }}> <img src={CopyImg} alt="Bring Forward" title="Bring Forward" />Copy to Back</button>)}
          {activeSide !== 'leftSleeve' && (<button onClick={() => {
            if (selectedTextId) {
              dispatch(copyTextToSide({ fromSide: activeSide, toSide: 'leftSleeve', textId: selectedTextId }));
              onClose();
            }
          }}> <img src={CopyImg} alt="Bring Forward" title="Bring Forward" />Copy to Left</button>)}
          {activeSide !== 'rightSleeve' && (<button onClick={() => {
            if (selectedTextId) {
              dispatch(copyTextToSide({ fromSide: activeSide, toSide: 'rightSleeve', textId: selectedTextId }));
              onClose();
            }
          }}> <img src={CopyImg} alt="Bring Forward" title="Bring Forward" />Copy to Right</button>)}
        </div>

        {/* <button className={style.closeButton} onClick={onClose}>Close</button> */}
      </div>
    </div>
  );
};

export default LayerModal;
