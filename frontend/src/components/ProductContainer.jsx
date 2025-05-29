import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSide, setRendering } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import MainDesignTool from './mainDesignTool';
import { GrZoomOut } from "react-icons/gr";
import { BsZoomIn } from "react-icons/bs";
import { MagnifyGlassIcon } from './iconsSvg/CustomIcon';
import './ProductContainer.css';
import { setExportedImages } from '../redux/CanvasExportDesign/canvasExportSlice';
import SleeveDesignPopup from './PopupComponent/addSleeveDesign/addSleeveDesingPopup';
import { getHexFromName } from './utils/colorUtils';

function ProductContainer() {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);

  const frontImage = useSelector(state => state?.selectedProducts?.activeProduct?.imgurl || 'https://i.postimg.cc/vHZM9108/Rectangle-11.png');
  const backImage = useSelector(state => state?.selectedProducts?.activeProduct?.colors?.[1]?.img || "https://i.postimg.cc/SKrzZYbT/backimage-removebg-preview.png");



function invertHexColor(hex) {
  try {
    hex = hex.replace('#', '');

    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }

    const inverted = (parseInt(hex, 16) ^ 0xFFFFFF).toString(16).padStart(6, '0');
    return `#${inverted.toUpperCase()}`;
  } catch (error) {
    console.error('Error inverting hex color:', error.message);
    // Optionally return a default/fallback color
    return '#FFFFFF'; // fallback to black or any default color
  }
}


  const activeProductColor = useSelector(state => state?.selectedProducts?.activeProduct?.selectedColor?.name); 
  const activeProductColorHex = getHexFromName(activeProductColor);
  const invertedColor = invertHexColor(activeProductColorHex);  //convert the color to text to hax then invert it

 
  const [frontBgImage, setFrontBgImage] = useState(frontImage);
  const [backBgImage, setBackBgImage] = useState(frontImage);
  const [rightSleeveBgImage, setRightSleeveBgImage] = useState(frontImage);
  const [leftSleeveBgImage, setLeftSleeveBgImage] = useState(frontImage);

  const [frontPreviewImage, setFrontPreviewImage] = useState(frontImage);
  const [backPreviewImage, setBackPreviewImage] = useState(frontImage);
  const [rightSleevePreviewImage, setRightSleevePreviewImage] = useState(frontImage);
  const [leftSleevePreviewImage, setLeftSleevePreviewImage] = useState(frontImage);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [logo, setLogo] = useState(<BsZoomIn />);

  const [OpenSleeveDesignUPopup, setOpenSleeveDesignUPopup] = useState(false);
  const [addSleeves, setAddSleeves] = useState(false);

  const toggleZoom = () => {
    if (isZoomedIn) {
      setLogo(<BsZoomIn />);
      setZoomLevel(1);
      setIsZoomedIn(false);
    } else {
      setLogo(<GrZoomOut />);
      setZoomLevel(1.4);
      setIsZoomedIn(true);
    }
  };

  const ShowFront = () => {
    dispatch(setActiveSide("front"));
    setTimeout(() => setRendering(), 100);
  };

  const ShowBack = () => {
    dispatch(setActiveSide("back"));
    setTimeout(() => setRendering(), 100);
  };

  const ShowRightSleeve = () => {
    dispatch(setActiveSide("rightSleeve"));
    setTimeout(() => setRendering(), 100);
  };

  const ShowLeftSleeve = () => {
    dispatch(setActiveSide("leftSleeve"));
    setTimeout(() => setRendering(), 100);
  };

  const onClose = () => {
    setOpenSleeveDesignUPopup(!OpenSleeveDesignUPopup);
  };

  const onAddDesign = () => {
    setAddSleeves(true);
    onClose();
  };

  useEffect(() => {
    setFrontBgImage(frontImage);
    setFrontPreviewImage(frontImage);
    setLeftSleevePreviewImage(frontImage);
    setRightSleevePreviewImage(frontImage);
    setBackPreviewImage(frontImage);
  }, [frontImage]);

  // useEffect(() => {
  //   setBackBgImage(frontImage);
  //   setBackPreviewImage(frontImage);
  // }, [backImage]);

  return (
    <div className="ProductContainerMainDiv">
      <div className="flex">

        {/* Render Active Canvas Side */}
        <div style={{ display: activeSide === "front" ? "block" : "none" }}>
          <MainDesignTool
           warningColor={invertedColor}
            id="mirrorCanvasFront"
            key="front"
            backgroundImage={frontBgImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={setFrontPreviewImage}
            setBackPreviewImage={() => { }}
            setLeftSleevePreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
          />
        </div>

        <div style={{ display: activeSide === "back" ? "block" : "none" }}>
          <MainDesignTool
          warningColor={invertedColor}
            id="mirrorCanvasBack"
            key="back"
            backgroundImage={frontImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setLeftSleevePreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
            setBackPreviewImage={setBackPreviewImage}
          />
        </div>

        <div style={{ display: activeSide === "rightSleeve" ? "block" : "none" }}>
          <MainDesignTool
         warningColor={invertedColor}
            id="mirrorCanvasRightSleeve"
            key="rightSleeve"
            backgroundImage={frontImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setBackPreviewImage={() => { }}
            setLeftSleevePreviewImage={() => { }}
            setRightSleevePreviewImage={setRightSleevePreviewImage}
          />
        </div>

        <div style={{ display: activeSide === "leftSleeve" ? "block" : "none" }}>
          <MainDesignTool
          warningColor={invertedColor}
            id="mirrorCanvasLeftSleeve"
            key="leftSleeve"
            backgroundImage={frontImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setBackPreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
            setLeftSleevePreviewImage={setLeftSleevePreviewImage}
          />
        </div>

        {/* Side Preview Thumbnails */}
        <div className="Prouduct-mirror-container" >
          <div className="Prouduct-mirror-left-container">

            <div className="corner-img-canva-container" onClick={ShowFront}>
              <img
                src={frontPreviewImage}
                className={`ProductContainerSmallImage ${activeSide === 'front' ? "hover-active" : ""}`}
              />
              <p>Front</p>
            </div>

            <div className="corner-img-canva-container" onClick={ShowBack}>
              <img
                src={backPreviewImage}
                className={`ProductContainerSmallImage ${activeSide === 'back' ? "hover-active" : ""}`}
              />
              <p>Back</p>
            </div>

            {
              addSleeves &&
              <>
                <div className="corner-img-canva-container" onClick={ShowRightSleeve}  >
                  <img
                    src={rightSleevePreviewImage}
                    className={`ProductContainerSmallImage ${activeSide === 'rightSleeve' ? "hover-active" : ""}`}
                  />
                  <p>Right Sleeve</p>
                </div>
                <div className="corner-img-canva-container" onClick={ShowLeftSleeve}  >
                  <img
                    src={leftSleevePreviewImage}
                    className={`ProductContainerSmallImage ${activeSide === 'leftSleeve' ? "hover-active" : ""}`}
                  />
                  <p>Left Sleeve</p>
                </div>
              </>

            }

            {
              OpenSleeveDesignUPopup &&
              <SleeveDesignPopup onClose={onClose} onAddDesign={onAddDesign} />
            }

          </div>

        {!addSleeves &&
            <div className="zoom-container" onClick={onClose}>
            <p>SLEEVES & MORE</p>
          </div>
        }

          <div className="zoom-container" onClick={toggleZoom}>
            {logo}
            <p>Zoom</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductContainer;
