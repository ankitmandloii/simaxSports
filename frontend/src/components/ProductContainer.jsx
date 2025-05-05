import React, { useEffect, useRef } from 'react'
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import './ProductContainer.css'
import { useMemo, useState } from "react";
import { fabric } from "fabric";
import icons from "../data/icons";
import MainDesignTool from './mainDesignTool';
import { useSelector } from 'react-redux';

function ProductContainer() {
  //  const textContent = useSelector((state) => state.canvas.text);
   
   const mirrorCanvasRef = useRef(null);
  return (
    <div className='ProductContainerMainDiv'>
      <ul className='ProductContainerListButtton'>
        <li><button className='ProductContainerButton'><span><TbArrowBack /></span>UNDO</button></li>
        <li><button className='ProductContainerButton'><span><TbArrowForwardUp /></span>REDO</button></li>
        <li><button className='ProductContainerButton'>START OVER</button></li>
      </ul>
      <div className='flex'>
        <MainDesignTool   mirrorCanvasRef = {mirrorCanvasRef} backgroundImage={"https://media-hosting.imagekit.io/93606a2d735f49ec/Rectangle%2011.png?Expires=1840689670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JeAcKhIyA8ISWsE9K0i4ZKhwXLNPO-OoxHmavGKAjV6hi6kkkBmUmzh4Y7wbGTN0fZSoUhcBFWetg1I6I8tJ~CwoVxEWhiZ5KuXTSWMALYdLYT-64tSyZcojA-UkGYdAJUIzsrhFFmsXfa4OqNMfsrtXYRjieINgEuYv9hQRqj1gdyVBYv0hi4SV0FydjtwA3tANpzlS1QnF0wnZTC7ZYSpwx7Jg84bQJIVjaW-zXxGXzNzOwxcPZTGHREl7gX4bqQlA0KpkmIc-A8AKvIUcX3TXxoD0yIkvcHZyIGs0QpAK7s6F8jTHX68Ar~sHpCf0CvmykpMXZDR~EWvmxwZzjQ__"} />
      <div className='Prouduct-mirror-left-container'>
      <div className="corner-img-canva-container" id="mirror-container">
          <canvas id="mirrorCanvas" width="300" height="180" ref={mirrorCanvasRef} />
          <p>Front</p>
        </div>
        <div className="corner-img-canva-container" id="mirror-container">
          {/* <canvas id="mirrorCanvas" width="300" height="180" /> */}
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