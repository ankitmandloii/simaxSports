
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
        Home
      </button>
      <div className="footer-btn-container ">
        <button className="footer-btn ">
        <IoPricetagOutline />

          Get Price
        </button>
        <button className="footer-btn ">
        <FiSave />

          Save Design
        </button>
        <button className="footer-btn ">
          
          Next Step
          <FaArrowRightLong />

        </button>
      </div>



    </div>
  )
}

export default Footer

