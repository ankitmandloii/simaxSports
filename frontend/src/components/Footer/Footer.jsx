
import React, { useState } from 'react'
import './Footer.css'
import { IoShareSocialOutline } from "react-icons/io5";
import { IoPricetagOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import SaveDesignPopup from '../PopupComponent/SaveDesignPopup/SaveDesignPopup.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { requestExport } from '../../redux/CanvasExportDesign/canvasExportSlice.js';

const Footer = () => {
  const [savedesignpopup, setSavedesignPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNavigate = () => {
    navigate('/quantity');
  }
  const setSavedesignPopupHandler = () => {
    setSavedesignPopup(!savedesignpopup);
    dispatch(requestExport())
  }

  return (
    <>
      <div className='footer-container'>
        <button className="footer-btn " onClick={setSavedesignPopupHandler}>
          <IoShareSocialOutline />
          SHARE
        </button>

        <button className="footer-btn " onClick={setNavigate}>
          <IoPricetagOutline />

          GET PRICE
        </button>
        <button className="footer-btn " onClick={setSavedesignPopupHandler}>
          <FiSave />

          SAVE DESIGN
        </button>
        <button className="footer-btn " onClick={setNavigate}>

          NEXT STEP
          <FaArrowRightLong />

        </button>



      </div>
      {savedesignpopup && <SaveDesignPopup setSavedesignPopupHandler={setSavedesignPopupHandler} />}
    </>

  )
}

export default Footer

