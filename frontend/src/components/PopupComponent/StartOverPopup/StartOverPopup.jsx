import React from 'react';
import './StartOverPopup.css'; // Reuse styles or create a new CSS file
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch } from 'react-redux';
import { resetCanvasState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { useNavigate } from 'react-router-dom';


const StartOverConfirmationPopup = ({  onCancel }) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const resetAll=()=>{
dispatch(resetCanvasState())

onCancel()
navigate(0);
  }
  return (
    <div className="startOverPopup">
 <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-headerrr">
          <h2>Start Over?</h2>
          <p>Are you sure you want to start over? All unsaved changes will be lost.</p>
          <button className="close-icon-button" onClick={onCancel}>
  <CrossIcon />
</button>

        </div>
        <div className="popup-buttons">
          <button className="popup-button confirm-button" onClick={resetAll}>Yes</button>
          <button className="popup-button cancel-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
    </div>
   
  );
};

export default StartOverConfirmationPopup;
