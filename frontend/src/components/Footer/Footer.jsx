
import React, { useState } from 'react'
import footerStyle from './Footer.module.css'
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
    navigate('/quantity?productId=8847707537647&title=Dusty%20Rose%20/%20S');
  }
  const setSavedesignPopupHandler = () => {
    setSavedesignPopup(!savedesignpopup);
    dispatch(requestExport())
  }

  return (
    <>
      <div className={footerStyle.footerContainer}>
        <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
          <IoShareSocialOutline />
          SHARE
        </button>

        <button className={footerStyle.footerBtn} onClick={setNavigate}>
          <IoPricetagOutline />

          GET PRICE
        </button>
        <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
          <FiSave />

          SAVE DESIGN
        </button>
        <button className={footerStyle.footerBtn} onClick={setNavigate}>

          NEXT STEP
          <FaArrowRightLong />

        </button>



      </div>
      {savedesignpopup && <SaveDesignPopup setSavedesignPopupHandler={setSavedesignPopupHandler} />}
    </>

  )
}

export default Footer

