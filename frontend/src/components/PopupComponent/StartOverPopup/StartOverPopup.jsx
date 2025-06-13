import React from 'react';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import style from './StartOverPopup.module.css'
import { useDispatch } from 'react-redux';
import { resetCanvasState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
// import { useNavigate } from 'react-router-dom';


const StartOverConfirmationPopup = ({ onCancel }) => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const resetAll = () => {
    dispatch(resetCanvasState())

    onCancel()
    // navigate(0);
  }
  return (
    <div className={style.popupOverlay}>
      <div className={style.popupContainer}>
        <div className={style.popupHeaderrr}>
          <h2>Start Over?</h2>
          <p>Are you sure you want to start over? All unsaved changes will be lost.</p>
          <button className={style.closeIconButton} onClick={onCancel}>
            <CrossIcon />
          </button>

        </div>
        <div className={style.popupButtons}>
          <button className={`${style.popupButton} ${style.confirmButton}`} onClick={resetAll}>Yes</button>
          <button className={`${style.popupButton} ${style.cancelButton}`} onClick={onCancel}>No</button>
        </div>
      </div>
    </div>

  );
};

export default StartOverConfirmationPopup;
