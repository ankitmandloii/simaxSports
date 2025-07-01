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
    <>
      <ul className={`${styles.redoundoContainer}`}>
        <li className={styles.redoundoLi} >
          <button
            className={styles.productContainerButton}

            disabled={!canUndo}
            onClick={() => dispatch(undo())}
          >
            <span><TbArrowBack /></span>UNDO
          </button>
        </li>
        <li className={styles.redoundoLi}>
          <button
            className={styles.productContainerButton}

            disabled={!canRedo}
            onClick={() => dispatch(redo())}
          >
            <span><TbArrowForwardUp /></span>REDO
          </button>
        </li>
        <li className={styles.redoundoLi}>
          <button
            className={styles.productContainerButton}

            disabled={!canStartOver}
            onClick={() => setStartOverPopup(!startOverPopup)}
          >
            <span><StartOverIcon /></span>RESET
          </button>
        </li>
      </ul>
      {startOverPopup && <StartOverConfirmationPopup onCancel={closeStartOverPopup} />}

    </>

  );
}

export default RedoundoComponent;
