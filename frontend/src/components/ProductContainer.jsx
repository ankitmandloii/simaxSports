import React, { useEffect, useRef } from 'react'
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import './ProductContainer.css'
import { useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import MainDesignTool from './mainDesignTool';

function ProductContainer() {
    const mirrorFrontCanvasRef = useRef(null);
    const mirrorBackCanvasRef = useRef(null);
    const [isFront,setIsFront] = useState(true);
    const frontImage = "https://cdn.legacy.images.rushordertees.com/TEuvShinBtMPVWF5k1KxdWaa9gU=/294x294/eztees-catalogrebuild.s3.amazonaws.com/modelImages/cj1611_2be0_fr.jpg";
    const backImage = "https://cdn.legacy.images.rushordertees.com/HosCo29VM7F3Gtyr-e4swby14RY=/294x294/eztees-catalogrebuild.s3.amazonaws.com/modelImages/c1717_51_fr.jpg"

  return (
    <div className='ProductContainerMainDiv'>
      <ul className='ProductContainerListButtton'>
        <li><button className='ProductContainerButton'><span><TbArrowBack /></span>UNDO</button></li>
        <li><button className='ProductContainerButton'><span><TbArrowForwardUp /></span>REDO</button></li>
        <li><button className='ProductContainerButton'>START OVER</button></li>
      </ul>
      <div className='flex'>
        {/* <MainDesignTool isFront= {isFront} mirrorCanvasRef = {isFront?mirrorFrontCanvasRef:mirrorBackCanvasRef} backgroundImage={isFront?frontImage:backImage}  /> */}
        <MainDesignTool isFront= {isFront} mirrorCanvasRef = {isFront?mirrorFrontCanvasRef:mirrorBackCanvasRef} backgroundImage={isFront?frontImage:backImage} />
      <div className='Prouduct-mirror-left-container'>
      <div className="corner-img-canva-container" id="mirror-container" onClick={() => setIsFront(true)}>
          <canvas id="mirrorFrontCanvas" width="300" height="180" ref={mirrorFrontCanvasRef} />
          <p>Front</p>
        </div>
        <div className="corner-img-canva-container" id="mirror-container" onClick={() => setIsFront(false)}>
          <canvas id="mirrorBackCanvas" width="300" height="180" ref={mirrorBackCanvasRef} />
          <p>Back</p>
        </div>
      </div>
      </div>
      <div className='ProductContainerBottoMButtonsContainer'>
        <ul className='ProductContainerBottoMListButttons'>
          <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowBack /></span>ADD TEXT</button></li>
          <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowForwardUp /></span>UPLOAD ART</button></li>
          <li><button className='ProductContainerSmallImageZoomButton'>ADD ARt</button></li>
          <li><button className='ProductContainerSmallImageZoomButton'>NAMES & NUMBERS</button></li>
        </ul>
      </div>
    </div>
  )
}

export default ProductContainer