
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
import { fetchDesign, uploadBlobData, saveDesignFunction, sendEmailDesign, updateDesignFunction, normalizeObject } from '../utils/GlobalSaveDesignFunctions.jsx';
import { generateDesigns } from '../Editor/utils/helper.js';
import { toast } from "react-toastify";
import { addProduct } from '../../redux/productSelectionSlice/productSelectionSlice.js';
import EmailInputPopup from '../PopupComponent/EmailInputPopup/EmailInputPopup.jsx';
import { setActiveSide } from '../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { apiConnecter } from '../utils/apiConnector.jsx';
import axios from 'axios';

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
  const { present, DesignNotes, nameAndNumberDesignState, addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  // console.log("present...", present)
  const productState = useSelector((state) => state.productSelection.products);
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const isProductPage = location.pathname === "/design/product";
  const isReviewPage = location.pathname === "/review";

  const searchParams = new URLSearchParams(location.search);
  const customerEmail = searchParams.get("customerEmail");
  const [localEmail, setLocalEmail] = useState(searchParams.get("customerEmail"));

  const designId = searchParams.get("designId");
  // console.log("=======nameAndNumberProductList", nameAndNumberProductList, nameAndNumberDesign)
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
    // console.log("namProductLisst", nameAndNumberProductList)
    const areas = nameAndNumberProductList?.flatMap(product =>
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
    // console.log("NamesAndNumberPrintAreas", areas)
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
  // Check Design Change
  const isDesignChanged = () => {
    if (!lastDesign) return true;



    const current = normalizeObject(designPayload.design);
    const saved = normalizeObject(lastDesign);

    return current !== saved;
  };


  async function blobUrlToFile(blobUrl, filename = "canvas.png") {
    const response = await fetch(blobUrl);   // fetch blob data
    const blob = await response.blob();      // convert to blob
    return new File([blob], filename, { type: blob.type });
  }


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

        // if (actionType === 'share' && designFound) {
        //   setActiveModal("share");
        // }

        // else {
        //   setActiveModal(designFound ? "save" : "addToCart");
        // }
        // new checking update design
        if (actionType === 'share') {
          if (!designFound) {
            setActiveModal("addToCart");
          } else if (isDesignChanged()) {
            setActiveModal("save");
          } else {
            setActiveModal("share");
          }
        } else {
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

      // const designPromises = reviewItems.map(async (item) => {
      //   const frontDesignImages = await generateDesigns([item.allImages[0]], present.front.texts, present.front.images, activeSide, canvasWidth, canvasHeight);
      //   const backDesignImages = await generateDesigns([item.allImages[1]], present.back.texts, present.back.images, activeSide, canvasWidth, canvasHeight);

      //   const leftDesignImages = await generateDesigns([item.allImages[2]], present.leftSleeve.texts, present.leftSleeve.images, activeSide, canvasWidth, canvasHeight);
      //   const rightDesignImages = await generateDesigns([item.allImages[3]], present.rightSleeve.texts, present.rightSleeve.images, activeSide, canvasWidth, canvasHeight);
      //   return { front: frontDesignImages[0], back: backDesignImages[0] };
      // });
      const designPromises = reviewItems.map(async (item) => {
        console.log("-------------itemm", item)
        // const front = (await generateDesigns([item.allImages[0]], present.front.texts, present.front.images, activeSide, canvasWidth, canvasHeight))[0];
        let front, back;

        // Handle front
        if (activeNameAndNumberPrintSide === "front" && (addName || addNumber)) {
          front = (
            await generateDesigns(
              [item.allImages[0]],
              present.front.texts,
              present.front.images,
              nameAndNumberDesignState,
              activeSide,
              canvasWidth,
              canvasHeight,
              addName,
              addNumber
            )
          )[0];
        } else {
          front = (
            await generateDesigns(
              [item.allImages[0]],
              present.front.texts,
              present.front.images,
              {},
              activeSide,
              canvasWidth,
              canvasHeight,
              addName,
              addNumber
            )
          )[0];
        }

        // Handle back
        if (activeNameAndNumberPrintSide === "back" && (addName || addNumber)) {
          back = (
            await generateDesigns(
              [item.allImages[1]],
              present.back.texts,
              present.back.images,
              nameAndNumberDesignState,
              activeSide,
              canvasWidth,
              canvasHeight,
              addName,
              addNumber
            )
          )[0];
        } else {
          back = (
            await generateDesigns(
              [item.allImages[1]],
              present.back.texts,
              present.back.images,
              {},
              activeSide,
              canvasWidth,
              canvasHeight,
              addName,
              addNumber
            )
          )[0];
        }
        const leftSleeve = (await generateDesigns([item.allImages[2]], present.leftSleeve.texts, present.leftSleeve.images, {}, activeSide, canvasWidth, canvasHeight, addName,
          addNumber))[0];
        const rightSleeve = (await generateDesigns([item.allImages[3]], present.rightSleeve.texts, present.rightSleeve.images, {}, activeSide, canvasWidth, canvasHeight, addName,
          addNumber))[0];

        return { front, back, leftSleeve, rightSleeve };
      });

      const results = await Promise.all(designPromises);
      const blobData = results.reduce((arr, item) => {
        arr.push(base64toBlob(item.front, "image/png"));
        arr.push(base64toBlob(item.back, "image/png"));
        arr.push(base64toBlob(item.leftSleeve, "image/png"))
        arr.push(base64toBlob(item.rightSleeve, "image/png"))
        return arr;
      }, []);

      const cloudinaryResponse = await uploadBlobData(blobData);
      // console.log("cloudinaryResponse:", cloudinaryResponse);
      designPayload.design.FinalImages = cloudinaryResponse?.files || [];

      const allFrontImagesElement = designPayload.design.present.front.images;
      const allBackImagesElement = designPayload.design.present.back.images;
      const allLeftImagesElement = designPayload.design.present.leftSleeve.images;
      const allRightImagesElement = designPayload.design.present.rightSleeve.images;
      const allImages = [
        ...allFrontImagesElement,
        ...allBackImagesElement,
        ...allLeftImagesElement,
        ...allRightImagesElement
      ];

      const allFiles = [];
      const formData = new FormData();
      for (let i = 0; i < allImages.length; i++) {
        const blobUrl = allImages[i].base64CanvasImage;
        if (!blobUrl) continue;

        // use the ID in the filename
        const file = await blobUrlToFile(blobUrl, `${allImages[i].id}.png`);
        formData.append("images", file);
      }



      // const file = await blobUrlToFile(base64CanvasImage);

      // formData.append("file", file);
      // console.log("all fils from blob ", formData)


      if ([...formData.entries()].length > 0) {
        const responseForblobToFiles = await axios.post(
          `${process.env.REACT_APP_BASE_URL}imageOperation/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        // console.log("responseForblobToFiles ", responseForblobToFiles);
        const uploadedImages = responseForblobToFiles.data.files;
        // console.log("uploadedImages", uploadedImages)
        const updateImages = (images) =>
          images.map(img => {
            const match = uploadedImages.find(
              u => u.name.split(".")[0].toLowerCase() === img.id.toLowerCase()
            );
            return match ? { ...img, src: match.url } : img;
          });

        designPayload.design.present.front.images = updateImages(designPayload.design.present.front.images);
        designPayload.design.present.back.images = updateImages(designPayload.design.present.back.images);
        designPayload.design.present.leftSleeve.images = updateImages(designPayload.design.present.leftSleeve.images);
        designPayload.design.present.rightSleeve.images = updateImages(designPayload.design.present.rightSleeve.images);

      }
      else {
        console.log("formdata is empty")
      }

      // await fetch("/upload", {
      //   method: "POST",
      //   body: formData
      // });


      let responseData;
      if (payload.type === "update" && payload.designId) {
        // console.log("Calling updateDesignFunction with payload:", {
        //   ownerEmail: customerEmail,
        //   designId: payload.designId,
        //   design: designPayload.design,
        // });
        responseData = await updateDesignFunction({
          ownerEmail: customerEmail,
          designId: payload.designId,
          design: designPayload.design,
        });

      } else {
        // console.log("Calling saveDesignFunction with payload:", designPayload);
        responseData = await saveDesignFunction(designPayload);
      }

      // console.log("responseData:", responseData);

      // Handle single design object response
      if (!responseData || !responseData._id) {
        throw new Error("Invalid design response: No design ID found");
      }

      const lastDesing = responseData;
      // console.log("lastDesing:", lastDesing);

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

      searchParams.set("designId", lastDesing?._id);
      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      }, { replace: true });
      const url = new URL(window.location.href);

      // always set mode=edit (replaces if already exists, adds if not)
      url.searchParams.set("mode", "edit");

      const edit_design_link = url.toString();

      const emailPayload = {
        email: customerEmail,
        companyEmail: "",
        frontSrc: cloudinaryResponse?.files?.[0] || "",
        backSrc: cloudinaryResponse?.files?.[1] || "",
        designname: payload.name,
        phoneNumber: "1234567890",
        edit_design_link: edit_design_link,
        add_to_cart_link: "#",
        unsubscribe_link: "#",
      };
      console.log("Sending email with payload:", emailPayload);
      try {
        await sendEmailDesign(emailPayload);
        // console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        toast.warn("Design saved/updated, but failed to send email: " + emailError.message);
      }
      setActiveModal("share");

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
