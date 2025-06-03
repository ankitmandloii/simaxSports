import React, { useState, useEffect } from 'react';
import './MobileFab.css';
import { IoShareSocialOutline, IoPricetagOutline } from 'react-icons/io5';
import { FiSave } from 'react-icons/fi';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';

const MobileFAB = ({ onShare, onSave, onPrice, onNext }) => {
  const [open, setOpen] = useState(false);
  const [renderButtons, setRenderButtons] = useState(false);

  useEffect(() => {
    if (open) {
      setRenderButtons(true);
    } else {
      // Delay to let close animation finish before unmounting buttons
      const timeout = setTimeout(() => setRenderButtons(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <div className="fab-container">
      {renderButtons && (
        <div className="fab-actions">
          <div className="fab-tooltip-wrapper">
            <span className="fab-tooltip">Share</span>
            <button
              className={`fab-button ${open ? 'show' : ''}`}
              onClick={onShare}
              style={{ transitionDelay: open ? '10ms' : '100ms' }}
            >
              <IoShareSocialOutline />
            </button>
          </div>
          <div className="fab-tooltip-wrapper">
            <span className="fab-tooltip">Get Price</span>
            <button
              className={`fab-button ${open ? 'show' : ''}`}
              onClick={onPrice}
              style={{ transitionDelay: open ? '10ms' : '100ms' }}
            >
              <IoPricetagOutline />
            </button>
          </div>
          <div className="fab-tooltip-wrapper">
            <span className="fab-tooltip">Save Design</span>
            <button
              className={`fab-button ${open ? 'show' : ''}`}
              onClick={onSave}
              style={{ transitionDelay: open ? '10ms' : '100ms' }}
            >
              <FiSave />
            </button>
          </div>
          <div className="fab-tooltip-wrapper">
            <span className="fab-tooltip">Next Step</span>
            <button
              className={`fab-button ${open ? 'show' : ''}`}
              onClick={onNext}
              style={{ transitionDelay: open ? '10ms' : '100ms' }}
            >
              <FaArrowRightLong />
            </button>
          </div>


        </div>
      )}

      <button
        className="fab-main"
        onClick={() => setOpen(!open)}
        title={open ? 'Close Menu' : 'Open Menu'}
        style={{
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        {open ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
};

export default MobileFAB;
