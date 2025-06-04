import React, { useState, useRef } from 'react';
import { IoShareSocialOutline, IoPricetagOutline } from 'react-icons/io5';
import { FiSave } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import style from './MobileFab.module.css'

const MobileFAB = ({ onShare, onSave, onPrice, onNext }) => {
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null); // reference to the entire FAB


  return (
    <div className={style.fabContainer} ref={fabRef}>
      {/* Action Buttons */}
      <div className={`${style.fabActions} ${open ? style.open : ''}`}>
        <div className={style.fabTooltipWrapper}>
          <span className={style.fabTooltip}>Share</span>
          <button className={style.fabButton} onClick={onShare}>
            <IoShareSocialOutline />
          </button>
        </div>
        <div className={style.fabTooltipWrapper}>
          <span className={style.fabTooltip}>Get Price</span>
          <button className={style.fabButton} onClick={onPrice}>
            <IoPricetagOutline />
          </button>
        </div>
        <div className={style.fabTooltipWrapper}>
          <span className={style.fabTooltip}>Save Design</span>
          <button className={style.fabButton} onClick={onSave}>
            <FiSave />
          </button>
        </div>
        <div className={style.fabTooltipWrapper}>
          <span className={style.fabTooltip}>Next Step</span>
          <button className={style.fabButton} onClick={onNext}>
            <FaArrowRightLong />
          </button>
        </div>
      </div>

      {/* Main FAB Button */}
      <button
        className={`${style.fabMain} ${open ? style.rotate : ''}`}
        onClick={() => setOpen(!open)}
        title="Toggle Menu"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default MobileFAB;
