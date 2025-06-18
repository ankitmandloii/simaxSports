import React, { useState, useRef, useEffect } from 'react';
import { IoShareSocialOutline, IoPricetagOutline } from 'react-icons/io5';
import { FiSave } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import style from './MobileFab.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileFAB = ({ onShare, onSave, onPrice }) => {
  const [open, setOpen] = useState(false);
  const fabRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const steps = ['/design/product', '/quantity', '/review'];
  const currentIndex = steps.indexOf(location.pathname);
  // Close FAB when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // const onPrevious = () => {
  //   navigate(-1);
  // }
  const onNext = () => {
    if (currentIndex < steps.length - 1) {
      navigate(steps[currentIndex + 1]);
    }
  };

  const onPrevious = () => {
    if (currentIndex > 0) {
      navigate(steps[currentIndex - 1]);
    }
  }

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
        <div className={style.fabTooltipWrapper}>
          <span className={style.fabTooltip}>Prev Step</span>
          <button className={style.fabButton} onClick={onPrevious}>
            <FaArrowLeftLong />
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
