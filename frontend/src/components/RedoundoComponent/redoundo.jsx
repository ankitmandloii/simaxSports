import { TbArrowForwardUp, TbArrowBack } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
import { redo, selectCanRedo, selectCanUndo, undo, selectCanStartOver } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import { StartOverIcon } from "../iconsSvg/CustomIcon";
import StartOverConfirmationPopup from "../PopupComponent/StartOverPopup/StartOverPopup";
import { useLocation } from "react-router-dom";
import styles from './redoundo.module.css';
function RedoundoComponent() {
  const location = useLocation();
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const canStartOver = useSelector(selectCanStartOver);
  const [startOverPopup, setStartOverPopup] = useState(false);
  const dispatch = useDispatch();

  const closeStartOverPopup = () => {
    setStartOverPopup(!startOverPopup);
  };

  return (
    <ul className={`${styles.redoundoContainer}`}>
      <li>
        <button
          className={styles.productContainerButton}
          onClick={() => dispatch(undo())}
          disabled={!canUndo}
        >
          <span><TbArrowBack /></span>UNDO
        </button>
      </li>
      <li>
        <button
          className={styles.productContainerButton}
          onClick={() => dispatch(redo())}
          disabled={!canRedo}
        >
          <span><TbArrowForwardUp /></span>REDO
        </button>
      </li>
      <li>
        <button
          className={styles.productContainerButton}
          onClick={() => setStartOverPopup(!startOverPopup)}
          disabled={!canStartOver}
        >
          <span><StartOverIcon /></span>START OVER
        </button>
      </li>
      {startOverPopup && <StartOverConfirmationPopup onCancel={closeStartOverPopup} />}
    </ul>
  );
}

export default RedoundoComponent;
