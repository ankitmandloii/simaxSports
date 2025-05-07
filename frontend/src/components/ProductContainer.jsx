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
import { Link } from 'react-router-dom';
import { undo,redo } from '../redux/FrontendDesign/TextFrontendDesignSlice';

function ProductContainer() {
  //  const textContent = useSelector((state) => state.canvas.text);
const dispatch=useDispatch()
  const mirrorCanvasRef = useRef(null);
  const mirrorCanvasRefForBackImage = useRef(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const frontDesignRef = useRef(null);
  const backDesignRef = useRef(null);

  const [ShowFrontImage,setShowFrontImage] = useState(true);
 
  const ShowFront = () => {
    if (backCanvasRef.current) {
      
      backDesignRef.current = backCanvasRef.current.toJSON();
    }
    setShowFrontImage(true); // Switch to front
  };

  const ShowBack = () => {
    if (frontCanvasRef.current) {
      frontDesignRef.current = frontCanvasRef.current.toJSON();
    }
    setShowFrontImage(false); // Switch to back
  };
 
  return (
    <div className='ProductContainerMainDiv'>
      <ul className='ProductContainerListButtton'>
        <li><button className='ProductContainerButton' onClick={() => dispatch(undo())}><span><TbArrowBack /></span>UNDO</button></li>
        <li><button className='ProductContainerButton' onClick={() => dispatch(redo())}><span><TbArrowForwardUp /></span>REDO</button></li>
        <li><button className='ProductContainerButton'>START OVER</button></li>
      </ul>
      <div className='flex'>
      <div style={{ display: ShowFrontImage ? 'block' : 'none' }}>
      <MainDesignTool  id="mirrorCanvasFront" key="front"  mirrorCanvasRef={mirrorCanvasRef}  initialDesign={frontDesignRef.current} backgroundImage={"https://media-hosting.imagekit.io/93606a2d735f49ec/Rectangle%2011.png?Expires=1840689670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JeAcKhIyA8ISWsE9K0i4ZKhwXLNPO-OoxHmavGKAjV6hi6kkkBmUmzh4Y7wbGTN0fZSoUhcBFWetg1I6I8tJ~CwoVxEWhiZ5KuXTSWMALYdLYT-64tSyZcojA-UkGYdAJUIzsrhFFmsXfa4OqNMfsrtXYRjieINgEuYv9hQRqj1gdyVBYv0hi4SV0FydjtwA3tANpzlS1QnF0wnZTC7ZYSpwx7Jg84bQJIVjaW-zXxGXzNzOwxcPZTGHREl7gX4bqQlA0KpkmIc-A8AKvIUcX3TXxoD0yIkvcHZyIGs0QpAK7s6F8jTHX68Ar~sHpCf0CvmykpMXZDR~EWvmxwZzjQ__"} />
      </div>
      <div style={{ display: !ShowFrontImage ? 'block' : 'none' }}>
        <MainDesignTool  id="mirrorCanvasBack"  key="back" mirrorCanvasRef={mirrorCanvasRefForBackImage} initialDesign={backDesignRef.current} backgroundImage={"https://media-hosting.imagekit.io/b80502a9a91e45c6/backimage-removebg-preview.png?Expires=1841212545&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kq2G5JO~Ywabga9uHMiL-44-oLs6Rm7ieWucBtm1clbYVQ5scfUH7MCysZ36Haaqi27oBDY1Lvj8m-8FtKDqAt2e2Y7ha3L2oaHAMI8UTE2E1Ge-umcASK~RD2zN1dsORj1koqTD8jKKAYqQZZJ0PYzSFa8bo1GN4GoncSi3WZHjePp3E0puP4pg17QmU~XB3cjmx5SPMIMMVtYYEFlS9nUHjiN5z7mHWIoQADHO7gS2rQ8hWdacA87NkFZXBA079GBk-e4ODNvJJuUBrnB8mLR0dvnf-EC5QflTJA6CdgQNx9VFy7uIoWt1sUa-7DTdVghl6MBFB6mnjCXS94zM6g__"} />
       </div>
        <div className='Prouduct-mirror-left-container'>
          <div className="corner-img-canva-container" id="mirror-container" onClick={ShowFront}>
            <canvas id="mirrorCanvasFront" width="300" height="180" ref={mirrorCanvasRef} />
            <p>Front</p>
          </div>
          <div className="corner-img-canva-container" id="mirror-container" onClick={ShowBack}>
            <canvas id="mirrorCanvasBack" width="300" height="180" ref={mirrorCanvasRefForBackImage} />
            <p>Back</p>
          </div>
        </div>
      </div>
      <div className='ProductContainerBottoMButtonsContainer'>
        <ul className='ProductContainerBottoMListButttons'>
          <Link to='/addText'><li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowBack /></span>ADD TEXT</button></li></Link>
          <Link to='/uploadArt'> <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowForwardUp /></span>UPLOAD ART</button></li> </Link>
          <Link to='/addArt'> <li><button className='ProductContainerSmallImageZoomButton'>ADD ART</button></li></Link>
          <Link to='/addNames'><li><button className='ProductContainerSmallImageZoomButton'>NAMES & NUMBERS</button></li></Link>
        </ul>
      </div>
    </div>
  )
}

export default ProductContainer
  