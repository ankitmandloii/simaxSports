import React, { useEffect, useState } from 'react';
import style from './ContinueEditPopup.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAllSlicesFromLocalStorage } from '../../utils/RestoreSliceStates';

const ContinueEditPopup = ({ handleContinuePopup }) => {
  const dispatch = useDispatch();
  const reduxdata = JSON.parse(localStorage.getItem("savedReduxState"));
  // console.log("reduxdata in ContinueEditPopup", JSON.parse(reduxdata));
  let selectedProducts = null
  selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts[0])
  // if (reduxdata?.selectedProducts?.selectedProducts) {
  //   selectedProducts = reduxdata?.selectedProducts?.selectedProducts[0]
  // }

  // const selectedProducts = reduxdata?.selectedProducts?.selectedProducts[0] ?? useSelector((state) => state.selectedProducts.selectedProducts[0]);
  console.log("selectedProducts in ContinueEditPopup", selectedProducts);
  const [lastProductImages, setLastProductImages] = useState([])
  const continueEditHandler = () => {
    dispatch(restoreAllSlicesFromLocalStorage());
    handleContinuePopup();
  };

  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;
    const lastProductImages = selectedProducts.images.slice(0, 3);
    lastProductImages.push(lastProductImages.slice(-1)[0]);


    setLastProductImages(lastProductImages);
  }, [selectedProducts]);

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
            {lastProductImages.map((src, i) => (
              <img
                key={i}
                src={src.originalSrc ?? src}
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
