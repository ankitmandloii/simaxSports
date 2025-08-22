import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSide, setRendering, toggleSleeveDesign } from '../redux/FrontendDesign/TextFrontendDesignSlice';
import MainDesignTool from './Editor/mainDesignTool';
import { GrZoomOut } from "react-icons/gr";
import { BsFillFastForwardBtnFill, BsZoomIn } from "react-icons/bs";
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
  const BASE_URL = process.env.REACT_APP_BASE_URL || "https://simax-sports-x93p.vercel.app/api/";


  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const sleevedesign = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  const exportRequested = useSelector((state) => state.canvasExport.exportRequested);
  const activeProduct = useSelector((state) => state.selectedProducts.activeProduct);
  // console.log("----activeProduct in prodyuctContainer", activeProduct)
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);

  const isQuantityPage = location.pathname === "/quantity" || location.pathname === '/review';

  const activeProductColor = activeProduct?.selectedColor?.name || 'White';
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
  const [activeProductTitle, setActiveProductTitle] = useState("");
  const [frontBgImage, setFrontBgImage] = useState('');
  const [backBgImage, setBackBgImage] = useState('');
  const [rightSleeveBgImage, setRightSleeveBgImage] = useState('');
  const [leftSleeveBgImage, setLeftSleeveBgImage] = useState('');

  const [frontPreviewImage, setFrontPreviewImage] = useState('');
  const [backPreviewImage, setBackPreviewImage] = useState('');
  const [rightSleevePreviewImage, setRightSleevePreviewImage] = useState('');
  const [leftSleevePreviewImage, setLeftSleevePreviewImage] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [logo, setLogo] = useState(<BsZoomIn />);
  const [openSleeveDesignPopup, setOpenSleeveDesignPopup] = useState(false);
  const [addSleeves, setAddSleeves] = useState(false);
  const isDesignProduct = location.pathname === '/design/product' || location.pathname === '/quantity' || location.pathname === '/review';
  const [searchParams] = useSearchParams();

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
  const fetchProductById = async (productId) => {
    try {
      const res = await fetch(`${BASE_URL}design/productById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      console.log("----data", data);

      const productNode = data?.result?.products?.edges?.[0]?.node;
      if (!productNode) return;

      // ✅ Group variants by color (unique colors only)
      const colorMap = {};
      productNode.variants.edges.forEach(({ node }) => {
        const colorOption = node.selectedOptions.find(opt => opt.name === "Color");
        if (!colorOption) return; // skip if no color

        const colorName = colorOption.value;

        if (!colorMap[colorName]) {
          colorMap[colorName] = {
            name: colorName,
            img: node.image?.originalSrc || "",
            variant: node, // keep first variant for image ref
            sizes: [],     // collect all sizes of this color
          };
        }

        // collect sizes under this color
        const sizeOption = node.selectedOptions.find(opt => opt.name === "Size");
        if (sizeOption) {
          colorMap[colorName].sizes.push({
            size: sizeOption.value,
            variant: node,
          });
        }
      });

      const colors = Object.values(colorMap);
      if (colors.length === 0) return;

      // Process colors (same logic as before)
      const updatedColors = colors.map(color => {
        let swatchImg = "";
        let variantImg = "";
        let selectedImage = "";

        const variant = color?.variant;
        const variantImagesMetafield = variant?.metafields?.edges?.find(
          edge => edge.node.key === "variant_images" && edge.node.namespace === "custom"
        );

        if (variantImagesMetafield?.node?.value) {
          try {
            const parsedImages = JSON.parse(variantImagesMetafield.node.value);
            if (Array.isArray(parsedImages)) {
              const colorKey = color.name?.toLowerCase().replace(/\s+/g, "") || "";
              swatchImg =
                parsedImages.find(img => img.toLowerCase().includes(colorKey)) ||
                parsedImages[3] ||
                parsedImages[0] ||
                "";
              variantImg = parsedImages[0] || color.img || "";
              selectedImage = variantImg;
            }
          } catch (error) {
            console.warn("Failed to parse variant_images metafield:", error);
          }
        }

        // fallback
        const fallbackImage =
          color.img ||
          variant?.image?.originalSrc ||
          productNode.images?.edges?.[0]?.node?.originalSrc ||
          "";
        swatchImg = swatchImg || fallbackImage;
        variantImg = variantImg || fallbackImage;
        selectedImage = selectedImage || fallbackImage;

        return { ...color, swatchImg, variantImg };
      });

      // Pick first color as selected
      const firstColor = updatedColors[0];
      const initialProductWithColor = {
        id: productNode.id,
        name: productNode.title,
        tags: productNode.tags,
        images: productNode.images.edges.map(edge => edge.node),
        colors: updatedColors,
        selectedColor: firstColor,
        selectedImage: firstColor.variantImg,
        imgurl: firstColor.variantImg,
      };
      console.log("initialProductWithColor", initialProductWithColor);

      dispatch(setSelectedProducts([initialProductWithColor]));
      dispatch(setActiveProduct(initialProductWithColor));
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };



  // const fetchProductById = async (productId) => {
  //   try {
  //     const res = await fetch(`https://f1616cdb9135.ngrok-free.app/api/products/productById`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ productId }), // 👈 must match curl
  //     });

  //     if (!res.ok) throw new Error("Failed to fetch product");
  //     const productData = await res.json();
  //     const productNode = productData?.result?.products?.edges?.[0]?.node;
  //     if (!productNode) return;

  //     // Map variants into "colors"
  //     const colors = productNode.variants.edges.map(({ node }) => {
  //       const colorOption = node.selectedOptions.find(opt => opt.name === "Color");
  //       return {
  //         name: colorOption?.value || "Default",
  //         img: node.image?.originalSrc || "",
  //         variant: node, // keep full variant for later
  //       };
  //     });

  //     if (colors.length === 0) return;

  //     // Process colors just like before
  //     const updatedColors = colors.map(color => {
  //       let swatchImg = "";
  //       let variantImg = "";
  //       let selectedImage = "";

  //       const variant = color?.variant;
  //       const variantImagesMetafield = variant?.metafields?.edges?.find(
  //         edge => edge.node.key === "variant_images" && edge.node.namespace === "custom"
  //       );

  //       if (variantImagesMetafield?.node?.value) {
  //         try {
  //           const parsedImages = JSON.parse(variantImagesMetafield.node.value);
  //           if (Array.isArray(parsedImages)) {
  //             const colorKey = color.name?.toLowerCase().replace(/\s+/g, "") || "";
  //             swatchImg =
  //               parsedImages.find(img => img.toLowerCase().includes(colorKey)) ||
  //               parsedImages[3] ||
  //               parsedImages[0] ||
  //               "";
  //             variantImg = parsedImages[0] || color.img || "";
  //             selectedImage = variantImg;
  //           }
  //         } catch (error) {
  //           console.warn("Failed to parse variant_images metafield:", error);
  //         }
  //       }

  //       // fallback
  //       const fallbackImage =
  //         color.img || variant?.image?.originalSrc || productNode.images?.edges?.[0]?.node?.originalSrc || "";
  //       swatchImg = swatchImg || fallbackImage;
  //       variantImg = variantImg || fallbackImage;
  //       selectedImage = selectedImage || fallbackImage;

  //       return { ...color, swatchImg, variantImg };
  //     });

  //     // Pick first color as selected
  //     const firstColor = updatedColors[0];
  //     const initialProductWithColor = {
  //       id: productNode.id,
  //       name: productNode.title,
  //       tags: productNode.tags,
  //       images: productNode.images.edges.map(edge => edge.node),
  //       colors: updatedColors,
  //       selectedColor: firstColor,
  //       selectedImage: firstColor.variantImg,
  //       imgurl: firstColor.variantImg,
  //     };

  //     dispatch(setSelectedProducts([initialProductWithColor]));
  //     dispatch(setActiveProduct(initialProductWithColor)); catch (error) {
  //       console.warn("Failed to parse variant_images metafield:", error);
  //     }
  //   }

  //       // Fallbacks
  //       const fallbackImage =
  //     color.img || variant?.image?.originalSrc || productData.images?.[0] || "";
  //   swatchImg = swatchImg || fallbackImage;
  //   variantImg = variantImg || fallbackImage;
  //   selectedImage = selectedImage || fallbackImage;

  //   return {
  //     ...color,
  //     swatchImg,
  //     variantImg,
  //   };
  // });

  // Pick first color as selected
  //   const firstColor = updatedColors[0];
  //   const initialProductWithColor = {
  //     ...productData,
  //     colors: updatedColors,
  //     selectedColor: firstColor,
  //     selectedImage: firstColor.variantImg,
  //     imgurl: firstColor.variantImg,
  //   };

  //   dispatch(setSelectedProducts([initialProductWithColor]));
  //   dispatch(setActiveProduct(initialProductWithColor));
  // } catch (err) {
  //   console.error("Error fetching product:", err);
  // }
  //   };
  // initail with color swatch
  // useEffect(() => {
  //   if (Array.isArray(selectedProducts) && selectedProducts.length !== 0) return;
  //   if (!rawProducts || rawProducts.length === 0) return;

  //   const firstProduct = rawProducts[0];
  //   if (!firstProduct || !Array.isArray(firstProduct.colors) || firstProduct.colors.length === 0) return;

  //   // Map colors with swatchImg and variantImg
  //   const updatedColors = firstProduct.colors.map(color => {
  //     let swatchImg = '';
  //     let variantImg = '';
  //     let selectedImage = '';

  //     const variant = color?.variant;

  //     const variantImagesMetafield = variant?.metafields?.edges?.find(
  //       edge => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
  //     );

  //     if (variantImagesMetafield?.node?.value) {
  //       try {
  //         const parsedImages = JSON.parse(variantImagesMetafield.node.value);
  //         //  console.log("-----------parseimgaes33",parsedImages)
  //         if (Array.isArray(parsedImages)) {
  //           console.log("-----------parseimgaes", parsedImages)
  //           const colorKey = color.name?.toLowerCase().replace(/\s+/g, '') || '';
  //           swatchImg =
  //             parsedImages.find(img => img.toLowerCase().includes(colorKey)) ||
  //             parsedImages[3] ||
  //             parsedImages[0] ||
  //             '';
  //           variantImg = parsedImages[0] || color.img || '';
  //           selectedImage = variantImg;
  //         }
  //       } catch (error) {
  //         console.warn('Failed to parse variant_images metafield:', error);
  //       }
  //     }

  //     // Fallback
  //     const fallbackImage =
  //       color.img || variant?.image?.originalSrc || firstProduct.images?.[0] || '';
  //     swatchImg = swatchImg || fallbackImage;
  //     variantImg = variantImg || fallbackImage;
  //     selectedImage = selectedImage || fallbackImage;

  //     return {
  //       ...color,
  //       swatchImg,
  //       variantImg,
  //     };
  //   });

  //   // Pick first color as selected
  //   const firstColor = updatedColors[0];
  //   const initialProductWithColor = {
  //     ...firstProduct,
  //     colors: updatedColors,
  //     selectedColor: firstColor,
  //     selectedImage: firstColor.variantImg,
  //     imgurl: firstColor.variantImg,
  //   };

  //   dispatch(setSelectedProducts([initialProductWithColor]));
  //   dispatch(setActiveProduct(initialProductWithColor));
  // }, [rawProducts, dispatch, selectedProducts]);

  useEffect(() => {
    const productId = searchParams.get("id");
    if (!productId) return;
    fetchProductById(productId);
  }, [searchParams, dispatch]);



  // Initialize the first product and its first color variant
  // useEffect(() => {
  //   if (Array.isArray(selectedProducts) && selectedProducts.length !== 0) return;

  //   if (rawProducts && rawProducts.length > 0) {
  //     const firstProduct = rawProducts[1];
  //     const firstColor = firstProduct.colors[1];
  //     const initialProductWithColor = {
  //       ...firstProduct,
  //       selectedColor: firstColor,
  //     };
  //     dispatch(setSelectedProducts([initialProductWithColor]));
  //     dispatch(setActiveProduct(initialProductWithColor));
  //   }
  // }, [rawProducts, dispatch, selectedProducts]);

  // Extract images from metafields
  // useEffect(() => {
  //   // Initialize with fallback image
  //   const defaultImage = activeProduct?.imgurl || '';

  //   // Set defaults in case metafields are not available
  //   let front = defaultImage;
  //   let back = defaultImage;
  //   let sleeve = defaultImage;

  //   if (activeProduct?.selectedColor?.variant?.metafields?.edges?.length) {
  //     const variantMetafields = activeProduct.selectedColor.variant.metafields.edges.find(
  //       (edge) => edge?.node?.key === 'variant_images'
  //     )?.node?.value;

  //     if (variantMetafields) {
  //       try {
  //         const parsedImages = JSON.parse(variantMetafields);

  //         // Find specific images by their suffixes in the src property
  //         front = parsedImages.find(img => img.src.includes('_f_fm'))?.src || defaultImage;
  //         back = parsedImages.find(img => img.src.includes('_b_fm'))?.src || defaultImage;
  //         sleeve = parsedImages.find(img => img.src.includes('_d_fm'))?.src || defaultImage;
  //       } catch (err) {
  //         console.error('Failed to parse metafields variant_images:', err);
  //       }
  //     }
  //   }

  //   // Set background images
  //   setFrontBgImage(front);
  //   setBackBgImage(back);
  //   setLeftSleeveBgImage(sleeve);
  //   setRightSleeveBgImage(sleeve);

  //   // Set preview images
  //   setFrontPreviewImage(front);
  //   setBackPreviewImage(back);
  //   setLeftSleevePreviewImage(sleeve);
  //   setRightSleevePreviewImage(sleeve);
  // }, [activeProduct]);

  // --
  useEffect(() => {
    // Initialize with fallback image
    const defaultImage = activeProduct?.imgurl || '';
    setActiveProductTitle(activeProduct?.name);

    // Set defaults in case metafields are not available
    let front = defaultImage;
    let back = defaultImage;
    let sleeve = defaultImage;
    // console.log("-----activeProduct", activeProduct)

    if (activeProduct?.selectedColor?.variant?.metafields?.edges?.length) {
      const variantMetafields = activeProduct.selectedColor.variant.metafields.edges.find(
        (edge) => edge?.node?.key === 'variant_images'
      )?.node?.value;

      if (variantMetafields) {
        try {
          const parsedImages = JSON.parse(variantMetafields);

          // Find specific images by their suffixes in the URL string
          front = parsedImages.find(img => img.includes('_f_fl')) || defaultImage;
          back = parsedImages.find(img => img.includes('_b_fl')) || defaultImage;
          sleeve = parsedImages.find(img => img.includes('_d_fl')) || defaultImage;
        } catch (err) {
          console.error('Failed to parse metafields variant_images:', err);
        }
      }
    }

    // Set background images
    setFrontBgImage(front);
    setBackBgImage(back);
    setLeftSleeveBgImage(sleeve);
    setRightSleeveBgImage(sleeve);

    // Set preview images
    setFrontPreviewImage(front);
    setBackPreviewImage(back);
    setLeftSleevePreviewImage(sleeve);
    setRightSleevePreviewImage(sleeve);
  }, [activeProduct]);

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
          {!isQuantityPage && <RedoundoComponent />}
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
            activeProductTitle={activeProductTitle}
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
            activeProductTitle={activeProductTitle}

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
            activeProductTitle={activeProductTitle}

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
            activeProductTitle={activeProductTitle}

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