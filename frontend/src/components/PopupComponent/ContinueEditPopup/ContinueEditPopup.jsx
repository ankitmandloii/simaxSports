import React from 'react';
import style from './ContinueEditPopup.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch } from 'react-redux';
import { restoreAllSlicesFromLocalStorage } from '../../utils/RestoreSliceStates';

const ContinueEditPopup = ({ handleContinuePopup }) => {
  const dispatch = useDispatch();

  const continueEditHandler = () => {
    dispatch(restoreAllSlicesFromLocalStorage());
    handleContinuePopup();
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <button className={style.closeButton} onClick={handleContinuePopup}>
          <CrossIcon />
        </button>
        <div className={style.content}>
          <h2 className={style.title}>Continue Your Design</h2>
          <p className={style.subtitle}>
            We've saved your progress. Would you like to pick up where you left off or start a fresh design?
          </p>

          <div className={style.previewRow}>
            {Array(4).fill().map((_, i) => (
              <img
                key={i}
                src="https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719"
                alt="Design preview"
                className={style.previewImage}
              />
            ))}
          </div>

          <div className={style.buttonGroup}>
            <button className={style.primaryBtn} onClick={continueEditHandler}>
              Continue Editing
            </button>
            <button className={style.secondaryBtn} onClick={handleContinuePopup}>
              Start From Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueEditPopup;
