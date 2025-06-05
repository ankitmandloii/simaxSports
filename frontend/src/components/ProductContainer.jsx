import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSide, setRendering, toggleSleeveDesign } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import MainDesignTool from './mainDesignTool';
import { GrZoomOut } from "react-icons/gr";
import { BsZoomIn } from "react-icons/bs";
import { MagnifyGlassIcon } from './iconsSvg/CustomIcon';
import { setExportedImages } from '../redux/CanvasExportDesign/canvasExportSlice';
import SleeveDesignPopup from './PopupComponent/addSleeveDesign/addSleeveDesingPopup';
import { getHexFromName } from './utils/colorUtils';
import { fetchProducts } from '../redux/ProductSlice/ProductSlice';
import { setSelectedProducts } from '../redux/ProductSlice/SelectedProductSlice';
import { useSearchParams } from 'react-router-dom';
import style from './ProductContainer.module.css'
import RedoundoComponent from './RedoundoComponent/redoundo';
import ViewControlButtons from './controls/ViewControlButtons';

function ProductContainer() {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const sleevedesignn = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);
  const selectedProducts = useSelector(state => state.selectedProducts.selectedProducts);
  const frontImage = useSelector(state => state?.selectedProducts?.activeProduct?.imgurl);
  const backImage = useSelector(state => state?.selectedProducts?.activeProduct?.colors?.[1]?.img);


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


  const [frontBgImage, setFrontBgImage] = useState(null);
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
      setZoomLevel(1);
      setLogo(<BsZoomIn />);
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
    dispatch(toggleSleeveDesign());

    setAddSleeves(true);
    onClose();
  };


  // useEffect(() => {
  //   setBackBgImage(frontImage);
  //   setBackPreviewImage(frontImage);
  // }, [backImage]);


  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(selectedProducts) && selectedProducts.length !== 0) return;

    const productId = "8847707537647"; // "8847707537647"
    // console.log("productId", productId);
    // console.log(rawProducts, "productId")
    const initialProduct = rawProducts.filter((p) => p.id == `gid://shopify/Product/${productId}`);
    // console.log("initiale Product", initialProduct);
    dispatch(setSelectedProducts(initialProduct));
    // dispatch(setCurrentProductId(initialProduct[0]?.id));
    // dispatch(addProductDesignState({ productId: initialProduct[0]?.id }))
    if (initialProduct.length > 0) {
      const img = initialProduct[0].imgurl;
      setFrontBgImage(img);
      setBackBgImage(img);
      setLeftSleeveBgImage(img);
      setRightSleeveBgImage(img);

      setFrontPreviewImage(img);
      setLeftSleevePreviewImage(img);
      setRightSleevePreviewImage(img);
      setBackPreviewImage(img);
    }
  }, [rawProducts])

  useEffect(() => {
    setFrontBgImage(frontImage);
    setBackBgImage(frontImage);
    setLeftSleeveBgImage(frontImage);
    setRightSleeveBgImage(frontImage);

    setFrontPreviewImage(frontImage);
    setLeftSleevePreviewImage(frontImage);
    setRightSleevePreviewImage(frontImage);
    setBackPreviewImage(frontImage);

  }, [frontImage]);

  // if (rawProducts.length == 0) {
  //  return (
  //   <div className="fullscreen-loader" style={{ flexDirection: 'column' }}>
  //     <p style={{ marginBottom: 20, fontSize: 15, color: '#555',fontWeight:"700" }}>Let's create something greate today</p>
  //     <div className="loader-spinner"></div>
  //   </div>
  // );
  // }

  return (
    <div className={style.ProductContainerMainDiv}>
      <div className={style.flex}>
        <div className={style.controllContainer}>
          <RedoundoComponent />
          <ViewControlButtons
            ShowBack={ShowBack}
            ShowFront={ShowFront}
            ShowLeftSleeve={ShowLeftSleeve}
            ShowRightSleeve={ShowRightSleeve}
            toggleZoom={toggleZoom}
            logo={logo}
          ></ViewControlButtons>
        </div>
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
            backgroundImage={backBgImage}
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
            backgroundImage={rightSleeveBgImage}
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
            backgroundImage={leftSleeveBgImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setBackPreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
            setLeftSleevePreviewImage={setLeftSleevePreviewImage}
          />
        </div>

        {/* Side Preview Thumbnails */}
        <div className={style.ProuductMirrorContainer} >
          <div className={style.ProuductMirrorLeftContainer}>

            <div className={style.cornerImgCanvaContainer} onClick={ShowFront}>
              <img
                src={frontPreviewImage}
                className={`${style.ProductContainerSmallImage} ${activeSide === "front" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
              />

              <p>Front</p>
            </div>

            <div className={style.cornerImgCanvaContainer} onClick={ShowBack} >
              <img
                src={backPreviewImage}
                className={`${style.ProductContainerSmallImage} ${activeSide === "back" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
              />
              <p>Back</p>
            </div>

            {
              addSleeves &&
              <>
                <div className={style.cornerImgCanvaContainer} onClick={ShowRightSleeve}  >
                  <img
                    src={rightSleevePreviewImage}
                    className={`${style.ProductContainerSmallImage} ${activeSide === "rightSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
                  />
                  <p>Right Sleeve</p>
                </div>
                <div className={style.cornerImgCanvaContainer} onClick={ShowLeftSleeve}  >
                  <img
                    src={leftSleevePreviewImage}
                    className={`${style.ProductContainerSmallImage} ${activeSide === "leftSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
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
            <div className={style.zoomContainer} onClick={onClose}>
              <p>SLEEVES & MORE</p>
            </div>
          }

          <div className={style.zoomContainer} onClick={toggleZoom}>
            {logo}
            <p>Zoom</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductContainer;