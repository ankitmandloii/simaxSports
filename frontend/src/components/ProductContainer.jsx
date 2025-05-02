import React, { useEffect, useRef } from 'react'
import { TbArrowForwardUp } from "react-icons/tb";
import { TbArrowBack } from "react-icons/tb";
import { VscZoomIn } from "react-icons/vsc";
import './ProductContainer.css'

function ProductContainer() {

  const mainCanvasRef = useRef(null);
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);


  // Utility function to load an image and draw it to a canvas
  const loadImageToCanvas = (canvas, imageSrc, width, height) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear before redraw
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    if (mainCanvasRef.current) {
      loadImageToCanvas(mainCanvasRef.current, 'https://media-hosting.imagekit.io/93606a2d735f49ec/Rectangle%2011.png?Expires=1840689670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JeAcKhIyA8ISWsE9K0i4ZKhwXLNPO-OoxHmavGKAjV6hi6kkkBmUmzh4Y7wbGTN0fZSoUhcBFWetg1I6I8tJ~CwoVxEWhiZ5KuXTSWMALYdLYT-64tSyZcojA-UkGYdAJUIzsrhFFmsXfa4OqNMfsrtXYRjieINgEuYv9hQRqj1gdyVBYv0hi4SV0FydjtwA3tANpzlS1QnF0wnZTC7ZYSpwx7Jg84bQJIVjaW-zXxGXzNzOwxcPZTGHREl7gX4bqQlA0KpkmIc-A8AKvIUcX3TXxoD0yIkvcHZyIGs0QpAK7s6F8jTHX68Ar~sHpCf0CvmykpMXZDR~EWvmxwZzjQ__', 1550, 1000);
    }
  }, []);

   // Front small view
   useEffect(() => {
    if (frontCanvasRef.current) {
      loadImageToCanvas(frontCanvasRef.current, 'https://media-hosting.imagekit.io/4570272ec5ff4b32/print-area-preview%20(1).png?Expires=1840690543&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=txGxSmU8hBTVjLgZQ6OsGAMdjOBRGS7COHqW5X7j055QDA3grzJnuybisR4jMv05WsNwewxRb4CWNr0ECd~rbT4VO~Yob42Pv5WaZkmvBpN-AmiXvNHWFZeEvApifCNCzt2P1A0yXocN9YbupjHIP7Q7RHDjLRS-YFIUOS0sxnrURrTfZ4lm7XolO1QLYYf1NDfYfIYyG1-NhduQ4~t5gJP6LaSAChQpFBfFHArat3SAENipDBhtIzzxH7P5Nc5G0uSmp4rlSKMzyaUL~ZGD~LEHO5QEaDJzetoEU6bl3m0tnsJrQ~FyCXWbrIy9Fj1i8TN0Z7kw-SUQkcWG24QZLA__', 100, 100);
    }
  }, []);

  // Back small view
  useEffect(() => {
    if (backCanvasRef.current) {
      loadImageToCanvas(backCanvasRef.current, 'https://media-hosting.imagekit.io/4570272ec5ff4b32/print-area-preview%20(1).png?Expires=1840690543&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=txGxSmU8hBTVjLgZQ6OsGAMdjOBRGS7COHqW5X7j055QDA3grzJnuybisR4jMv05WsNwewxRb4CWNr0ECd~rbT4VO~Yob42Pv5WaZkmvBpN-AmiXvNHWFZeEvApifCNCzt2P1A0yXocN9YbupjHIP7Q7RHDjLRS-YFIUOS0sxnrURrTfZ4lm7XolO1QLYYf1NDfYfIYyG1-NhduQ4~t5gJP6LaSAChQpFBfFHArat3SAENipDBhtIzzxH7P5Nc5G0uSmp4rlSKMzyaUL~ZGD~LEHO5QEaDJzetoEU6bl3m0tnsJrQ~FyCXWbrIy9Fj1i8TN0Z7kw-SUQkcWG24QZLA__', 100, 100);
    }
  }, []);

//  const imageUrl = 'https://media-hosting.imagekit.io/93606a2d735f49ec/Rectangle 11.png?Expires=1840689670&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=JeAcKhIyA8ISWsE9K0i4ZKhwXLNPO-OoxHmavGKAjV6hi6kkkBmUmzh4Y7wbGTN0fZSoUhcBFWetg1I6I8tJ~CwoVxEWhiZ5KuXTSWMALYdLYT-64tSyZcojA-UkGYdAJUIzsrhFFmsXfa4OqNMfsrtXYRjieINgEuYv9hQRqj1gdyVBYv0hi4SV0FydjtwA3tANpzlS1QnF0wnZTC7ZYSpwx7Jg84bQJIVjaW-zXxGXzNzOwxcPZTGHREl7gX4bqQlA0KpkmIc-A8AKvIUcX3TXxoD0yIkvcHZyIGs0QpAK7s6F8jTHX68Ar~sHpCf0CvmykpMXZDR~EWvmxwZzjQ__';
 

// const canvasRef = useRef(null);


  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   const img = new Image();
  //   img.crossOrigin = 'anonymous'; // If image is from external URL
  //   img.src = imageUrl;

  //   img.onload = () => {
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0);
  //   };

  //   img.onerror = () => {
  //     console.error('Failed to load the image.');
  //   };
  // }, [imageUrl]);


  return (
    <div className='ProductContainerMainDiv'>
      <ul className='ProductContainerListButtton'>
        <li><button className='ProductContainerButton'><span><TbArrowBack /></span>UNDO</button></li>
        <li><button className='ProductContainerButton'><span><TbArrowForwardUp /></span>REDO</button></li>
        <li><button  className='ProductContainerButton'>START OVER</button></li>
      </ul>
 

      <div className='ProductContainerBigAndSmallImageContainer'>
     
     
      <div className='ProductContainerBigImage'>
      <canvas id="product-canvas" ref={mainCanvasRef}></canvas>
    </div>




     <div>
      <div className='ProductContainerSmallImage'>
        <div className='ProductContainerSmallImage'> <canvas ref={frontCanvasRef} className="SmallCanvas" /><p>Front</p></div>
        <div className='ProductContainerSmallImage'><canvas ref={backCanvasRef} className="SmallCanvas" /><p>Back</p></div>
        <div className='ProductContainerSmallImageZoomButton'><span><VscZoomIn /></span>ZOOM</div>
      </div>
     </div>
     
     
     </div>

  <div className='ProductContainerBottoMButtonsContainer'>
  <ul className='ProductContainerBottoMListButttons'>
        <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowBack /></span>ADD TEXT</button></li>
        <li><button className='ProductContainerSmallImageZoomButton'><span><TbArrowForwardUp /></span>UPLOAD ART</button></li>
        <li><button  className='ProductContainerSmallImageZoomButton'>ADD ARt</button></li>
        <li><button  className='ProductContainerSmallImageZoomButton'>NAMES & NUMBERS</button></li>
      </ul>
  </div>



    </div>
  )
}

export default ProductContainer