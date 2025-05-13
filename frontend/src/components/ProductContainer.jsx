import React, { useEffect, useRef } from 'react'
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import './ProductContainer.css'
import { useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import MainDesignTool from './mainDesignTool';
import { useDispatch, useSelector } from 'react-redux';
import { MagnifyGlassIcon } from './iconsSvg/CustomIcon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { undo, redo, setActiveSide } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import StartOverConfirmationPopup from './PopupComponent/StartOverPopup/StartOverPopup';

function ProductContainer() {
  const location = useLocation();
  //  const textContent = useSelector((state) => state.canvas.text);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const isQuantityPage = location.pathname === "/quantity";
  const [isDesignBack, setIsDesignBack] = useState(false);
  const [isDesignRightSleeve, seIsDesignRightSleeve] = useState(false);
  const [isDesignLeftSleeve, seIsDesignLeftSleeve] = useState(false);
  const [startOverPopup, setStartOverPopup] = useState(false);
  const mirrorCanvasRef = useRef(null);
  const mirrorCanvasRefForBackImage = useRef(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const frontDesignRef = useRef(null);
  const backDesignRef = useRef(null);

  const [ShowFrontImage, setShowFrontImage] = useState(true);

  const ShowFront = () => {
    dispatch(setActiveSide("front"));
    // navigate("/product")
    if (backCanvasRef.current) {

      backDesignRef.current = backCanvasRef.current.toJSON();
    }
    setShowFrontImage(true); // Switch to front
  };

  const ShowBack = () => {
    dispatch(setActiveSide("back"));
    // navigate("/product")

    if (frontCanvasRef.current) {
      frontDesignRef.current = frontCanvasRef.current.toJSON();
    }
    setShowFrontImage(false); // Switch to back
  };
  const closeStartOverPopup = () => {
    setStartOverPopup(!startOverPopup);
  }
  return (
    <div className='ProductContainerMainDiv'>

      <div className='flex'>
        <MainDesignTool
          id="mirrorCanvasFront"
          key="front"
          mirrorCanvasRef={mirrorCanvasRef}
          initialDesign={frontDesignRef.current}
          backgroundImage="https://media-hosting.imagekit.io/93606a2d735f49ec/Rectangle%2011.png?Expires=1840689670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JeAcKhIyA8ISWsE9K0i4ZKhwXLNPO-OoxHmavGKAjV6hi6kkkBmUmzh4Y7wbGTN0fZSoUhcBFWetg1I6I8tJ~CwoVxEWhiZ5KuXTSWMALYdLYT-64tSyZcojA-UkGYdAJUIzsrhFFmsXfa4OqNMfsrtXYRjieINgEuYv9hQRqj1gdyVBYv0hi4SV0FydjtwA3tANpzlS1QnF0wnZTC7ZYSpwx7Jg84bQJIVjaW-zXxGXzNzOwxcPZTGHREl7gX4bqQlA0KpkmIc-A8AKvIUcX3TXxoD0yIkvcHZyIGs0QpAK7s6F8jTHX68Ar~sHpCf0CvmykpMXZDR~EWvmxwZzjQ__"
        />
        <div className="product-images-details-container" style={{ display: isQuantityPage ? 'none' : 'flex' }}>
          <div className='Prouduct-mirror-left-container'>
            <div className="corner-img-canva-container" id="mirror-container" onClick={ShowFront}>
              <canvas id="mirrorCanvasFront" width="300" height="180" ref={mirrorCanvasRef} />
              <p>Front</p>
            </div>
            {/* <div className="design-side-buttons" onClick={ShowBack}> */}


              {/* {
                isDesignBack ?
                  <div className="corner-img-canva-container" id="mirror-container" onClick={ShowBack}>
                    <canvas id="mirrorCanvasBack" width="300" height="180" ref={mirrorCanvasRefForBackImage} />
                    <p>Back</p>
                  </div>
                  : <button onClick={() => setIsDesignBack(true)}>Design Back</button>

              }
            </div>
            <div className="main-sleve-container">
              <p>Sleeve design</p>
            </div> */}
            <div className="zoom-container">
              <MagnifyGlassIcon />
              <p>Zoom</p>
            </div>
          </div>



        </div>




      </div>

      {startOverPopup && <StartOverConfirmationPopup onCancel={closeStartOverPopup} />}
      {/* <div className='ProductContainerBottoMButtonsContainer'>
        <ul className='ProductContainerBottoMListButttons'>
          <Link to='/addText'><li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowBack /></span>ADD TEXT</button></li></Link>
          <Link to='/uploadArt'> <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowForwardUp /></span>UPLOAD ART</button></li> </Link>
          <Link to='/addArt'> <li><button className='ProductContainerSmallImageZoomButton'>ADD ART</button></li></Link>
          <Link to='/addNames'><li><button className='ProductContainerSmallImageZoomButton'>NAMES & NUMBERS</button></li></Link>
        </ul>
      </div> */}
    </div>
  )
}

export default ProductContainer
