import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
import { setActiveSide, setRendering } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import MainDesignTool from './mainDesignTool';
import { GrZoomOut } from "react-icons/gr";
import { BsZoomIn, BsZoomOut } from "react-icons/bs";
// import StartOverConfirmationPopup from './PopupComponent/StartOverPopup/StartOverPopup';
import { MagnifyGlassIcon } from './iconsSvg/CustomIcon';
import './ProductContainer.css';
import { setExportedImages } from '../redux/CanvasExportDesign/canvasExportSlice';

function ProductContainer() {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);
  // const location = useLocation();
  // const isQuantityPage = location.pathname === "/quantity";

  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const mirrorCanvasRef = useRef(null);
  const mirrorCanvasRefForBackImage = useRef(null);

  const frontDesignRef = useRef(null);
  const backDesignRef = useRef(null);


  // const frontImage = useSelector(state => state?.selectedProducts?.selectedProducts[0]?.colors?.[0]?.img || "");
  //   const backImage = useSelector(state => state?.selectedProducts?.selectedProducts[0]?.colors?.[1]?.img || "");
  const frontImage = useSelector(state => state?.selectedProducts?.activeProduct?.imgurl || 'https://i.postimg.cc/NfPdntgR/Rectangle-11.png');
  const backImage = useSelector(state => state?.selectedProducts?.activeProduct?.colors?.[1]?.img);

  const [frontBgImage, setFrontBgImage] = useState(frontImage);
  const [backBgImage, setBackBgImage] = useState(backImage || 'https://i.postimg.cc/N0xTW81Z/backimage-removebg-preview.png');

  useEffect(() => {
    setFrontBgImage(frontImage);
  }, [frontImage]);

  useEffect(() => {
    setBackBgImage(backImage || 'https://i.postimg.cc/N0xTW81Z/backimage-removebg-preview.png');
  }, [backImage]);


  // const [showFrontImage, setShowFrontImage] = useState(true);
  const [startOverPopup, setStartOverPopup] = useState(false);
  const [ShowFrontImage, setShowFrontImage] = useState(true);
  const ShowFront = () => {
    dispatch(setActiveSide("front"));
    if (backCanvasRef.current) {

      backDesignRef.current = backCanvasRef.current.toJSON();
    }

    dispatch(() => setRendering(), 100)
    setShowFrontImage(true); // Switch to front
  };

  const ShowBack = () => {
    if (frontCanvasRef.current) {
      frontDesignRef.current = frontCanvasRef.current.toJSON();
    }
    dispatch(setActiveSide("back"));

    dispatch(() => setRendering(), 100)
    setShowFrontImage(false); // Switch to back
  };

  // const toggleStartOverPopup = () => {
  //   setStartOverPopup((prev) => !prev);
  // };


  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [logo, setLogo] = useState(<BsZoomIn />);
  const toggleZoom = () => {
    if (isZoomedIn) {
      setLogo(<BsZoomIn />);
      setZoomLevel(1);       // Reset to normal zoom
      setIsZoomedIn(false);
    } else {
      setLogo(<GrZoomOut />);
      setZoomLevel(1.4);       // Zoom in 2x (adjust as needed)
      setIsZoomedIn(true);
    }
  };



  useEffect(() => {
    if (activeSide == "front") {
      setShowFrontImage(true)
    }
    else {
      setShowFrontImage(false);
    }

    setTimeout(() => setRendering(), 100)

  }, [activeSide])

  const getImageFromCanvas = (fabricCanvas) => {
    if (!fabricCanvas) return null;
    const canvas = fabricCanvas.lowerCanvasEl;
    return canvas.toDataURL("image/png");

  };


  useEffect(() => {
    if (exportRequested && frontCanvasRef.current && backCanvasRef.current) {
      const frontImage = getImageFromCanvas(frontCanvasRef.current);
      const backImage = getImageFromCanvas(backCanvasRef.current);
      console.log("frontImage", frontImage);
      console.log("backImage", backImage);
      dispatch(setExportedImages({ front: frontImage, back: backImage }));

    }

  }, [exportRequested]);


  return (

    <div className="ProductContainerMainDiv">
      <div className="flex">
        {/* Main canvas editor */}
        <div style={{ display: ShowFrontImage ? 'block' : 'none' }}>
          <MainDesignTool id="mirrorCanvasFront" key="front" canvasReff={frontCanvasRef} mirrorCanvasRef={mirrorCanvasRef} initialDesign={frontDesignRef.current} backgroundImage={frontBgImage} zoomLevel={zoomLevel} />
        </div>
        <div style={{ display: !ShowFrontImage ? 'block' : 'none' }}>
          <MainDesignTool id="mirrorCanvasBack" key="back" canvasReff={backCanvasRef} mirrorCanvasRef={mirrorCanvasRefForBackImage} initialDesign={backDesignRef.current} backgroundImage={backBgImage} zoomLevel={zoomLevel} />
        </div>

        {/* Side Preview (Mirror Canvases) */}

        <div className="Prouduct-mirror-container">
          <div className="Prouduct-mirror-left-container">
            <div className="corner-img-canva-container" id="mirror-container" onClick={ShowFront}>
              <canvas id="mirrorCanvasFront" width="300" height="180" ref={mirrorCanvasRef} style={{ border: ShowFrontImage ? "2px solid #005BFF" : "2px solid #D2D5D9" }} />
              <p>Front</p>
            </div>

            <div className="corner-img-canva-container" id="mirror-container" onClick={ShowBack}>
              <canvas id="mirrorCanvasBack" width="300" height="180" ref={mirrorCanvasRefForBackImage} style={{ border: ShowFrontImage ? "2px solid #D2D5D9" : "2px solid #005BFF" }} />
              <p>Back</p>
            </div>


          </div>
          <div className="zoom-container" onClick={toggleZoom}>
            {logo}
            <p>Zoom</p>
          </div>
        </div>

      </div>
    </div>

    // {startOverPopup && <StartOverConfirmationPopup onCancel={toggleStartOverPopup} />}
    // </div>
  );
}

export default ProductContainer;

