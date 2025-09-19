import React, { useEffect, useState } from 'react';
import style from './ContinueEditPopup.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch, useSelector } from 'react-redux';
import { restoreAllSlicesFromLocalStorage } from '../../utils/RestoreSliceStates';
import { generateDesigns } from '../../Editor/utils/helper';
import transformReduxState from '../../utils/transformReduxState';
import { current } from '@reduxjs/toolkit';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';
import db from '../../../db/indexDb';

const ContinueEditPopup = ({
  handleContinuePopup,
}
) => {
  const dispatch = useDispatch();
  // let reduxdata = JSON.parse(localStorage.getItem("savedReduxState"));
  const [reduxdata, setReduxdata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reduxDataTransformed, setReduxDataTransformed] = useState(false)
  // reduxdata = transformReduxState(reduxdata)
  // console.log("reduxdata after transformReduxState in ContinueEditPopup", reduxdata);

  // console.log("reduxdata in ContinueEditPopup", JSON.parse(reduxdata));

  let selectedProducts = null
  selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts[0])
  // if (reduxdata?.selectedProducts?.selectedProducts) {
  //   selectedProducts = reduxdata?.selectedProducts?.selectedProducts[0]
  // }


  console.log("selectedProducts in ContinueEditPopup", selectedProducts);
  const [lastProductImages, setLastProductImages] = useState([])
  const continueEditHandler = () => {
    restoreAllSlicesFromLocalStorage(dispatch, reduxDataTransformed);
    handleContinuePopup();
  };

  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await db.state.get("redux");
        setReduxdata(saved?.data || null);
      } catch (e) {
        console.error("Error loading Redux state:", e);
      }
    };

    loadState();
  }, []);

  useEffect(() => {
    if (!reduxdata) return; // wait until loaded
    if (!selectedProducts || selectedProducts.length === 0) {
      handleContinuePopup();
      return;
    }
    selectedProducts = reduxdata?.selectedProducts?.activeProduct ?? selectedProducts

    const lastProductImages = selectedProducts.images.slice(0, 3);
    lastProductImages.push(lastProductImages.slice(-1)[0]);

    const designPromises = async () => {
      setLoading(true);
      const transformed = await transformReduxState(reduxdata);
      setReduxDataTransformed(transformed);

      const { present, nameAndNumberDesignState, addName, addNumber, activeNameAndNumberPrintSide, activeSide } =
        transformed.TextFrontendDesignSlice;

      const { canvasWidth, canvasHeight } = transformed.canvasReducer;

      let front, back;

      // Handle front
      if (activeNameAndNumberPrintSide === "front" && (addName || addNumber)) {
        front = (
          await generateDesigns(
            [lastProductImages[0]],
            present.front.texts,
            present.front.images,
            nameAndNumberDesignState,
            activeSide,
            canvasWidth,
            canvasHeight,
            addName,
            addNumber
          )
        )[0];
      } else {
        front = (
          await generateDesigns(
            [lastProductImages[0]],
            present.front.texts,
            present.front.images,
            {},
            activeSide,
            canvasWidth,
            canvasHeight,
            addName,
            addNumber
          )
        )[0];
      }

      // Handle back
      if (activeNameAndNumberPrintSide === "back" && (addName || addNumber)) {
        back = (
          await generateDesigns(
            [lastProductImages[1]],
            present.back.texts,
            present.back.images,
            nameAndNumberDesignState,
            activeSide,
            canvasWidth,
            canvasHeight,
            addName,
            addNumber
          )
        )[0];
      } else {
        back = (
          await generateDesigns(
            [lastProductImages[1]],
            present.back.texts,
            present.back.images,
            {},
            activeSide,
            canvasWidth,
            canvasHeight,
            addName,
            addNumber
          )
        )[0];
      }

      const leftSleeve = (
        await generateDesigns(
          [lastProductImages[2]],
          present.leftSleeve.texts,
          present.leftSleeve.images,
          {},
          activeSide,
          canvasWidth,
          canvasHeight,
          addName,
          addNumber
        )
      )[0];

      const rightSleeve = (
        await generateDesigns(
          [lastProductImages[2]],
          present.rightSleeve.texts,
          present.rightSleeve.images,
          {},
          activeSide,
          canvasWidth,
          canvasHeight,
          addName,
          addNumber
        )
      )[0];

      return { front, back, leftSleeve, rightSleeve };
    };

    designPromises()
      .then(({ front, back, leftSleeve, rightSleeve }) => {
        const updatedImages = [front, back, leftSleeve, rightSleeve];
        setLastProductImages(updatedImages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [selectedProducts, reduxdata]);


  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <div className={style.header}>
          <div className={style.title}>CONTINUE YOUR DESIGN</div>
          <CloseButton onClose={handleContinuePopup} />
          {/* <button className={style.closeButton} onClick={handleContinuePopup}>
            <CrossIcon />
          </button> */}
        </div>

        <div className={style.content}>
          {/* <h2 className={style.title}>CONTINUE YOUR DESIGN</h2> */}
          <p className={style.subtitle}>
            We've saved your progress. Would you like to pick up where you left off or start a fresh design?
          </p>

          {loading && (
            <div className={style.loaderWrapper}>
              <div className={style.loader}></div>
              <p>Restoring your design...</p>
            </div>
          )}

          <div className={style.previewRow}>
            {lastProductImages.map((src, i) => (
              <img key={i} src={src?.originalSrc ?? src} alt="Design preview" className={style.previewImage} />
            ))}
          </div>

          <div className={style.buttonGroup}>
            <button className={style.primaryBtn} onClick={continueEditHandler} disabled={loading}>
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
