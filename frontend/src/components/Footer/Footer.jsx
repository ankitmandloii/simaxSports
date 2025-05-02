
import React from 'react'
import './Footer.css'
import { IoShareSocialOutline } from "react-icons/io5";
import { IoPricetagOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";


const Footer = () => {
  return (
    <div className='footer-container'>
      <button className="footer-btn ">
        <IoShareSocialOutline />
        SHARE
      </button>
      <div className="footer-btn-container ">
        <button className="footer-btn ">
        <IoPricetagOutline />

          GET PRICE
        </button>
        <button className="footer-btn ">
        <FiSave />

          SAVE DESIGN
        </button>
        <button className="footer-btn ">
          
          NEXT STEP
          <FaArrowRightLong />

        </button>
      </div>



    </div>
  )
}

export default Footer

