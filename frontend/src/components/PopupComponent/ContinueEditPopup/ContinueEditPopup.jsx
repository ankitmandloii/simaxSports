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
import * as tmImage from "@teachablemachine/image";

async function detectSleeveType(imageUrl) {
  try {
    // Load the model
    const modelPath = "/model/model.json";
    const metadataPath = "/model/metadata.json";
    const model = await tmImage.load(modelPath, metadataPath);

    // Create an image element from the URL
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous"; // Handle CORS if needed
    imgElement.src = imageUrl;

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      imgElement.onload = resolve;
      imgElement.onerror = () => reject(new Error("Failed to load image"));
    });

    // Run prediction
    const predictions = await model.predict(imgElement);
    const bestPrediction = predictions.reduce((prev, current) =>
      prev.probability > current.probability ? prev : current
    );

    const sleeveType = bestPrediction.className; // e.g., "Sleeveless", "Long Sleeve", "Tank Top"
    const probability = (bestPrediction.probability * 100).toFixed(2);
    console.log(`Detected sleeve type: ${sleeveType} (${probability}%)`);

    return sleeveType;
  } catch (error) {
    console.error("Error detecting sleeve type:", error);
    return "Unknown"; // Fallback to Unknown on error
  }
}

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

  function getVariantImagesFromMetafields(metafieldss) {
    let front = null;
    let back = null;
    let sleeve = null;
    try {
      const metafields = metafieldss?.edges || [];
      const variantImagesField = metafields.find(
        (edge) => edge?.node?.key === 'variant_images'
      )?.node?.value;

      if (variantImagesField) {
        const parsedImages = JSON.parse(variantImagesField);
        front = parsedImages.find((img) => img.includes('_f_fl')) || null;
        back = parsedImages.find((img) => img.includes('_b_fl')) || null;
        sleeve = parsedImages.find((img) => img.includes('_d_fl')) || null;
      }
    } catch (error) {
      console.error('Error parsing variant_images metafield:', error);
    }
    return [front, back, sleeve, sleeve];
  }

  useEffect(() => {
    if (!reduxdata) return; // wait until loaded
    if (!selectedProducts || selectedProducts.length === 0) {
      handleContinuePopup();
      return;
    }

    // selectedProducts = reduxdata?.selectedProducts?.activeProduct ?? selectedProducts
    let metafields = reduxdata?.selectedProducts?.activeProduct?.selectedColor?.variant?.metafields ?? selectedProducts
    let lastProductImages = getVariantImagesFromMetafields(metafields);
    if (!lastProductImages) {
      handleContinuePopup();
      return;
    }
    console.log("lastProductImages from metafields", lastProductImages);
    // lastProductImages = lastProductImages ?? selectedProducts
    // lastProductImages.push(lastProductImages.slice(-1)[0]);

    // const designPromises = async () => {
    //   setLoading(true);
    //   const transformed = await transformReduxState(reduxdata);
    //   setReduxDataTransformed(transformed);

    //   const {
    //     present,
    //     nameAndNumberDesignState,
    //     addName,
    //     addNumber,
    //     activeNameAndNumberPrintSide,
    //     activeSide,
    //   } = transformed.TextFrontendDesignSlice;
    //   const { canvasWidth, canvasHeight } = transformed.canvasReducer;

    //   // Configuration for each design part to avoid repetition
    //   const designParts = [
    //     { side: "front", data: present.front, image: lastProductImages[0] },
    //     { side: "back", data: present.back, image: lastProductImages[1] },
    //     { side: "leftSleeve", data: present.leftSleeve, image: lastProductImages[2] },
    //     { side: "rightSleeve", data: present.rightSleeve, image: lastProductImages[2] },
    //   ];

    //   // Create an array of promises to be executed in parallel
    //   const promises = designParts.map((part) => {
    //     const useNameAndNumber =
    //       activeNameAndNumberPrintSide === part.side && (addName || addNumber);

    //     return generateDesigns(
    //       [part.image],
    //       part.data.texts,
    //       part.data.images,
    //       useNameAndNumber ? nameAndNumberDesignState : {},
    //       activeSide,
    //       canvasWidth,
    //       canvasHeight,
    //       addName,
    //       addNumber
    //     );
    //   });

    //   // Await all promises in parallel and destructure the results
    //   const [[front], [back], [leftSleeve], [rightSleeve]] = await Promise.all(promises);

    //   return { front, back, leftSleeve, rightSleeve };
    // };
    const designPromises = async () => {
      setLoading(true);
      const transformed = await transformReduxState(reduxdata);
      setReduxDataTransformed(transformed);

      const {
        present,
        nameAndNumberDesignState,
        addName,
        addNumber,
        activeNameAndNumberPrintSide,
        activeSide,
      } = transformed.TextFrontendDesignSlice;
      const { canvasWidth, canvasHeight } = transformed.canvasReducer;

      // 1. Detect the sleeve type from the primary image
      const sleeveType = await detectSleeveType(lastProductImages[0]);
      console.log("Detected sleeve type:", sleeveType);
      const hasSleeves = !['Sleeveless', 'Tank Top', 'WithoutSleeves'].includes(sleeveType);

      // 2. Conditionally build the list of parts to design
      let designParts = [
        { side: "front", data: present.front, image: lastProductImages[0] },
        { side: "back", data: present.back, image: lastProductImages[1] },
      ];

      if (hasSleeves) {
        designParts.push(
          { side: "leftSleeve", data: present.leftSleeve, image: lastProductImages[2] },
          { side: "rightSleeve", data: present.rightSleeve, image: lastProductImages[2] }
        );
      }

      // 3. Create promises only for the required parts
      const promises = designParts.map((part) => {
        const useNameAndNumber =
          activeNameAndNumberPrintSide === part.side && (addName || addNumber);

        return generateDesigns(
          [part.image],
          part.data.texts,
          part.data.images,
          useNameAndNumber ? nameAndNumberDesignState : {},
          activeSide,
          canvasWidth,
          canvasHeight,
          addName,
          addNumber
        );
      });

      // 4. Await all promises and handle the results safely
      const results = await Promise.all(promises);

      const front = results[0]?.[0] || null;
      const back = results[1]?.[0] || null;
      // Set sleeves to null if they weren't generated
      const leftSleeve = hasSleeves ? (results[2]?.[0] || null) : null;
      const rightSleeve = hasSleeves ? (results[3]?.[0] || null) : null;

      return { front, back, leftSleeve, rightSleeve };
    };

    const handleGenerateDesigns = async () => {
      try {
        setLoading(true);
        const { front, back, leftSleeve, rightSleeve } = await designPromises();

        const updatedImages = [front, back, leftSleeve, rightSleeve].filter(Boolean);
        setLastProductImages(updatedImages);

      } catch (error) {
        console.error("Failed to generate designs:", error);
      } finally {
        // This block runs whether the try succeeds or the catch is triggered
        setLoading(false);
      }
    };
    handleGenerateDesigns();

    // Then you would simply call handleGenerateDesigns() from your button or useEffect
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
