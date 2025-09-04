


// import React, { useState, useEffect } from 'react';
// import footerStyle from './Footer.module.css';
// import { IoShareSocialOutline, IoPricetagOutline } from "react-icons/io5";
// import { FiSave } from "react-icons/fi";
// import { FaArrowRightLong } from "react-icons/fa6";
// // import SaveDesignPopup from '../PopupComponent/SaveDesignPopup/SaveDesignPopup.jsx';
// // import ShareDesignPopup from '../PopupComponent/ShareDesignPopup/ShareDesignPopup.jsx';
// // import SaveDesignModal from '../Review/SaveDesignModal';
// // import EmailSendingModal from '../Review/EmailSendingModal';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { requestExport } from '../../redux/CanvasExportDesign/canvasExportSlice.js';
// import MobileFAB from '../MobileFab/MobileFab.jsx';
// import { RiShareForwardLine } from "react-icons/ri";
// // import { generateDesigns } from '../Editor/utils/helper';
// import { toast } from "react-toastify";
// import { sendEmailDesign, fetchDesign, uploadBlobData, saveDesignFunction } from '../utils/GlobalSaveDesignFunctions.jsx';
// import RetrieveSavedDesignsModal from '../../pages/Review/RetrieveSavedDesignsModal.jsx';
// import AddToCartPopup from '../PopupComponent/AddToCartPopup/AddToCartPopup.jsx';
// import { generateDesigns } from '../Editor/utils/helper.js';
// import SaveDesignPopup from '../PopupComponent/SaveDesignPopup/SaveDesignPopup.jsx';
// import SaveDesignModal from '../../pages/Review/SaveDesignModal.jsx';
// import EmailSendingModal from '../../pages/Review/EmailSendingModal.jsx';
// import ShareDesignPopup from '../PopupComponent/ShareDesignPopup/ShareDesignPopup.jsx';

// const designId = "68ac04b142c7030c7b74e6d6";
// const customerEmail = "testuser@example.com";

// const Footer = () => {
//   const [savedesignpopup, setSavedesignPopup] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [retrieveLoader, setRetrieveLoader] = useState(false);
//   const [saveDesignLoader, setSaveDesignLoader] = useState(false);
//   const [emailSendingLoader, setEmailSendingLoader] = useState(false);
//   const [designExists, setDesignExists] = useState(false);
//   const [isFetchingDesign, setIsFetchingDesign] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sleevedesignn = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
//   const location = useLocation();
//   const isProductPage = location.pathname === "/design/product";
//   const designState = useSelector((state) => state.TextFrontendDesignSlice);
//   const { present, DesignNotes } = designState;
//   const productState = useSelector((state) => state.productSelection.products);

//   const designPayload = {
//     ownerEmail: customerEmail,
//     design: {
//       DesignName: "Demo T-Shirt 55555",
//       present: {
//         front: {
//           texts: present.front.texts.map((text) => ({
//             id: text.id,
//             layerIndex: text.layerIndex,
//             position: text.position,
//             content: text.content,
//             fontWeight: text.fontWeight,
//             fontStyle: text.fontStyle,
//             fontFamily: text.fontFamily,
//             textColor: text.textColor,
//           })),
//           images: present.front.images.map((image) => ({
//             id: image.id,
//             layerIndex: image.layerIndex,
//             position: image.position,
//             src: image.src,
//           })),
//         },
//         back: {
//           texts: present.back.texts.map((text) => ({
//             id: text.id,
//             layerIndex: text.layerIndex,
//             position: text.position,
//             content: text.content,
//             fontWeight: text.fontWeight,
//             fontStyle: text.fontStyle,
//             fontFamily: text.fontFamily,
//             textColor: text.textColor,
//           })),
//           images: present.back.images.map((image) => ({
//             id: image.id,
//             layerIndex: image.layerIndex,
//             position: image.position,
//             src: image.src,
//           })),
//         },
//         leftSleeve: {
//           texts: present.leftSleeve.texts.map((text) => ({
//             id: text.id,
//             layerIndex: text.layerIndex,
//             position: text.position,
//             content: text.content,
//             fontWeight: text.fontWeight,
//             fontStyle: text.fontStyle,
//             fontFamily: text.fontFamily,
//             textColor: text.textColor,
//           })),
//           images: present.leftSleeve.images.map((image) => ({
//             id: image.id,
//             layerIndex: image.layerIndex,
//             position: image.position,
//             src: image.src,
//           })),
//         },
//         rightSleeve: {
//           texts: present.rightSleeve.texts.map((text) => ({
//             id: text.id,
//             layerIndex: text.layerIndex,
//             position: text.position,
//             content: text.content,
//             fontWeight: text.fontWeight,
//             fontStyle: text.fontStyle,
//             fontFamily: text.fontFamily,
//             textColor: text.textColor,
//           })),
//           images: present.rightSleeve.images.map((image) => ({
//             id: image.id,
//             layerIndex: image.layerIndex,
//             position: image.position,
//             src: image.src,
//           })),
//         },
//       },
//       FinalImages: [],
//       DesignNotes: {
//         FrontDesignNotes: DesignNotes.FrontDesignNotes || "",
//         BackDesignNotes: DesignNotes.BackDesignNotes || "",
//         ExtraInfo: DesignNotes.ExtraInfo || "",
//       },
//       status: "draft",
//       version: 1,
//     },
//   };

//   const reviewItems = Object.entries(productState).map(([id, product]) => {
//     const sizes = Object.entries(product.selections).reduce(
//       (acc, [size, qty]) => {
//         if (qty > 0) acc[size] = qty;
//         return acc;
//       },
//       {}
//     );
//     return {
//       name: product?.name,
//       color: product?.color,
//       sizes,
//       image: product?.imgurl,
//       variantId: product?.variantId,
//       allImages: [
//         product?.allImages?.[0],
//         product?.allImages?.[1],
//         product?.allImages?.[2],
//         product?.allImages?.[2],
//       ],
//       allVariants: product?.allVariants,
//       price: product?.price,
//       sku: product?.sku,
//       inventory_quantity: product?.inventory_quantity,
//     };
//   });

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 1200);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const setNavigate = () => {
//     navigate('/quantity');
//   };

//   const setSavedesignPopupHandler = () => {
//     setRetrieveLoader(true);
//     dispatch(requestExport());
//     fetchDesign(customerEmail).then((data) => {
//       const designFound = data.userDesigns?.designs?.some(
//         (design) => design._id === designId
//       );
//       setDesignExists(designFound);
//       setIsFetchingDesign(false);
//     }).catch(() => {
//       setDesignExists(false);
//       setIsFetchingDesign(false);
//     });
//   };

//   useEffect(() => {
//     if (!isFetchingDesign && retrieveLoader) {
//       setRetrieveLoader(false);
//       setSaveDesignLoader(true);
//     }
//   }, [isFetchingDesign, retrieveLoader]);



//   function base64toBlob(base64String, contentType = "image/png") {
//     if (!base64String) return;
//     const base64WithoutPrefix = base64String.replace(
//       /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,/,
//       ""
//     );
//     const binaryString = atob(base64WithoutPrefix);
//     const len = binaryString.length;
//     const bytes = new Uint8Array(len);
//     for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     return new Blob([bytes], { type: contentType });
//   }

//   const handleSaveDesign = async (payload) => {
//     setLoading(true);
//     setSaveDesignLoader(false);
//     setEmailSendingLoader(true);
//     try {
//       designPayload.design.DesignName = payload.name;
//       if (payload.type === "update" && payload.designId) {
//         designPayload.design.designId = payload.designId;
//       } else {
//         delete designPayload.design.designId;
//       }

//       const allFrontImagesElement = present.front.images;
//       const allBackImagesElement = present.back.images;
//       const allLeftImagesElement = present.leftSleeve.images;
//       const allRightImagesElement = present.rightSleeve.images;

//       const allFrontTextElement = present.front.texts;
//       const allBackTextElement = present.back.texts;
//       const allLeftTextElement = present.leftSleeve.texts;
//       const allRightTextElement = present.rightSleeve.texts;

//       const designPromises = reviewItems.map(async (item, index) => {
//         const frontBackground = item.allImages[0];
//         const backBackground = item.allImages[1];
//         const leftBackground = item.allImages[2];

//         const frontDesignImages = await generateDesigns(
//           [frontBackground],
//           allFrontTextElement,
//           allFrontImagesElement
//         );

//         const backDesignImages = await generateDesigns(
//           [backBackground],
//           allBackTextElement,
//           allBackImagesElement
//         );

//         return {
//           front: frontDesignImages[0],
//           back: backDesignImages[0],
//         };
//       });

//       const results = await Promise.all(designPromises);
//       console.log("All Generated Designs:", results);

//       const blobData = results.reduce((arr, item) => {
//         arr.push(base64toBlob(item.front, "image/png"));
//         arr.push(base64toBlob(item.back, "image/png"));
//         return arr;
//       }, []);

//       console.log("blobData:", blobData);
//       const cloudinaryResponse = await uploadBlobData(blobData);
//       console.log("Cloudinary Response:", cloudinaryResponse);

//       designPayload.design.FinalImages = cloudinaryResponse?.files?.map((url) => url) || [];
//       await saveDesignFunction(designPayload);
//       try {
//         const emailPayload = {
//           email: "vaishaliverma@itgeeks.com",
//           companyEmail: "service@simaxsports.com",
//           frontSrc: cloudinaryResponse?.files?.[0] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786256753_download_4.png",
//           backSrc: cloudinaryResponse?.files?.[1] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786306809_download_5.png",
//           designname: "Email Test",
//           phoneNumber: "1234567890",
//           edit_design_link: "#",
//           add_to_cart_link: "#",
//           unsubscribe_link: "#",
//         };
//         await sendEmailDesign(emailPayload);
//         toast.success("Email sent successfully!");
//         setSavedesignPopup(true)
//       } catch (emailError) {
//         console.error("Email sending failed:", emailError);
//         toast.error("Failed to send email.");
//       } finally {
//         setEmailSendingLoader(false);
//       }
//     } catch (error) {
//       console.error("Error in handleSaveDesign:", error);
//       toast.error("Failed to save design.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // close share design popup
//   const CloseShareDesignPopup = () => {
//     setSavedesignPopup(false);
//   }

//   return (
//     <>
//       {retrieveLoader && (
//         <RetrieveSavedDesignsModal
//           onClose={() => setRetrieveLoader(false)}
//           isFetchingDesign={isFetchingDesign}
//           designExists={designExists}
//         />
//       )}
//       {saveDesignLoader &&
//         (designExists ? (
//           <SaveDesignModal
//             onClose={() => setSaveDesignLoader(false)}
//             onSubmit={handleSaveDesign}
//             defaultDesignName="Demo T-Shirt 55555"
//             designId={designId}
//           />
//         ) : (
//           <AddToCartPopup
//             onSave={handleSaveDesign}
//             defaultDesignName="Demo T-Shirt 55555"
//             onClose={() => setSaveDesignLoader(false)}
//           />
//         ))}
//       {emailSendingLoader && (
//         <EmailSendingModal onClose={() => setEmailSendingLoader(false)} />
//       )}
//       {!isMobile && !sleevedesignn && (
//         <div className={footerStyle.footerContainer}>
//           <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
//             <RiShareForwardLine /> Share
//           </button>
//           <button className={footerStyle.footerBtn} onClick={setNavigate}>
//             <IoPricetagOutline /> Get Price
//           </button>
//           <button className={footerStyle.footerBtn} onClick={setSavedesignPopupHandler}>
//             <FiSave /> Save Design
//           </button>
//           <button className={footerStyle.saveButton} onClick={setNavigate}>
//             Next Step<FaArrowRightLong />
//           </button>
//         </div>
//       )}
//       {(isMobile || sleevedesignn) && (
//         <MobileFAB
//           onShare={setSavedesignPopupHandler}
//           onSave={setSavedesignPopupHandler}
//           onPrice={setNavigate}
//           onNext={setNavigate}
//           disablePrev={isProductPage}
//         />
//       )}
//       {savedesignpopup && (
//         <ShareDesignPopup setSavedesignPopupHandler={CloseShareDesignPopup} />
//       )}
//     </>
//   );
// };

// export default Footer;
import React, { useState, useEffect } from 'react';
import footerStyle from './Footer.module.css';
import { IoPricetagOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import SaveDesignModal from '../../pages/Review/SaveDesignModal.jsx';
import RetrieveSavedDesignsModal from '../../pages/Review/RetrieveSavedDesignsModal.jsx';
import EmailSendingModal from '../../pages/Review/EmailSendingModal.jsx';
import AddToCartPopup from '../PopupComponent/AddToCartPopup/AddToCartPopup.jsx';
import ShareDesignPopup from '../PopupComponent/ShareDesignPopup/ShareDesignPopup.jsx';
import MobileFAB from '../MobileFab/MobileFab.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestExport } from '../../redux/CanvasExportDesign/canvasExportSlice.js';
import { fetchDesign, uploadBlobData, saveDesignFunction, sendEmailDesign, updateDesignFunction } from '../utils/GlobalSaveDesignFunctions.jsx';
import { generateDesigns } from '../Editor/utils/helper.js';
import { toast } from "react-toastify";
import { addProduct } from '../../redux/productSelectionSlice/productSelectionSlice.js';
import EmailInputPopup from '../PopupComponent/EmailInputPopup/EmailInputPopup.jsx';
import { setActiveSide } from '../../redux/FrontendDesign/TextFrontendDesignSlice.js';

// const designId = "68ae9e7a3e658d88aa45852a";
// const customerEmail = "testuser@example.com";

const Footer = () => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [designExists, setDesignExists] = useState(false);
  const [isFetchingDesign, setIsFetchingDesign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // "retrieve", "save", "addToCart", "email", "share"
  const [lastDesign, setLastDesign] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDesigns, setUserDesigns] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const { canvasWidth, canvasHeight } = useSelector((state) => state.canvasReducer);
  // console.log("---------------canvassss", canvasWidth, canvasHeight)
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice.nameAndNumberDesignState)
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.present["back"].nameAndNumberProductList);
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  const sleevedesignn = useSelector((state) => state.TextFrontendDesignSlice.sleeveDesign);
  const { present, DesignNotes } = useSelector((state) => state.TextFrontendDesignSlice);
  const productState = useSelector((state) => state.productSelection.products);
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const isProductPage = location.pathname === "/design/product";
  const isReviewPage = location.pathname === "/review";

  const searchParams = new URLSearchParams(location.search);
  const customerEmail = searchParams.get("customerEmail");
  const [localEmail, setLocalEmail] = useState(searchParams.get("customerEmail"));

  const designId = searchParams.get("designId");
  console.log("=======nameAndNumberProductList", nameAndNumberProductList, nameAndNumberDesign)
  const designPayload = {
    ownerEmail: customerEmail,
    designId: designId, // Include designId for update
    design: {
      DesignName: "Enter design name",
      present: {
        front: {
          texts: present.front.texts.map((t) => ({ ...t })),
          images: present.front.images.map((i) => ({ ...i }))
        },
        back: {
          texts: present.back.texts.map((t) => ({ ...t })),
          images: present.back.images.map((i) => ({ ...i }))
        },
        leftSleeve: {
          texts: present.leftSleeve.texts.map((t) => ({ ...t })),
          images: present.leftSleeve.images.map((i) => ({ ...i }))
        },
        rightSleeve: {
          texts: present.rightSleeve.texts.map((t) => ({ ...t })),
          images: present.rightSleeve.images.map((i) => ({ ...i }))
        },
      },
      FinalImages: [],
      DesignNotes: {
        FrontDesignNotes: DesignNotes.FrontDesignNotes || "",
        BackDesignNotes: DesignNotes.BackDesignNotes || "",
        ExtraInfo: DesignNotes.ExtraInfo || "",
      },
      NamesAndNumberPrintAreas: NamesAndNumberPrintAreas(),
      status: "draft",
      version: 1,
    },
  };
  function NamesAndNumberPrintAreas() {
    console.log("namProductLisst", nameAndNumberProductList)
    const areas = nameAndNumberProductList.flatMap(product =>
      product.selections.map(sel => ({
        color: product.color,
        size: sel.size,
        name: sel.name,
        number: sel.number,
        fontSize: nameAndNumberDesign.fontSize,          // default or dynamic
        fontColor: nameAndNumberDesign.fontColor,    // default or dynamic
        fontFamily: nameAndNumberDesign.fontFamily,   // default or dynamic
        position: nameAndNumberDesign.position,
        id: sel.selectionId.replace(/\/\d+$/, ""),   // default or dynamic
        printSide: activeNameAndNumberPrintSide || "back",
      }))
    );
    console.log("NamesAndNumberPrintAreas", areas)
    return areas;

  }

  function getVariantImagesFromMetafields(metafieldss) {
    // console.log("metafieldss.....", metafieldss)
    // const defaultImage = activeProduct?.imgurl || '';

    let front = null;
    let back = null;
    let sleeve = null;

    try {
      const metafields = metafieldss?.edges || [];
      const variantImagesField = metafields.find(
        (edge) => edge?.node?.key === 'variant_images'
      )?.node?.value;

      if (variantImagesField) {
        const parsedImages = JSON.parse(variantImagesField);
        // console.log(parsedImages, "parsedImages");

        front = parsedImages.find((img) => img.includes('_f_fl')) || null;
        back = parsedImages.find((img) => img.includes('_b_fl')) || null;
        sleeve = parsedImages.find((img) => img.includes('_d_fl')) || null;
      }
    } catch (error) {
      console.error('Error parsing variant_images metafield:', error);
    }

    return [front, back, sleeve];
  }
  const newAllProducts = [];
  selectedProducts?.forEach((product) => {
    // console.log("product.............", product)
    const addedColors = product?.addedColors || [];
    const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

    const extraProducts = addedColors?.map((variantProduct) => {
      // console.log("variants......", variantProduct);
      const prod = {
        id: variantProduct?.variant?.id?.split("/").reverse()[0],
        // imgurl: variantProduct?.img,
        // color: variantProduct?.name,
        // size: variantProduct?.variant?.selectedOptions[1]?.value,
        // sizes: variantProduct?.sizes,
        // name: product?.name,
        // title: consistentTitle,
        // sku: variantProduct?.variant?.sku,
        // variantId: variantProduct?.variant?.id,
        allImages: getVariantImagesFromMetafields(variantProduct?.variant?.metafields),
        // selections: [],
        // price: variantProduct?.variant?.price,
        // allVariants: variantProduct?.allVariants,
        // inventory_quantity: variantProduct?.variant?.inventoryItem?.inventoryLevels?.edges?.[0]?.node?.quantities?.[0]?.quantity
      };
      // console.log("prod", prod)
      // dispatch(addProduct(prod));
      return prod;
    });
    const id = product.id.split("/").reverse()[0];
    // const sizes = getSizeOptions(product)
    // console.log("sizes,.......", sizes)
    const mainProduct = {
      // name: product.name || product.title,
      id: id,
      // imgurl: product?.imgurl,
      // color: product?.selectedColor?.name,
      // size: product?.selectedColor?.variant?.selectedOptions[1]?.value,
      // sizes: getSizeOptions(product),
      // title: consistentTitle,
      // selections: [],
      allImages: getVariantImagesFromMetafields(product?.selectedColor?.variant?.metafields),
      // allVariants: product?.allVariants,
    };
    // console.log("mainProduct..", mainProduct);


    // dispatch(addProduct(mainProduct));
    newAllProducts.push(mainProduct, ...extraProducts);
    // return mainProduct;
  });
  // console.log(newAllProducts, "newAllProducts");
  const reviewItems = newAllProducts.map((product) => ({
    allImages: [product?.allImages?.[0], product?.allImages?.[1], product?.allImages?.[2], product?.allImages?.[2]],
  }));
  // console.log("reviewItems", reviewItems)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setNavigate = () => navigate(`/quantity`);
  // const goToQuantity = () => {
  //   navigate(`/quantity${location.search}`);
  // };

  const handleDesignAction = (actionType, emailOverride = null) => {
    // if (!customerEmail) {
    //   setPendingAction(actionType);
    //   setActiveModal("emailInput");
    //   return;
    // }
    const effectiveEmail = emailOverride || customerEmail;

    if (!effectiveEmail) {
      setPendingAction(actionType);
      setActiveModal("emailInput");
      return;
    }
    setActiveModal("retrieve")
    // console.log("------------click")
    setIsFetchingDesign(true);
    dispatch(requestExport());

    fetchDesign(effectiveEmail)
      .then((data) => {
        const designs = data.userDesigns?.designs || [];
        // console.log("desings", designs)
        setUserDesigns(designs);
        const designFound = designs?.find((design) => design._id === designId);

        // setLastDesign(designs[designs.length - 1]);
        setDesignExists(designFound);
        setIsFetchingDesign(false);
        setLastDesign(designFound)

        // console.log('designFound', designFound)

        if (actionType === 'share' && designFound) {
          setActiveModal("share");
        }
        // } else if (actionType === 'save') {
        //   setActiveModal(designFound ? "save" : "addToCart");
        // }
        else {
          setActiveModal(designFound ? "save" : "addToCart");
        }

      })
      .catch(() => {
        setUserDesigns([]);
        setDesignExists(false);
        setIsFetchingDesign(false);
        if (actionType === 'save') setActiveModal("addToCart");
      });
  };

  function base64toBlob(base64String, contentType = "image/png") {
    if (!base64String) return;
    const base64WithoutPrefix = base64String.replace(/^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,/, "");
    const binaryString = atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
  }
  const handleSaveDesign = async (payload) => {
    console.log("handleSaveDesign payload:", payload);
    setLoading(true);
    if (payload?.name) {
      const nameExists = userDesigns.some(
        (design) => design.DesignName === payload.name && design._id !== payload.designId
      );

      if (nameExists) {
        toast.error("A design with this name already exists. Please choose a different name.");
        setLoading(false);
        return;
      }
    }

    setActiveModal("email");
    try {
      designPayload.design.DesignName = payload.name;
      if (payload.type === "update" && payload.designId) {
        designPayload.designId = payload.designId;
        designPayload.design.version = (lastDesign?.version || 1) + 1; // Increment version for updates
        delete designPayload.design.DesignName;
      } else {
        delete designPayload.designId;
        designPayload.design.version = 1; // Set version to 1 for new designs
      }

      const designPromises = reviewItems.map(async (item) => {
        const frontDesignImages = await generateDesigns([item.allImages[0]], present.front.texts, present.front.images, activeSide, canvasWidth, canvasHeight);
        const backDesignImages = await generateDesigns([item.allImages[1]], present.back.texts, present.back.images, activeSide, canvasWidth, canvasHeight);

        return { front: frontDesignImages[0], back: backDesignImages[0] };
      });

      const results = await Promise.all(designPromises);
      const blobData = results.reduce((arr, item) => {
        arr.push(base64toBlob(item.front, "image/png"));
        arr.push(base64toBlob(item.back, "image/png"));
        return arr;
      }, []);

      const cloudinaryResponse = await uploadBlobData(blobData);
      console.log("cloudinaryResponse:", cloudinaryResponse);
      designPayload.design.FinalImages = cloudinaryResponse?.files || [];


      let responseData;
      if (payload.type === "update" && payload.designId) {
        console.log("Calling updateDesignFunction with payload:", {
          ownerEmail: customerEmail,
          designId: payload.designId,
          design: designPayload.design,
        });
        responseData = await updateDesignFunction({
          ownerEmail: customerEmail,
          designId: payload.designId,
          design: designPayload.design,
        });
      } else {
        console.log("Calling saveDesignFunction with payload:", designPayload);
        responseData = await saveDesignFunction(designPayload);
      }

      console.log("responseData:", responseData);

      // Handle single design object response
      if (!responseData || !responseData._id) {
        throw new Error("Invalid design response: No design ID found");
      }

      const lastDesing = responseData;
      console.log("lastDesing:", lastDesing);

      setLastDesign(lastDesing);
      setDesignExists(lastDesing);

      // Update userDesigns by replacing or adding the design
      setUserDesigns((prevDesigns) => {
        const existingIndex = prevDesigns.findIndex((d) => d._id === lastDesing._id);
        if (existingIndex >= 0) {
          const updatedDesigns = [...prevDesigns];
          updatedDesigns[existingIndex] = lastDesing;
          return updatedDesigns;
        }
        return [...prevDesigns, lastDesing];
      });

      if (!designId && lastDesing._id) {
        console.log('Adding design ID to the URL:', lastDesing._id);
        searchParams.set("designId", lastDesing._id);
        navigate({
          pathname: location.pathname,
          search: searchParams.toString(),
        }, { replace: true });
      }

      const emailPayload = {
        email: customerEmail,
        companyEmail: "",
        frontSrc: cloudinaryResponse?.files?.[0] || "",
        backSrc: cloudinaryResponse?.files?.[1] || "",
        designname: payload.name,
        phoneNumber: "1234567890",
        edit_design_link: window.location.href,
        add_to_cart_link: "#",
        unsubscribe_link: "#",
      };
      console.log("Sending email with payload:", emailPayload);
      try {
        await sendEmailDesign(emailPayload);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        toast.warn("Design saved/updated, but failed to send email: " + emailError.message);
      }

      toast.success(`${payload.type === "update" ? "Design updated" : "Design saved"} successfully!`);
      setActiveModal("share");
    } catch (error) {
      console.error("Error in handleSaveDesign:", error);
      toast.error(`Failed to ${payload.type === "update" ? "update" : "save"} design: ${error.message}`);
      setActiveModal(null);
    } finally {
      setLoading(false);
    }
  };
  // const handleSaveDesign = async (payload) => {

  //   console.log("payload", payload)
  //   setLoading(true);
  //   if (payload?.name) {

  //     const nameExists = userDesigns.some(
  //       (design) => design.DesignName === payload.name && design._id !== payload.designId
  //     );

  //     if (nameExists) {
  //       toast.error("A design with this name already exists. Please choose a different name.");
  //       setLoading(false);
  //       return;
  //     }
  //   }
  //   // setActiveModal("retrieve");

  //   setActiveModal("email");
  //   // dispatch(setActiveSide('front'))


  //   try {
  //     designPayload.design.DesignName = payload.name;
  //     // if (payload.type === "update" && payload.designId) {
  //     //   designPayload.design.designId = payload.designId;
  //     // } else {
  //     //   delete designPayload.design.designId;
  //     // }
  //     if (payload.type === "update" && payload.designId) {
  //       designPayload.designId = payload.designId;
  //     } else {
  //       delete designPayload.designId;
  //     }

  //     const designPromises = reviewItems.map(async (item) => {
  //       const frontDesignImages = await generateDesigns([item.allImages[0]], present.front.texts, present.front.images, activeSide);
  //       const backDesignImages = await generateDesigns([item.allImages[1]], present.back.texts, present.back.images, activeSide);
  //       return { front: frontDesignImages[0], back: backDesignImages[0] };
  //     });
  //     // console.log("----------designpromiese", designPromises)


  //     const results = await Promise.all(designPromises);
  //     const blobData = results.reduce((arr, item) => {
  //       arr.push(base64toBlob(item.front, "image/png"));
  //       arr.push(base64toBlob(item.back, "image/png"));
  //       return arr;
  //     }, []);

  //     const cloudinaryResponse = await uploadBlobData(blobData);
  //     // console.log("---------cloudinaryResponse", cloudinaryResponse)
  //     designPayload.design.FinalImages = cloudinaryResponse?.files || [];
  //     // const responseData = await saveDesignFunction(designPayload);
  //     let responseData;
  //     if (payload.type === "update" && payload.designId) {
  //       // Call the update API for existing designs
  //       responseData = await updateDesignFunction({
  //         ownerEmail: customerEmail,
  //         designId: payload.designId,
  //         design: designPayload.design,
  //       });
  //     } else {
  //       // Call the original save function for new designs
  //       responseData = await saveDesignFunction(designPayload);
  //     }
  //     console.log("--------responseData", responseData)



  //     const design = responseData.userDesigns.designs;

  //     const lastDesing = design[design.length - 1];
  //     console.log("lastDesing", lastDesing);
  //     setLastDesign(lastDesing);
  //     setDesignExists(lastDesing);
  //     setUserDesigns([...design]);
  //     if (!designId) {
  //       console.log('adding desing id to the url', designId);
  //       searchParams.set("designId", lastDesing?._id);
  //       navigate({
  //         pathname: location.pathname,
  //         search: searchParams.toString(),
  //       }, { replace: true });
  //     }
  //     console.log("lastDesing", lastDesing);
  //     console.log("lastDesing id ", lastDesing?._id);

  //     try {
  //       const emailPayload = {
  //         email: customerEmail,
  //         companyEmail: "",
  //         frontSrc: cloudinaryResponse?.files?.[0] || "",
  //         backSrc: cloudinaryResponse?.files?.[1] || "",
  //         designname: payload.name,
  //         phoneNumber: "1234567890",
  //         edit_design_link: window.location.href,
  //         add_to_cart_link: "#",
  //         unsubscribe_link: "#",
  //       };
  //       await sendEmailDesign(emailPayload);
  //       // toast.success("Email sent successfully!");
  //       setActiveModal("share");
  //       console.log("---------now activate share model", activeModal)
  //     } catch (err) {
  //       toast.error("Failed to send email.", err.message);
  //       setActiveModal(null);
  //       console.log("---------now activate null model", activeModal)
  //     }
  //   } catch (error) {
  //     toast.error("Failed to save design.", error.message);
  //     console.log(error);

  //     setActiveModal(null);
  //   } finally {
  //     // setActiveModal(null);
  //     // console.log("---------now activate null model", activeModal)
  //     setLoading(false);
  //   }
  // };
  // useState(() => {

  // }, [lastDesign])
  const handleEmailSubmit = ({ email }) => {
    searchParams.set("customerEmail", email);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    }, { replace: true });
    setActiveModal(null); // ✅ Close immediately

    // Small delay ensures searchParams updates before re-calling handleDesignAction
    setTimeout(() => {
      // handleDesignAction(pendingAction);
      handleDesignAction(pendingAction, email);
    }, 0);
  };

  return (
    <>
      {activeModal === "retrieve" && (
        <RetrieveSavedDesignsModal
          onClose={() => setActiveModal(null)}
          isFetchingDesign={isFetchingDesign}
          designExists={designExists}
        />
      )}
      {activeModal === "save" && (
        <SaveDesignModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleSaveDesign}
          defaultDesignName=""
          designId={designId}
        />
      )}
      {activeModal === "addToCart" && (
        <AddToCartPopup
          onSave={handleSaveDesign}
          defaultDesignName=""
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "emailInput" && (
        <EmailInputPopup
          onSubmit={handleEmailSubmit}
          onClose={() => setActiveModal(null)}
        />)}
      {activeModal === "email" && (
        <EmailSendingModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "share" && (
        <ShareDesignPopup setSavedesignPopupHandler={() => setActiveModal(null)} lastDesign={lastDesign} navigate={navigate} />
      )}

      {!isMobile && !sleevedesignn && (
        <div className={footerStyle.footerContainer}>
          <button className={footerStyle.footerBtn} onClick={() => handleDesignAction('share')}>
            <RiShareForwardLine /> Share
          </button>
          <button className={footerStyle.footerBtn} onClick={setNavigate}>
            <IoPricetagOutline /> Get Price
          </button>
          <button className={footerStyle.footerBtn} onClick={() => handleDesignAction('save')}>
            <FiSave /> Save Design
          </button>
          <button className={footerStyle.saveButton} onClick={setNavigate}>
            Next Step <FaArrowRightLong />
          </button>
        </div>
      )}

      {(isMobile || sleevedesignn) && (
        <MobileFAB
          onShare={() => handleDesignAction('share')}
          onSave={() => handleDesignAction('save')}
          onPrice={setNavigate}
          onNext={setNavigate}
          disablePrev={isProductPage}
          disableNext={isReviewPage}
        />
      )}
    </>
  );
};

export default Footer;
