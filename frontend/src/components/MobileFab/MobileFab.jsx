import React, { useState, useRef, useEffect } from 'react';
import './MobileFab.css';
import { IoShareSocialOutline, IoPricetagOutline } from 'react-icons/io5';
import { FiSave } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';

const MobileFAB = ({ onShare, onSave, onPrice, onNext }) => {
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null); // reference to the entire FAB

  // Close on outside click
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (fabRef.current && !fabRef.current.contains(event.target)) {
  //       setOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);

  return (
    <div className="fab-container" ref={fabRef}>
      {/* Action Buttons */}
      <div className={`fab-actions ${open ? 'open' : ''}`}>
        <div className="fab-tooltip-wrapper">
          <span className="fab-tooltip">Share</span>
          <button className="fab-button" onClick={onShare}>
            <IoShareSocialOutline />
          </button>
        </div>
        <div className="fab-tooltip-wrapper">
          <span className="fab-tooltip">Get Price</span>
          <button className="fab-button" onClick={onPrice}>
            <IoPricetagOutline />
          </button>
        </div>
        <div className="fab-tooltip-wrapper">
          <span className="fab-tooltip">Save Design</span>
          <button className="fab-button" onClick={onSave}>
            <FiSave />
          </button>
        </div>
        <div className="fab-tooltip-wrapper">
          <span className="fab-tooltip">Next Step</span>
          <button className="fab-button" onClick={onNext}>
            <FaArrowRightLong />
          </button>
        </div>
      </div>

      {/* Main FAB Button */}
      <button
        className={`fab-main ${open ? 'rotate' : ''}`}
        onClick={() => setOpen(!open)}
        title="Toggle Menu"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default MobileFAB;
