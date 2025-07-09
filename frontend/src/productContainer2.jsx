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
import style from './ProductContainer.module.css'
import RedoundoComponent from './RedoundoComponent/redoundo';
import ViewControlButtons from './controls/ViewControlButtons';

function ProductContainer() {
  const FrontImgRef = useRef(null);
  const BackImgRef = useRef(null);
  const LeftImgRef = useRef(null);
  const RightImgRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const sleevedesignn = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);
  const activeProduct = useSelector((state) => state.selectedProducts.activeProduct);
  const frontImage = activeProduct?.imgurl;
  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';

  const invertHexColor = (hex) => {
    try {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
      if (hex.length !== 6) throw new Error('Invalid HEX color.');
      return `#${(parseInt(hex, 16) ^ 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`;
    } catch {
      return '#FFFFFF';
    }
  }

  const activeProductColor = activeProduct?.selectedColor?.name;
  const activeProductColorHex = getHexFromName(activeProductColor);
  const invertedColor = invertHexColor(activeProductColorHex);

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
  const isDesignProduct = location.pathname === '/design/product' || location.pathname === '/quantity' || location.pathname === '/review';

  const toggleZoom = () => {
    setZoomLevel(isZoomedIn ? 1 : 1.4);
    setLogo(isZoomedIn ? <BsZoomIn /> : <GrZoomOut />);
    setIsZoomedIn(!isZoomedIn);
  };

  const ShowFront = () => { dispatch(setActiveSide("front")); setTimeout(() => setRendering(), 100); };
  const ShowBack = () => { dispatch(setActiveSide("back")); setTimeout(() => setRendering(), 100); };
  const ShowRightSleeve = () => { dispatch(setActiveSide("rightSleeve")); setTimeout(() => setRendering(), 100); };
  const ShowLeftSleeve = () => { dispatch(setActiveSide("leftSleeve")); setTimeout(() => setRendering(), 100); };

  const onClose = () => setOpenSleeveDesignUPopup(!OpenSleeveDesignUPopup);
  const onAddDesign = () => { dispatch(toggleSleeveDesign()); setAddSleeves(true); onClose(); };

  const { list: rawProducts } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (activeProduct) return;

    const initialProduct = rawProducts.filter(p => p.id == `gid://shopify/Product/7425257996422`);
    dispatch(setSelectedProducts(initialProduct));
    dispatch(setActiveProduct(initialProduct[0]));

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
  }, [rawProducts]);

  useEffect(() => {
    if (!activeProduct) return;

    const selectedColor = activeProduct?.selectedColor || activeProduct?.colors?.[0];
    const variant = selectedColor?.variant;
    if (!variant) return;

    const metafield = variant?.metafields?.edges?.find(
      edge => edge?.node?.key === "variant_images"
    );

    if (!metafield) return;

    let images = [];
    try {
      images = JSON.parse(metafield.node.value);
    } catch (err) {
      console.error("Failed to parse variant_images JSON", err);
    }

    const frontImage = images.find(img => img.src.includes("_f_") || img.altText.toLowerCase().includes("front"));
    const backImage = images.find(img => img.src.includes("_b_") || img.altText.toLowerCase().includes("back"));
    const leftSleeveImage = images.find(img => img.src.includes("_d_") || img.altText.toLowerCase().includes("left"));
    const rightSleeveImage = images.find(img => img.src.includes("_d_") || img.altText.toLowerCase().includes("right"));

    setFrontBgImage(frontImage?.src || selectedColor.img);
    setBackBgImage(backImage?.src || selectedColor.img);
    setLeftSleeveBgImage(leftSleeveImage?.src || selectedColor.img);
    setRightSleeveBgImage(rightSleeveImage?.src || selectedColor.img);
    setFrontPreviewImage(frontImage?.src || selectedColor.img);
    setBackPreviewImage(backImage?.src || selectedColor.img);
    setLeftSleevePreviewImage(leftSleeveImage?.src || selectedColor.img);
    setRightSleevePreviewImage(rightSleeveImage?.src || selectedColor.img);
  }, [activeProduct]);

  useEffect(() => {
    if (exportRequested) {
      dispatch(setExportedImages({
        front: FrontImgRef.current?.src || null,
        back: BackImgRef.current?.src || null,
        leftSleeve: LeftImgRef.current?.src || null,
        rightSleeve: RightImgRef.current?.src || null,
      }));
    }
  }, [exportRequested]);

  return (
    <div className={style.ProductContainerMainDiv}>
      <div className={style.flex}>
        <div className={style.controllContainer}>
          {!isDesignProduct && <RedoundoComponent />}
          <ViewControlButtons
            ShowBack={ShowBack}
            ShowFront={ShowFront}
            ShowLeftSleeve={ShowLeftSleeve}
            ShowRightSleeve={ShowRightSleeve}
            toggleZoom={toggleZoom}
            logo={logo}
          />
        </div>

        {/* Design Views */}
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

        {/* Preview Thumbnails */}
        {!isQuantityPage && (
          <div className={style.ProuductMirrorContainer}>
            <div className={style.ProuductMirrorLeftContainer}>
              <div className={style.cornerImgCanvaContainer} onClick={ShowFront}>
                <img ref={FrontImgRef} src={frontPreviewImage} className={`${style.ProductContainerSmallImage} ${activeSide === "front" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`} />
                <p>Front</p>
              </div>
              <div className={style.cornerImgCanvaContainer} onClick={ShowBack}>
                <img ref={BackImgRef} src={backPreviewImage} className={`${style.ProductContainerSmallImage} ${activeSide === "back" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`} />
                <p>Back</p>
              </div>

              {addSleeves && <>
                <div className={style.cornerImgCanvaContainer} onClick={ShowRightSleeve}>
                  <img ref={LeftImgRef} src={rightSleevePreviewImage} className={`${style.ProductContainerSmallImage} ${activeSide === "rightSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`} />
                  <p>Right Sleeve</p>
                </div>
                <div className={style.cornerImgCanvaContainer} onClick={ShowLeftSleeve}>
                  <img ref={RightImgRef} src={leftSleevePreviewImage} className={`${style.ProductContainerSmallImage} ${activeSide === "leftSleeve" ? `${style["hover-active"]} ${style["activeBorder"]}` : ""}`} />
                  <p>Left Sleeve</p>
                </div>
              </>}

              {OpenSleeveDesignUPopup && <SleeveDesignPopup onClose={onClose} onAddDesign={onAddDesign} />}
            </div>

            {!addSleeves &&
              <div className={style.sleeveDesignButn} onClick={onClose}>
                <p>Sleeve design</p>
              </div>
            }

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
