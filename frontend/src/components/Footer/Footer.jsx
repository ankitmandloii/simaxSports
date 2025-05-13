
import React, { useState } from 'react'
import './Footer.css'
import { IoShareSocialOutline } from "react-icons/io5";
import { IoPricetagOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import SaveDesignPopup from '../PopupComponent/SaveDesignPopup/SaveDesignPopup.jsx';

const Footer = () => {
  const [savedesignpopup,setSavedesignPopup]=useState(false);
  const setSavedesignPopupHandler=()=>{
    setSavedesignPopup(!savedesignpopup);
  }
  return (
    <>
     <div className='footer-container'>
      <button className="footer-btn ">
        <IoShareSocialOutline />
        SHARE
      </button>

        <button className="footer-btn ">
        <IoPricetagOutline />

          GET PRICE
        </button>
        <button className="footer-btn " onClick={setSavedesignPopupHandler}> 
        <FiSave />

          SAVE DESIGN
        </button>
        <button className="footer-btn ">
          
          NEXT STEP
          <FaArrowRightLong />

        </button>



    </div>
    {savedesignpopup && <SaveDesignPopup setSavedesignPopupHandler={setSavedesignPopupHandler}/>}
    </>
   
  )
}

export default Footer

