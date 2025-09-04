import React, { useState, useEffect, use } from "react";
import styles from "./Review.module.css";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaTshirt } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import { IoIosColorPalette } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { generateDesigns } from "../../components/Editor/utils/helper";
import { toast } from "react-toastify";
import AddToCartPopup from "../../components/PopupComponent/AddToCartPopup/AddToCartPopup";
import { apiConnecter } from "../../components/utils/apiConnector";
import BlankProductWarning from "./BlankProductWarning";
import SaveDesignModal from "./SaveDesignModal";
import RetrieveSavedDesignsModal from "./RetrieveSavedDesignsModal";
import EmailSendingModal from "./EmailSendingModal";
import { restoreEditDesigns } from "../../redux/FrontendDesign/TextFrontendDesignSlice";
import SaveDesignPopup from "../../components/PopupComponent/SaveDesignPopup/SaveDesignPopup";
import { fetchDesign, saveDesignFunction, sendEmailDesign, updateDesignFunction, uploadBlobData } from "../../components/utils/GlobalSaveDesignFunctions";
import EmailInputPopup from "../../components/PopupComponent/EmailInputPopup/EmailInputPopup";

const randomDiscount = () => Math.floor(Math.random() * 21) + 15; // 15% to 35%

const Review = () => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const { addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice.nameAndNumberDesignState)
  const activeNameAndNumberPrintSide = useSelector((state) => state.TextFrontendDesignSlice.activeNameAndNumberPrintSide);
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberProductList);
  const design = useSelector((state) => state.TextFrontendDesignSlice.present);
  const productState = useSelector((state) => state.productSelection.products);
  const designState = useSelector((state) => state.TextFrontendDesignSlice);
  const { present, DesignNotes } = designState;


  const [discount, setDiscount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [retrieveLoader, setRetrieveLoader] = useState(false);
  const [saveDesignLoader, setSaveDesignLoader] = useState(false);
  const [emailSendingLoader, setEmailSendingLoader] = useState(false);
  const [designExists, setDesignExists] = useState(false);
  const [isFetchingDesign, setIsFetchingDesign] = useState(false);
  const [designStateDb, setDesignStateDb] = useState();
  const [currentDesign, setCurrentDesign] = useState();
  const [discountData, setDiscountData] = useState();
  const [extraInformation, setExtraInformation] = useState([]);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [lastDesign, setLastDesign] = useState(null);
  const CollegiateLicense = useSelector((state) => state.productSelection.CollegiateLicense);
  const { canvasWidth, canvasHeight } = useSelector((state) => state.canvasReducer);
  // console.log("---------------canvassss", canvasWidth, canvasHeight)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();


  const searchParams = new URLSearchParams(location.search);
  const customerEmail = searchParams.get("customerEmail");
  const designId = searchParams.get("designId");
  const designPayload = {
    ownerEmail: customerEmail,
    design: {
      DesignName: "",
      present: {
        front: {
          texts: present.front.texts.map((text) => ({
            id: text.id,
            layerIndex: text.layerIndex,
            position: text.position,
            content: text.content,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            fontFamily: text.fontFamily,
            textColor: text.textColor,
          })),
          images: present.front.images.map((image) => ({
            id: image.id,
            layerIndex: image.layerIndex,
            position: image.position,
            src: image.src,
            base64CanvasImage: image.src,
          })),
        },
        back: {
          texts: present.back.texts.map((text) => ({
            id: text.id,
            layerIndex: text.layerIndex,
            position: text.position,
            content: text.content,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            fontFamily: text.fontFamily,
            textColor: text.textColor,
          })),
          images: present.back.images.map((image) => ({
            id: image.id,
            layerIndex: image.layerIndex,
            position: image.position,
            src: image.src,
            base64CanvasImage: image.src,
          })),
        },
        leftSleeve: {
          texts: present.leftSleeve.texts.map((text) => ({
            id: text.id,
            layerIndex: text.layerIndex,
            position: text.position,
            content: text.content,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            fontFamily: text.fontFamily,
            textColor: text.textColor,
          })),
          images: present.leftSleeve.images.map((image) => ({
            id: image.id,
            layerIndex: image.layerIndex,
            position: image.position,
            src: image.src,
            base64CanvasImage: image.src,
          })),
        },
        rightSleeve: {
          texts: present.rightSleeve.texts.map((text) => ({
            id: text.id,
            layerIndex: text.layerIndex,
            position: text.position,
            content: text.content,
            fontWeight: text.fontWeight,
            fontStyle: text.fontStyle,
            fontFamily: text.fontFamily,
            textColor: text.textColor,
          })),
          images: present.rightSleeve.images.map((image) => ({
            id: image.id,
            layerIndex: image.layerIndex,
            position: image.position,
            src: image.src,
            base64CanvasImage: image.src,
          })),
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


  const [loading, setLoading] = useState(false);

  function NamesAndNumberPrintAreas() {
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
    console.log("NamesAndNumberPrintAreas", areas)
    return areas;

  }

  const AddToCartClick = (overrideEmail = null) => {
    const effectiveEmail = overrideEmail || customerEmail;
    console.log("----------effectiveEmail", effectiveEmail);
    if (!effectiveEmail) {
      setShowEmailPopup(true);
      return;
    }
    setRetrieveLoader(true);
    setIsFetchingDesign(true);

    fetchDesign(effectiveEmail)
      .then((data) => {
        const designs = data.userDesigns?.designs || [];
        const designFound = designs.some((design) => design._id === designId);
        const design = designs.find((d) => d._id === designId);
        setDesignExists(designFound);
        setCurrentDesign(design);
        setDesignStateDb(data);
        setIsFetchingDesign(false);
      })
      .catch((error) => {
        console.error("Error fetching design:", error);
        toast.error("Failed to fetch design.");
        setDesignExists(false);
        setIsFetchingDesign(false);
        setRetrieveLoader(false);
      });
  };

  useEffect(() => {
    if (!isFetchingDesign && retrieveLoader) {
      setRetrieveLoader(false);
      if (designExists) {
        setSaveDesignLoader(true);
      } else {
        setShowPopup(true);
      }
    }
    console.log("---------addnamedesignSlice", nameAndNumberDesign, nameAndNumberProductList)
  }, [isFetchingDesign, retrieveLoader, designExists]);

  const reviewItems = Object.entries(productState).map(([id, product]) => {
    const sizes = Object.entries(product.selections).reduce((acc, [size, qty]) => {
      if (qty > 0) acc[size] = qty;
      return acc;
    }, {});
    console.log("sizes", sizes);
    return {
      name: product?.name,
      color: product?.color,
      sizes,
      image: product?.imgurl,
      variantId: product?.variantId,
      allImages: [
        product?.allImages?.[0],
        product?.allImages?.[1],
        product?.allImages?.[2],
        product?.allImages?.[2],
      ],
      allVariants: product?.allVariants,
      price: product?.price,
      sku: product?.sku,
      inventory_quantity: product?.inventory_quantity,
    };
  });

  useEffect(() => {
    setDiscount(randomDiscount());
  }, []);

  const totalItems = reviewItems.reduce(
    (acc, item) =>
      acc + Object.values(item.sizes).reduce((a, b) => a + b, 0),
    0
  );
  const originalPrice = 30.36;
  const discountedPrice = (originalPrice * (1 - discount / 100)).toFixed(2);
  const totalPrice = (totalItems * discountedPrice).toFixed(2);
  const printAreaCount = useSelector((state) => {
    const present = state.TextFrontendDesignSlice.present;
    const areas = ["front", "back", "leftSleeve", "rightSleeve"];
    let count = areas.reduce((count, area) => {
      const hasContent = Boolean(present[area].texts.length) || Boolean(present[area].images.length);
      return hasContent + count;
    }, 0);
    if (
      design?.back.nameAndNumberProductList?.some(
        (item) => item.selections.length != 0
      ) &&
      (addName || addNumber)
    ) {
      count++;
    }
    return count;
  });

  let colorCount = () => {
    const allTexts = [
      ...(design.front.texts || []),
      ...(design.back.texts || []),
      ...(design.leftSleeve.texts || []),
      ...(design.rightSleeve.texts || []),
    ];
    const colorSet = new Set();
    allTexts.forEach((text) => {
      if (text.textColor) {
        colorSet.add(text.textColor);
      }
    });
    return colorSet.size;
  };

  const goBack = () => {
    navigate("/quantity");
  };

  const [url, setUrl] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  function base64toBlob(base64String, contentType = "image/png") {
    if (!base64String) return;
    const base64WithoutPrefix = base64String.replace(
      /^data:image\/(png|jpeg|gif|webp|svg\+xml);base64,/,
      ""
    );
    const binaryString = atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
  }

  async function makeVariantDataForShopify(reviewItems, CloudinaryImages) {
    const splitIntoPairs = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i += 4) {
        result.push(arr.slice(i, i + 4));
      }
      return result;
    };

    const ShopifyData = [];
    const groupedImages = splitIntoPairs(CloudinaryImages.files);
    // console.log("CloudinaryImages", CloudinaryImages);

    for (let index = 0; index < reviewItems.length; index++) {
      const product = reviewItems[index];
      const allVariants = product.allVariants;

      const sizeskey = Object.entries(product?.sizes);
      const color = product?.color;
      console.log("sizeskey", sizeskey);

      const variantTitles = sizeskey.map(([size, count]) => {
        return { title: `${color} / ${size}`, inventory_quantity: count };
      });

      for (const varianttitle of variantTitles) {
        const variantData = allVariants.find(
          (v) => v.title === varianttitle.title
        );
        // console.log(variantData, "variantdata");

        const newData = {
          variant_id: variantData.id.split("/").reverse()[0],
          size: varianttitle.title.split("/")[1].trim(),
          color: varianttitle.title.split("/")[0].trim(),
          price: discountData?.summary?.eachAfterDiscount,
          sku: variantData?.sku,
          designId: currentDesign?._id,
          quantity: Number(varianttitle.inventory_quantity),
          vendor: "Addidas test",
          custom: true,
          design: {
            front: groupedImages[index][0],
            back: groupedImages[index][1],
            left: groupedImages[index][2],
            right: groupedImages[index][3],
          },
          PreviewImageUrl: groupedImages[index][0],
        };

        ShopifyData.push(newData);
      }
    }

    // console.log("Final Shopify Data:", ShopifyData);
    // const response = await createDraftOrderforCheckout(ShopifyData);
    // return response;
  }

  function getIncreasedData(data, value) {
    // console.log("increase by value ", value);
    const cloned = JSON.parse(JSON.stringify(data));
    const q = cloned.items[0]?.sizes?.S || 0;
    cloned.items[0].sizes.S = parseInt(q + value);
    return cloned;
  }

  function makeVariantDataForDiscound(reviewItems) {
    const discountData = [];

    const data = reviewItems.forEach((product, index) => {
      const allVariants = product.allVariants;
      // console.log("--------------------checkk", allVariants);

      const sizeskey = Object.entries(product?.sizes);
      const color = product?.color;
      const variantTitles = sizeskey.map(([size, count]) => {
        return { title: `${color} / ${size}`, inventory_quantity: count };
      });

      const data = variantTitles.map((varianttitle) => {
        const variantData = allVariants.find((v) => v.title == varianttitle.title);
        // console.log(variantData, "variantdata");
        const size = varianttitle.title.split("/")[1].trim();

        const newData = {
          unitPrice: Number.parseFloat(variantData?.price),
          printAreas: printAreaCount,
          sku: variantData?.sku,
          name: variantData?.title,
          sizes: {
            [size]: Number(varianttitle.inventory_quantity)
          },
        };
        discountData.push(newData);
        return newData;
      });
      return data;
    });
    const dataForDiscountCheck = {
      items: discountData,
      flags: {
        collegiateLicense: CollegiateLicense
      }
    };
    // console.log("data.....", dataForDiscountCheck);
    // console.log("totalItems", totalItems);
    if (totalItems == 0) return;
    calculatePriceAndDiscount(dataForDiscountCheck);
    const increasedData = getIncreasedData(dataForDiscountCheck, (totalItems * 0.7));
    calculatePriceAndDiscount2(increasedData);
    const increasedData2 = getIncreasedData(dataForDiscountCheck, (totalItems * 1.5));
    calculatePriceAndDiscount2(increasedData2);
  }

  useEffect(() => {
    makeVariantDataForDiscound(reviewItems);
  }, []);

  async function createDraftOrderforCheckout(variants) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}products/createDraftOrderforCheckout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variants)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    }
  }

  async function calculatePriceAndDiscount(variants) {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth/calculatePrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variants)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDiscountData(data);
      // console.log("Success and get Discount:", data);
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    } finally {
      setLoading(false);
    }
  }

  async function calculatePriceAndDiscount2(variants) {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth/calculatePrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(variants)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const grandTotal = data.summary.grandTotal;
      const totalQuantity = data.summary.totalQuantity;
      const eachPerUnit = parseFloat(grandTotal / totalQuantity).toFixed(2);
      if (extraInformation.length < 2) {
        setExtraInformation((prev) => [...prev, { totalQuantity, eachPerUnit }]);
      }
      // console.log(extraInformation, "extraInformation");
      // console.log("Success and get Discount for future:", data);
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    } finally {
      setLoading(false);
    }
  }

  const cartHandler = () => {
    AddToCartClick();
  };

  const handleSaveDesign = async (payload) => {
    setShowPopup(false);
    setSaveDesignLoader(false);
    setEmailSendingLoader(true);

    try {
      if (payload.type !== "update") {
        designPayload.design.DesignName = payload?.name?.trim() || `Untitled Design ${new Date().toISOString()}`;
        if (!payload?.name?.trim()) {
          toast.warn("No design name provided; using default name: " + designPayload.design.DesignName);
        }
      } else {
        delete designPayload.design.DesignName;
      }

      if (payload.type === "update" && payload.designId) {
        designPayload.designId = payload.designId;
        designPayload.design.version = (currentDesign?.version || 1) + 1;
        delete designPayload.design.DesignName;
      } else {
        delete designPayload.designId;
        designPayload.design.version = 1;
      }

      const allFrontImagesElement = present.front.images;
      const allBackImagesElement = present.back.images;
      const allLeftImagesElement = present.leftSleeve.images;
      const allRightImagesElement = present.rightSleeve.images;

      const allFrontTextElement = present.front.texts;
      const allBackTextElement = present.back.texts;
      const allLeftTextElement = present.leftSleeve.texts;
      const allRightTextElement = present.rightSleeve.texts;

      const designPromises = reviewItems.map(async (item, index) => {
        console.log("----allImages", item.allImages)
        const frontBackground = item.allImages[0];
        const backBackground = item.allImages[1];
        const leftBackground = item.allImages[2];
        const rightBackground = item.allImages[3];

        const frontDesignImages = await generateDesigns(
          [frontBackground],
          allFrontTextElement,
          allFrontImagesElement,
          activeSide,
          canvasWidth,
          canvasHeight
        );

        const backDesignImages = await generateDesigns(
          [backBackground],
          allBackTextElement,
          allBackImagesElement,
          activeSide, canvasWidth, canvasHeight
        );

        const leftDesignImages = await generateDesigns(
          [leftBackground],
          allLeftTextElement,
          allLeftImagesElement,
          activeSide, canvasWidth, canvasHeight
        );
        const rightDesignImages = await generateDesigns(
          [rightBackground],
          allRightTextElement,
          allRightImagesElement,
          activeSide, canvasWidth, canvasHeight
        );

        return {
          front: frontDesignImages[0],
          back: backDesignImages[0],
          leftSleeve: leftDesignImages[0],
          rightSleeve: rightDesignImages[0],
        };
      });

      const results = await Promise.all(designPromises);
      // console.log("All Generated Designs:", results);

      const blobData = results.reduce((arr, item) => {
        arr.push(base64toBlob(item.front, "image/png"));
        arr.push(base64toBlob(item.back, "image/png"));
        arr.push(base64toBlob(item.leftSleeve, "image/png"))
        arr.push(base64toBlob(item.rightSleeve, "image/png"))
        return arr;
      }, []);

      // console.log("blobData:", blobData);
      const cloudinaryResponse = await uploadBlobData(blobData);
      // console.log("Cloudinary Response:", cloudinaryResponse);

      designPayload.design.FinalImages = cloudinaryResponse?.files?.map((url) => url) || [];

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

      if (!responseData || !responseData._id) {
        throw new Error("Invalid design response: No design ID found");
      }

      const lastDesing = responseData;
      // console.log("lastDesing:", lastDesing);

      setLastDesign(lastDesing);
      setDesignExists(lastDesing);

      if (!designId && lastDesing._id) {
        // console.log('Adding design ID to the URL:', lastDesing._id);
        searchParams.set("designId", lastDesing._id);
        navigate({
          pathname: location.pathname,
          search: searchParams.toString(),
        }, { replace: true });
      }

      const checkoutData = await makeVariantDataForShopify(reviewItems, cloudinaryResponse);

      try {
        const url = new URL(window.location.href);

        // always set mode=edit (replaces if already exists, adds if not)
        url.searchParams.set("mode", "edit");

        const edit_design_link = url.toString();
        const emailPayload = {
          email: customerEmail,
          companyEmail: "service@simaxsports.com",
          frontSrc: cloudinaryResponse?.files?.[0] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786256753_download_4.png",
          backSrc: cloudinaryResponse?.files?.[1] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786306809_download_5.png",
          designname: lastDesing?.DesignName || "Untitled Design",
          phoneNumber: "",
          edit_design_link: edit_design_link,
          add_to_cart_link: checkoutData.checkoutUrl,
          unsubscribe_link: "#",
        };
        // console.log("emailPayload", emailPayload);
        await sendEmailDesign(emailPayload);
        if (checkoutData?.checkoutUrl) {
          window.location.href = checkoutData?.checkoutUrl;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        toast.error("Failed to send email.", emailError);
      } finally {
        setEmailSendingLoader(false);
      }
    } catch (error) {
      console.error("Error in handleSaveDesign:", error);
      toast.error("Failed to save design or prepare variants.", error);
      setEmailSendingLoader(false);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowBlankProductWarning = (design) => {
    const allImagesAndTextsEmpty =
      design.front.images.length === 0 &&
      design.back.images.length === 0 &&
      design.leftSleeve.images.length === 0 &&
      design.rightSleeve.images.length === 0 &&
      design.front.texts.length === 0 &&
      design.back.texts.length === 0 &&
      design.leftSleeve.texts.length === 0 &&
      design.rightSleeve.texts.length === 0;
    const isNameOrNumberEnabled = addName || addNumber;
    const isProductListEmpty = design?.back?.nameAndNumberProductList?.every(
      (item) => item.selections.length == 0
    );
    if (isNameOrNumberEnabled && isProductListEmpty && allImagesAndTextsEmpty) return true;
    if (isNameOrNumberEnabled && !isProductListEmpty) return false;
    return allImagesAndTextsEmpty;
  };

  function restorePresentFromData(incomingPresent, src) {
    const sides = ["front", "back", "leftSleeve", "rightSleeve"];
    const restored = {};

    sides.forEach(side => {
      const originalImages = incomingPresent?.[side]?.images || [];

      const enhancedImages = originalImages.map(image => ({
        ...image,
        base64CanvasImage: image.src
      }));

      restored[side] = {
        selectedTextId: null,
        selectedImageId: null,
        loadingState: {
          loading: false,
          position: null
        },
        texts: incomingPresent?.[side]?.texts || [],
        images: enhancedImages,
        setRendering: false,
        nameAndNumberProductList: [],
      };
    });

    return restored;
  }

  function editDesignHandler() {
    try {
      // console.log(designStateDb);
      const matchedDesigns = designStateDb.userDesigns.designs.filter(
        (d) => d._id == designId
      );

      if (matchedDesigns.length === 0) {
        console.error("Design not found for id:", designId);
      } else {
        const apiData = matchedDesigns[0];
        const restoredState = {
          present: restorePresentFromData(apiData.present),
        };
        // console.log(restorePresentFromData(apiData.present));
        dispatch(restoreEditDesigns(restorePresentFromData(apiData.present)));
        // console.log(restoredState);
      }
    } catch (e) {
      console.log("error while fetching design", e);
    }
  }

  const handleEmailSubmit = ({ email }) => {
    searchParams.set("customerEmail", email);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    }, { replace: true });
    setShowEmailPopup(false);
    AddToCartClick(email);
  };

  return (
    <>
      {loading ? (
        <div className={styles.loaderWrapper}>
          <div className="loader" />
          <p>calculating price...</p>
        </div>
      ) : (
        <div className={styles.container}>
          {retrieveLoader && (
            <RetrieveSavedDesignsModal
              onClose={() => setRetrieveLoader(false)}
              isFetchingDesign={isFetchingDesign}
              designExists={designExists}
            />
          )}
          {saveDesignLoader && (
            <SaveDesignModal
              onClose={() => setSaveDesignLoader(false)}
              onSubmit={handleSaveDesign}
              defaultDesignName="Demo T-Shirt 55555"
              designId={designId}
              currentDesign={currentDesign}
            />
          )}
          {showPopup && (
            <AddToCartPopup
              onSave={handleSaveDesign}
              defaultDesignName=""
              onClose={() => setShowPopup(false)}
            />
          )}
          {emailSendingLoader && (
            <EmailSendingModal onClose={() => setEmailSendingLoader(false)} />
          )}
          {showEmailPopup && (
            <EmailInputPopup
              onSubmit={handleEmailSubmit}
              onClose={() => setShowEmailPopup(false)}
            />
          )}
          <div className={styles.header}>
            <div className="toolbar-main-heading">
              <h5 className="Toolbar-badge">Review Your Order</h5>
            </div>
            <div className={styles.titleRow}>
              <div className={styles.arrow} onClick={goBack}>
                <LuArrowLeft />
              </div>
              <h3>Your Products & Pricing</h3>
              <div className={styles.close} onClick={() => navigate("/design/product")}>
                <RxCross2 />
              </div>
            </div>
            <hr />
          </div>
          {shouldShowBlankProductWarning(design) ? (
            <BlankProductWarning />
          ) : (
            <>
              <div className={styles.priceInfo}>
                {discountData?.summary?.discountTier?.percent > 0 && (
                  <>
                    <p>
                      <span className={styles.strike}>${discountData?.summary?.eachBeforeDiscount}</span>
                      <span className={styles.discounted}> ${discountData?.summary?.eachAfterDiscount} each</span>
                    </p>
                    <p>
                      <span className={styles.strikeSmall}>
                        ${discountData?.summary?.baseSubtotal}
                      </span>
                      <span className={`${styles.total}`}>
                        <span className={styles.dollarText}>${discountData?.summary?.grandTotal}</span> total
                        with {discountData?.summary?.discountTier?.percent}% off Bulk Discount
                      </span>
                    </p>
                  </>
                )}
                <div className={styles.metaInfo}>
                  <div>
                    <FaTshirt /> {totalItems} items
                  </div>
                  <div>
                    <BiTargetLock /> {printAreaCount} print area
                  </div>
                  <div>
                    <IoIosColorPalette /> {colorCount()} colors
                  </div>
                </div>
              </div>
              <p className={styles.bulkDeal}>
                <b>Buy More & Save:</b>{" "}
                {extraInformation?.map((item, index) => (
                  <span key={index}>
                    {item.totalQuantity} items for{" "}
                    <span className={styles.dollarText}>${item.eachPerUnit}</span>ea.
                    {index !== extraInformation.length - 1 && <span> | </span>}
                  </span>
                ))}
              </p>
              <div className={styles.summaryBlock}>
                <p className={styles.summaryTitle}>
                  Summary <span>({totalItems} items)</span>
                </p>
                {reviewItems?.map((item, idx) => (
                  <div key={idx} className={styles.summaryItem}>
                    <img src={item.image} alt={item.name} />
                    <div className={styles.itemDetails}>
                      <div className={styles.itemHeader}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemPrice}>
                          ${Object.entries(item.sizes).reduce((total, [size, count]) => (
                            total + count
                          ), 0) > 0 ? discountData?.summary?.eachAfterDiscount : 0} <span>each</span>
                        </p>
                      </div>
                      <p className={styles.itemSubtitle}>
                        {item.color} |  {Object.entries(item.sizes).reduce((total, [size, count]) => (
                          total + count
                        ), 0)} Items
                      </p>
                      <div className={styles.sizes}>
                        {Object.entries(item.sizes).map(([size, count]) => (
                          <button key={size}>
                            {size}-{count}
                          </button>
                        ))}
                        <span className={styles.edit} onClick={goBack}>
                          Edit sizes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {CollegiateLicense && (
                <div className={styles.extraFees}>
                  <p>
                    Collegiate License <span>${discountData?.summary?.fees?.licenseFee || 0}</span>
                  </p>
                </div>
              )}
              <button className={styles.addToCart} onClick={cartHandler}>
                ADD TO CART <LuArrowRight />
              </button>
            </>
          )}
          <div className={styles.review}>
            <img
              src="https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755870746123_img-xdbtymq29jbjr5pt7xymstyn.png"
              alt="Reviewer"
            />
            <div>
              <blockquote>
                "This company is amazing! Shipping is super fast and they are
                competitively priced. We will absolutely use them again."
              </blockquote>
              <p>
                <strong>Chelsea E.</strong> Ordered 35 pieces
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Review;