import React, { useState, useEffect } from 'react';
import footerStyle from './Footer.module.css';
import { IoShareSocialOutline, IoPricetagOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import SaveDesignPopup from '../PopupComponent/SaveDesignPopup/SaveDesignPopup.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestExport } from '../../redux/CanvasExportDesign/canvasExportSlice.js';
import MobileFAB from '../MobileFab/MobileFab.jsx';
const Footer = () => {
  const [savedesignpopup, setSavedesignPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sleevedesignn = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setNavigate = () => {
    navigate('/quantity?productId=8847707537647&title=Dusty%20Rose%20/%20S');
  };

  const setSavedesignPopupHandler = () => {
    setSavedesignPopup(!savedesignpopup);
    dispatch(requestExport());
  };

  return (
    <>
      {/* Desktop View */}
      {!isMobile && !sleevedesignn && (
        <div className={footerStyle.footerContainer}>
          <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
            <IoShareSocialOutline /> SHARE
          </button>
          <button className={footerStyle.footerBtn} onClick={setNavigate}>
            <IoPricetagOutline /> GET PRICE
          </button>
          <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
            <FiSave /> SAVE DESIGN
          </button>
          <button className={footerStyle.footerBtn} onClick={setNavigate}>
            NEXT STEP <FaArrowRightLong />
          </button>
        </div>
      )}

      {/* Show MobileFAB if isMobile OR sleeveDesign is true */}
      {(isMobile || sleevedesignn) && (
        <MobileFAB
          onShare={setSavedesignPopupHandler}
          onSave={setSavedesignPopupHandler}
          onPrice={setNavigate}
          onNext={setNavigate}
        />
      )}

      {/* Show Save Design Popup */}
      {savedesignpopup && (
        <SaveDesignPopup setSavedesignPopupHandler={setSavedesignPopupHandler} />
      )}
    </>
  );

};

export default Footer;
