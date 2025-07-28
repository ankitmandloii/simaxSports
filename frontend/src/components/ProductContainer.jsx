import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSide, setRendering, toggleSleeveDesign } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import MainDesignTool from './Editor/mainDesignTool';
import { GrZoomOut } from "react-icons/gr";
import { BsZoomIn } from "react-icons/bs";
import { setExportedImages } from '../redux/CanvasExportDesign/canvasExportSlice';
import SleeveDesignPopup from './PopupComponent/addSleeveDesign/addSleeveDesingPopup';
import { getHexFromName } from './utils/colorUtils';
import { fetchProducts } from '../redux/ProductSlice/ProductSlice';
import { setActiveProduct, setSelectedProducts } from '../redux/ProductSlice/SelectedProductSlice';
import { useLocation, useSearchParams } from 'react-router-dom';
import style from './ProductContainer.module.css';
import RedoundoComponent from './RedoundoComponent/redoundo';
import ViewControlButtons from './controls/ViewControlButtons';
import DynamicDimensionBox from './DynamicDimensionBox/DynamicDimensionBox';

function ProductContainer() {
  const FrontImgRef = useRef(null);
  const BackImgRef = useRef(null);
  const LeftImgRef = useRef(null);
  const RightImgRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const sleevedesign = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);
  const activeProduct = useSelector((state) => state.selectedProducts.activeProduct);
  // console.log("===================activeProducttttt", activeProduct)
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  // console.log("===================selectedProducttttt", selectedProducts)


  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';

  // Extract color and images from activeProduct
  const activeProductColor = activeProduct?.selectedColor?.name || 'White';
  const frontImage = activeProduct?.selectedColor?.variant?.image?.originalSrc || activeProduct?.imgurl;
  const backImage = activeProduct?.images?.find(img => img.includes('_b_fm')) || activeProduct?.imgurl;
  const sleeveImage = activeProduct?.images?.find(img => img.includes('_d_fm')) || activeProduct?.imgurl;

  const activeProductColorHex = getHexFromName(activeProductColor);

  function invertHexColor(hex) {
    try {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
      if (hex.length !== 6) throw new Error('Invalid HEX color.');
      const inverted = (parseInt(hex, 16) ^ 0xFFFFFF).toString(16).padStart(6, '0');
      return `#${inverted.toUpperCase()}`;
    } catch (error) {
      console.error('Error inverting hex color:', error.message);
      return '#FFFFFF';
    }
  }

  const invertedColor = invertHexColor(activeProductColorHex);

  const [frontBgImage, setFrontBgImage] = useState(frontImage);
  const [backBgImage, setBackBgImage] = useState(backImage);
  const [rightSleeveBgImage, setRightSleeveBgImage] = useState(sleeveImage);
  const [leftSleeveBgImage, setLeftSleeveBgImage] = useState(sleeveImage);

  const [frontPreviewImage, setFrontPreviewImage] = useState(frontImage);
  const [backPreviewImage, setBackPreviewImage] = useState(backImage);
  const [rightSleevePreviewImage, setRightSleevePreviewImage] = useState(sleeveImage);
  const [leftSleevePreviewImage, setLeftSleevePreviewImage] = useState(sleeveImage);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [logo, setLogo] = useState(<BsZoomIn />);
  const [openSleeveDesignPopup, setOpenSleeveDesignPopup] = useState(false);
  const [addSleeves, setAddSleeves] = useState(false);
  const isDesignProduct = location.pathname === '/design/product' || location.pathname === '/quantity' || location.pathname === '/review';

  const toggleZoom = () => {
    if (isZoomedIn) {
      setZoomLevel(1);
      setLogo(<BsZoomIn />);
      setIsZoomedIn(false);
    } else {
      setZoomLevel(1.4);
      setLogo(<GrZoomOut />);
      setIsZoomedIn(true);
    }
  };

  const ShowFront = () => {
    dispatch(setActiveSide("front"));
    setTimeout(() => dispatch(setRendering()), 100);
  };

  const ShowBack = () => {
    dispatch(setActiveSide("back"));
    setTimeout(() => dispatch(setRendering()), 100);
  };

  const ShowRightSleeve = () => {
    dispatch(setActiveSide("rightSleeve"));
    setTimeout(() => dispatch(setRendering()), 100);
  };

  const ShowLeftSleeve = () => {
    dispatch(setActiveSide("leftSleeve"));
    setTimeout(() => dispatch(setRendering()), 100);
  };

  const onClose = () => setOpenSleeveDesignPopup(!openSleeveDesignPopup);
  const onAddDesign = () => {
    dispatch(toggleSleeveDesign());
    setAddSleeves(true);
    onClose();
  };

  const { list: rawProducts } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (Array.isArray(selectedProducts) && selectedProducts.length !== 0) return;

    const productId = "7436541264006"; // Updated to match activeProduct id
    const initialProduct = rawProducts.filter((p) => p.id === `gid://shopify/Product/${productId}`);
    if (initialProduct.length > 0) {
      dispatch(setSelectedProducts(initialProduct));
      dispatch(setActiveProduct(initialProduct[0]));
    }
  }, [rawProducts, dispatch, selectedProducts]);

  // Extract images from metafields
  useEffect(() => {
    if (!activeProduct?.selectedColor?.variant?.metafields?.edges) {
      setFrontBgImage(activeProduct?.imgurl);
        setBackBgImage(activeProduct?.imgurl);
        setLeftSleeveBgImage(activeProduct?.imgurl);
        setRightSleeveBgImage(activeProduct?.imgurl);

        setFrontPreviewImage(activeProduct?.imgurl);
        setBackPreviewImage(activeProduct?.imgurl);
        setLeftSleevePreviewImage(activeProduct?.imgurlft);
        setRightSleevePreviewImage(activeProduct?.imgurl);
    }else{
        const variantMetafields = activeProduct.selectedColor.variant.metafields.edges.find(
      (edge) => edge?.node?.key === 'variant_images'
    )?.node?.value;

    if (variantMetafields) {
      try {
        const parsedImages = JSON.parse(variantMetafields);

        const front = parsedImages.find(img => img.src.includes('_f_fm'))?.src || frontImage;
        const back = parsedImages.find(img => img.src.includes('_b_fm'))?.src || backImage;
        const left = parsedImages.find(img => img.src.includes('_d_fm'))?.src || sleeveImage;
        const right = parsedImages.find(img => img.src.includes('_d_fm'))?.src || sleeveImage;

        setFrontBgImage(front);
        setBackBgImage(back);
        setLeftSleeveBgImage(left);
        setRightSleeveBgImage(right);

        setFrontPreviewImage(front);
        setBackPreviewImage(back);
        setLeftSleevePreviewImage(left);
        setRightSleevePreviewImage(right);
      } catch (err) {
        console.error('Failed to parse metafields variant_images:', err);
        // Fallback to default images
        setFrontBgImage(frontImage);
        setBackBgImage(backImage);
        setLeftSleeveBgImage(sleeveImage);
        setRightSleeveBgImage(sleeveImage);
        setFrontPreviewImage(frontImage);
        setBackPreviewImage(backImage);
        setLeftSleevePreviewImage(sleeveImage);
        setRightSleevePreviewImage(sleeveImage);
      }
    } else {
      // Fallback if no metafields
      setFrontBgImage(frontImage);
      setBackBgImage(backImage);
      setLeftSleeveBgImage(sleeveImage);
      setRightSleeveBgImage(sleeveImage);
      setFrontPreviewImage(frontImage);
      setBackPreviewImage(backImage);
      setLeftSleevePreviewImage(sleeveImage);
      setRightSleevePreviewImage(sleeveImage);
    }
      
    }

  
  }, [activeProduct, frontImage, backImage, sleeveImage]);

  useEffect(() => {
    if (exportRequested) {
      const front = FrontImgRef.current?.src || null;
      const back = BackImgRef.current?.src || null;
      const left = LeftImgRef.current?.src || null;
      const right = RightImgRef.current?.src || null;

      const exportData = {
        front,
        back,
        leftSleeve: left,
        rightSleeve: right,
      };

      dispatch(setExportedImages(exportData));
    }
  }, [exportRequested, dispatch]);

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
          />
          {/* <DynamicDimensionBox /> */}
        </div>

        <div style={{ display: activeSide === "front" ? "block" : "none" }}>
          <MainDesignTool
            warningColor={invertedColor}
            id="front"
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
            id="back"
            key="back"
            backgroundImage={backBgImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setBackPreviewImage={setBackPreviewImage}
            setLeftSleevePreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
          />
        </div>

        <div style={{ display: activeSide === "rightSleeve" ? "block" : "none" }}>
          <MainDesignTool
            warningColor={invertedColor}
            id="rightSleeve"
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
            id="leftSleeve"
            key="leftSleeve"
            backgroundImage={leftSleeveBgImage}
            zoomLevel={zoomLevel}
            setFrontPreviewImage={() => { }}
            setBackPreviewImage={() => { }}
            setRightSleevePreviewImage={() => { }}
            setLeftSleevePreviewImage={setLeftSleevePreviewImage}
          />
        </div>

        {!isQuantityPage && (
          <div className={style.ProuductMirrorContainer}>
            <div className={style.ProuductMirrorLeftContainer}>
              <div className={style.cornerImgCanvaContainer} onClick={ShowFront}>
                <img
                  ref={FrontImgRef}
                  src={frontPreviewImage}
                  className={`${style.ProductContainerSmallImage} ${activeSide === "front" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
                  alt="Front View"
                />
                <p>Front</p>
              </div>
              <div className={style.cornerImgCanvaContainer} onClick={ShowBack}>
                <img
                  ref={BackImgRef}
                  src={backPreviewImage}
                  className={`${style.ProductContainerSmallImage} ${activeSide === "back" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
                  alt="Back View"
                />
                <p>Back</p>
              </div>

              {addSleeves && (
                <>
                  <div className={style.cornerImgCanvaContainer} onClick={ShowRightSleeve}>
                    <img
                      ref={LeftImgRef}
                      src={rightSleevePreviewImage}
                      className={`${style.ProductContainerSmallImage} ${activeSide === "rightSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
                      alt="Right Sleeve"
                    />
                    <p>Right Sleeve</p>
                  </div>
                  <div className={style.cornerImgCanvaContainer} onClick={ShowLeftSleeve}>
                    <img
                      ref={RightImgRef}
                      src={leftSleevePreviewImage}
                      className={`${style.ProductContainerSmallImage} ${activeSide === "leftSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`}
                      alt="Left Sleeve"
                    />
                    <p>Left Sleeve</p>
                  </div>
                </>
              )}

              {openSleeveDesignPopup && <SleeveDesignPopup onClose={onClose} onAddDesign={onAddDesign} />}
            </div>

            {!addSleeves && (
              <div className={style.sleeveDesignButn} onClick={onClose}>
                <p>Sleeve design</p>
              </div>
            )}

            <div className={style.zoomContainer} onClick={toggleZoom}>
              {logo}
              <p>Zoom</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductContainer;