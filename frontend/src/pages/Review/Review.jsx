import React, { useState, useEffect } from "react";
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
import { fetchDesign, saveDesignFunction, sendEmailDesign, uploadBlobData } from "../../components/utils/GlobalSaveDesignFunctions";

const designId = "";
const customerEmail = "testuser@example33.com"; // Unencoded email for apiConnecter

// const designId = "68a6ba4b6b2c9f3a161435dd";
// const customerEmail = "testuser@example.com"; // Unencoded email for apiConnecter
const randomDiscount = () => Math.floor(Math.random() * 21) + 15; // 15% to 35%

const Review = () => {
  const [discount, setDiscount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [retrieveLoader, setRetrieveLoader] = useState(false);
  const [saveDesignLoader, setSaveDesignLoader] = useState(false);
  const [emailSendingLoader, setEmailSendingLoader] = useState(false);
  const [designExists, setDesignExists] = useState(false);
  const [isFetchingDesign, setIsFetchingDesign] = useState(false);
  const [designStateDb, setdesignStateDb] = useState();
  const [currentDesign, setCurrentDesing] = useState();
  const [discountData, setDiscountData] = useState();
  const [extraInformation, setExtraInformation] = useState([]);
  const CollegiateLicense = useSelector((state) => state.productSelection.CollegiateLicense);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const location = useLocation();
  const productState = useSelector((state) => state.productSelection.products);
  const designState = useSelector((state) => state.TextFrontendDesignSlice);
  const { present, DesignNotes } = designState;

  const searchParams = new URLSearchParams(location.search);
  const customerEmail = searchParams.get("customerEmail");
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
      status: "draft",
      version: 1,

    },
  };

  const design = useSelector((state) => state.TextFrontendDesignSlice.present);
  const { addName, addNumber } = useSelector(
    (state) => state.TextFrontendDesignSlice
  );
  const [loading, setLoading] = useState(false);

  // Fetch design to check if it exists
  // const fetchDesign = async () => {
  //   try {
  //     setIsFetchingDesign(true);
  //     const response = await apiConnecter(
  //       "GET",
  //       "design/get-designfrontEnd",
  //       null,
  //       null,
  //       { ownerEmail: customerEmail }
  //     );

  //     const data = response.data;
  //     console.log("Fetched designs:", data);

  //     // Check if the design with the given designId exists
  //     const designFound = data.userDesigns?.designs?.some(
  //       (design) => design._id === designId
  //     );
  //     setDesignExists(designFound);
  //   } catch (error) {
  //     console.error("Error fetching design:", error);
  //     toast.error("Failed to fetch design.");
  //     setDesignExists(false);
  //   } finally {
  //     setIsFetchingDesign(false);
  //   }
  // };
  const AddToCartClick = () => {
    setRetrieveLoader(true);
    // fetchDesign();
    fetchDesign(customerEmail).then((data) => {
      const designFound = data.userDesigns?.designs?.some(
        (design) => design._id === designId
      );
      const design = data.userDesigns?.designs?.filter((d) => d._id == designId);
      setDesignExists(designFound);
      setCurrentDesing(design)
    }).catch((error) => {
      console.error("Error fetching design:", error);
      toast.error("Failed to fetch design.");
      setDesignExists(false);
      setIsFetchingDesign(false);
    });
  }

  // useEffect(() => {
  //   setRetrieveLoader(true);
  //   fetchDesign();
  // }, []);

  useEffect(() => {
    if (!isFetchingDesign && retrieveLoader) {
      setRetrieveLoader(false);
      setSaveDesignLoader(true);
    }
  }, [isFetchingDesign, retrieveLoader]);

  // useEffect(() => {
  //   if (emailSendingLoader) {
  //     const timer = setTimeout(() => setEmailSendingLoader(false), 4000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [emailSendingLoader]);

  // async function uploadBlobData(blobDataArray) {
  //   try {
  //     const formData = new FormData();
  //     blobDataArray = blobDataArray.slice(0, 6);
  //     blobDataArray.forEach((blob, index) => {
  //       formData.append(`image_${index}`, blob, `image_${index}.png`);
  //     });

  //     const response = await apiConnecter(
  //       "POST",
  //       "imageOperation/fileBlobDataUploadToCloudinary",
  //       formData
  //     );

  //     const responseData = response.data;
  //     console.log("Response from backend:", responseData);
  //     localStorage.setItem("data", JSON.stringify(responseData));
  //     return responseData;
  //   } catch (e) {
  //     console.error("Error uploading blob data:", e);
  //     throw e;
  //   }
  // }

  // async function saveDesignFunction(payload) {
  //   try {
  //     const response = await apiConnecter(
  //       "POST",
  //       "design/save-designfrontEnd",
  //       payload
  //     );

  //   const responseData = response.data;
  //   console.log("Design saved successfully:", responseData);
  //   setdesignStateDb(responseData);
  //   const designs = responseData.userDesigns?.designs;
  //   console.log(design);
  //   setCurrentDesing(designs[designs.length - 1]);
  //   return responseData;
  // } catch (error) {
  //   console.error("Error saving design:", error);
  //   throw error;
  // }
  //   }
  // mail funstion
  // async function sendEmailDesign(payload) {
  //   try {
  //     const response = await apiConnecter(
  //       "POST",
  //       "design/send-email-design",
  //       payload
  //     );
  //     console.log("Email sent successfully:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     toast.error("Failed to send email.");
  //     throw error;
  //   }
  // }




  // --

  const reviewItems = Object.entries(productState).map(([id, product]) => {
    // console.log("product udner entries", product)
    const sizes = Object.entries(product.selections).reduce((acc, [size, qty]) => {
      if (qty > 0) acc[size] = qty;
      return acc;
    }, {});
    // console.log("productstate ", product);

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

  // console.log("reviewItems", reviewItems);

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
      const hasContent = Boolean(present[area].texts.length) || Boolean(present[area].images.length)
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
    // console.log(allTexts)

    const colorSet = new Set();
    allTexts.forEach((text) => {
      if (text.textColor) {
        colorSet.add(text.textColor);
      }
    });
    // console.log(colorSet)

    return colorSet.size; // if you want the list
  };

  const goBack = () => {
    navigate("/quantity");
  };

  const [url, setUrl] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [activeSide, setActiveSide] = useState("");

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

  function makeVariantDataForShopify(reviewItems, CloudinaryImages) {
    const splitIntoPairs = (arr) => {
      const result = [];
      for (let i = 0; i < arr.length; i += 2) {
        result.push(arr.slice(i, i + 2));
      }
      return result;
    };
    const ShopifyData = [];

    const groupedImages = splitIntoPairs(CloudinaryImages.files);
    console.log("CloudinaryImages", CloudinaryImages);
    const data = reviewItems.forEach((product, index) => {
      const allVariants = product.allVariants;
      const obj = {
        product_id: product?.variantId,
        option1: "S",
        option2: product?.color,
        price: product?.price,
        sku: "B665D8502",
        inventory_quantity: product?.inventory_quantity,
        image_urls: [
          "https://simaxdesigns.imgix.net/uploads/1753094129600_front-design.png",
        ],
      };
      const sizeskey = Object.entries(product?.sizes);
      const color = product?.color;
      const variantTitles = sizeskey.map(([size, count]) => {
        return { title: `${color} / ${size}`, inventory_quantity: count };
      });

      const data = variantTitles.map((varianttitle) => {
        const variantData = allVariants.find((v) => v.title == varianttitle.title);
        console.log(variantData, "variantdata");
        const newData = {
          variant_id: variantData.id.split("/").reverse()[0],
          size: varianttitle.title.split("/")[1].trim(),
          color: varianttitle.title.split("/")[0].trim(),
          price: discountData?.summary?.eachAfterDiscount,
          sku: variantData?.sku,
          "designId": currentDesign?._id,
          quantity: Number(varianttitle.inventory_quantity),
          "vendor": "Addidas test",
          "custom": true,
          "design": {
            "front": groupedImages[index][0],
            "back": groupedImages[index][1],
            "left": groupedImages[index][1],
            "right": groupedImages[index][1]
          },
          "PreviewImageUrl": groupedImages[index][0],
        };
        ShopifyData.push(newData);
        return newData;
      });
      return data;
    });
    console.log("data.....", ShopifyData);
    createDraftOrderforCheckout(ShopifyData);
  }

  function getIncreasedData(data, value) {
    console.log("increase by value ", value);

    const cloned = JSON.parse(JSON.stringify(data)); // Deep clone
    const q = cloned.items[0]?.sizes?.S || 0;
    cloned.items[0].sizes.S = parseInt(q + value); // Fixed key case
    return cloned;
  }


  function makeVariantDataForDiscound(reviewItems) {

    const discountData = [];

    // const groupedImages = splitIntoPairs(CloudinaryImages.files);
    // console.log("CloudinaryImages", CloudinaryImages);
    const data = reviewItems.forEach((product, index) => {
      const allVariants = product.allVariants;

      const sizeskey = Object.entries(product?.sizes);
      const color = product?.color;
      const variantTitles = sizeskey.map(([size, count]) => {
        return { title: `${color} / ${size}`, inventory_quantity: count };
      });

      const data = variantTitles.map((varianttitle) => {
        const variantData = allVariants.find((v) => v.title == varianttitle.title);
        console.log(variantData, "variantdata");
        const size = varianttitle.title.split("/")[1].trim();

        const newData = {
          unitPrice: Number.parseFloat(variantData?.price),
          printAreas: printAreaCount,
          sku: variantData?.sku,
          name: variantData?.title,
          // quantity: Number(varianttitle.inventory_quantity),
          "sizes": {
            [size]: Number(varianttitle.inventory_quantity)
          },

        };
        discountData.push(newData);
        return newData;
      });
      return data;
    });
    const dataForDiscountCheck = {
      items: discountData, flags: {
        "collegiateLicense": CollegiateLicense
      }
    }
    console.log("data.....", dataForDiscountCheck);
    console.log("totalItems", totalItems)
    if (totalItems == 0) return;
    calculatePriceAndDiscount(dataForDiscountCheck);
    const increasedData = getIncreasedData(dataForDiscountCheck, (totalItems * 0.7));
    calculatePriceAndDiscount2(increasedData);
    const increasedData2 = getIncreasedData(dataForDiscountCheck, (totalItems * 1.5));
    calculatePriceAndDiscount2(increasedData2);

  }
  useEffect(() => {
    makeVariantDataForDiscound(reviewItems);
  }, [])
  // setEmailSendingLoader(false);
  async function createDraftOrderforCheckout(variants) {
    try {
      // setLoading(true);
      // setEmailSendingLoader(true); // <-- If this loader is relevant here

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
      console.log("Success:", data);

      if (data?.checkoutUrl) {
        window.location.href = data?.checkoutUrl
        // window.open(data.checkoutUrl, '_blank');
      } else {
        throw new Error("No checkout URL returned");
      }

      return data;
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    } finally {
      // setLoading(false);
      setEmailSendingLoader(false); // <-- Only if applicable
    }
  }
  async function calculatePriceAndDiscount(varints) {
    try {
      setLoading(true);
      // setEmailSendingLoader(true); // <-- If this loader is relevant here

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth/calculatePrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(varints)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDiscountData(data);
      console.log("Success and get Discount:", data);



      // return data;
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    } finally {
      setLoading(false);
      // setEmailSendingLoader(false); // <-- Only if applicable
    }
  }

  async function calculatePriceAndDiscount2(varints) {
    try {
      setLoading(true);
      // setEmailSendingLoader(true); // <-- If this loader is relevant here

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth/calculatePrice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(varints)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // setDiscountData(data);
      const grandTotal = data.summary.grandTotal;
      const totalQuantity = data.summary.totalQuantity
      const eachPerUnit = parseFloat(grandTotal / totalQuantity).toFixed(2)
      if (extraInformation.length < 2) {
        setExtraInformation((prev) => [...prev, { totalQuantity, eachPerUnit }])
      }
      console.log(extraInformation, "extraInformation");
      console.log("Success and get Discount for futere:", data);
      // return data;
    } catch (error) {
      console.error("Error adding variants:", error);
      toast.error("Failed to add variants.");
    } finally {
      setLoading(false);
      // setEmailSendingLoader(false); // <-- Only if applicable
    }
  }
  const cartHandler = () => {
    setShowPopup(true);
  };

  const handleSaveDesign = async (payload) => {
    // setLoading(true);
    setShowPopup(false);
    setSaveDesignLoader(false);
    setEmailSendingLoader(true);// Close SaveDesignModal/SaveDesignPopup
    try {
      // Update designPayload with the provided name and optional designId
      designPayload.design.DesignName = payload.name;
      if (payload.type === "update" && payload.designId) {
        designPayload.design.designId = payload.designId;
      } else {
        delete designPayload.design.designId; // Ensure designId is not sent for new designs
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
        const frontBackground = item.allImages[0];
        const backBackground = item.allImages[1];
        const leftBackground = item.allImages[2];

        const frontDesignImages = await generateDesigns(
          [frontBackground],
          allFrontTextElement,
          allFrontImagesElement
        );

        const backDesignImages = await generateDesigns(
          [backBackground],
          allBackTextElement,
          allBackImagesElement
        );

        return {
          front: frontDesignImages[0],
          back: backDesignImages[0],
        };
      });

      const results = await Promise.all(designPromises);
      console.log("All Generated Designs:", results);

      const blobData = results.reduce((arr, item) => {
        arr.push(base64toBlob(item.front, "image/png"));
        arr.push(base64toBlob(item.back, "image/png"));
        return arr;
      }, []);

      console.log("blobData:", blobData);
      const cloudinaryResponse = await uploadBlobData(blobData);
      console.log("Cloudinary Response:", cloudinaryResponse);

      designPayload.design.FinalImages = cloudinaryResponse?.files?.map((url) => url) || [];
      // Calling save design api
      await saveDesignFunction(designPayload);
      // api call for email send
      try {

        const emailPayload = {
          email: customerEmail,
          companyEmail: "service@simaxsports.com",
          frontSrc: cloudinaryResponse?.files?.[0] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786256753_download_4.png",
          backSrc: cloudinaryResponse?.files?.[1] || "https://simaxbucket.s3.us-east-1.amazonaws.com/uploads/1755786306809_download_5.png",
          designname: "Email Test",
          phoneNumber: "1234567890",
          edit_design_link: "#",
          add_to_cart_link: "#",
          unsubscribe_link: "#",
        };
        console.log("emailPayload",emailPayload)
        await sendEmailDesign(emailPayload);
        // toast.success("Email sent successfully!");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        toast.error("Failed to send email.");
      } finally {
        // setEmailSendingLoader(false);
      }
      const variantData = makeVariantDataForShopify(reviewItems, cloudinaryResponse);
      // toast.success("Design saved and variants prepared successfully!");

      // Show EmailSendingModal if emailUpdates is true
      // if (payload.emailUpdates) {

      //   setEmailSendingLoader(true);
      // }
    } catch (error) {
      console.error("Error in handleSaveDesign:", error);
      toast.error("Failed to save design or prepare variants.");
    } finally {
      // setLoading(false);
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
    // console.log("design.back.nameAndNumberProductList.length", design.back.nameAndNumberProductList)
    const isNameOrNumberEnabled = addName || addNumber;
    const isProductListEmpty = design?.back?.nameAndNumberProductList?.every(
      (item) => item.selections.length == 0
    );
    if (isNameOrNumberEnabled && isProductListEmpty && allImagesAndTextsEmpty) return true;
    if (isNameOrNumberEnabled && !isProductListEmpty) return false;
    return allImagesAndTextsEmpty;

    // return shouldShow;
  };
  // useEffect(() => {
  //   setRetrieveLoader(true);
  //   setTimeout(() => {
  //     setRetrieveLoader(false);
  //     setSaveDesignLoader(true);
  //   }, 5000);
  //   setTimeout(() => {

  //     setEmailSendingLoader(true)
  //     setSaveDesignLoader(false);
  //     setTimeout(() => {
  //       setEmailSendingLoader(false)
  //     }, 4000);
  //   }, 10000);

  // }, [])

  function restorePresentFromData(incomingPresent, src) {
    const sides = ["front", "back", "leftSleeve", "rightSleeve"];
    const restored = {};

    sides.forEach(side => {
      const originalImages = incomingPresent?.[side]?.images || [];

      const enhancedImages = originalImages.map(image => ({
        ...image,
        base64CanvasImage: image.src  // Add base64 image string to each image
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
      // const searchParams = new URLSearchParams(location.search);
      // const designId = searchParams.get("designId");
      const designId = "test"
      console.log(designStateDb);

      const matchedDesigns = designStateDb.userDesigns.designs.filter(
        (d) => d.DesignName == "test2"
      );

      if (matchedDesigns.length === 0) {
        console.error("Design not found for id:", designId);
      } else {
        const apiData = matchedDesigns[0]; // get the first match

        const restoredState = {
          // ...initialState,
          present: restorePresentFromData(apiData.present),
          // DesignNotes: apiData.DesignNotes || initialState.DesignNotes,
        };
        console.log(restorePresentFromData(apiData.present));
        dispatch(restoreEditDesigns(restorePresentFromData(apiData.present)))

        console.log(restoredState);
      }

    }
    catch (e) {
      console.log("error while fetching desing", e)
    }

  }

  return (
    <>
      {
        loading ? <>

          <div className={styles.loaderWrapper}>
            <div className={styles.loader}></div>
            <p>calculating price...</p>
          </div>

        </> : <>
          <div className={styles.container}>
            {retrieveLoader && (
              <RetrieveSavedDesignsModal
                onClose={() => setRetrieveLoader(false)}
                isFetchingDesign={isFetchingDesign}
                designExists={designExists}
              />
            )}
            {saveDesignLoader &&
              (designExists ? (
                <SaveDesignModal
                  onClose={() => setSaveDesignLoader(false)}
                  onSubmit={handleSaveDesign}
                  defaultDesignName="Demo T-Shirt 55555"
                  designId={designId}
                  currentDesign={currentDesign}
                />
              ) : (
                <AddToCartPopup
                  onSave={handleSaveDesign}
                  defaultDesignName=""
                  onClose={() => setSaveDesignLoader(false)}
                />
              ))}
            {emailSendingLoader && (
              <EmailSendingModal onClose={() => setEmailSendingLoader(false)} />
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
                  {discountData?.summary?.discountTier?.percent > 0 && <>
                    < p >
                      <span className={styles.strike}>${discountData?.summary?.eachBeforeDiscount}</span>
                      <span className={styles.discounted}> ${discountData?.summary?.eachAfterDiscount} each</span>
                    </p>
                    <p>
                      <span className={styles.strikeSmall}>
                        ${discountData?.summary?.baseSubtotal}
                      </span>
                      <span className={`${styles.total}`}>
                        {" "}
                        <span className={styles.dollarText}>${discountData?.summary?.grandTotal}</span> total
                        with {discountData?.summary?.discountTier?.percent}% off Bulk Discount
                      </span>
                    </p></>}
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
                  {extraInformation?.map((item, index) => {
                    const unitPrice = 5.59;
                    const discountedPrice = (unitPrice * (1 - item.rate)).toFixed(2);
                    return (
                      <span key={index}>
                        {item.totalQuantity} items for{" "}
                        <span className={styles.dollarText}>${item.eachPerUnit}</span>ea.
                        {index !== extraInformation.length - 1 && <span> | </span>}
                      </span>
                    );
                  })}
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
                            ${discountData?.summary?.eachAfterDiscount} <span>each</span>
                          </p>
                        </div>
                        <p className={styles.itemSubtitle}>
                          {item.color} | {totalItems} Items
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
                {CollegiateLicense && <div className={styles.extraFees}>
                  <p>
                    Collegiate License <span>${discountData?.summary?.fees?.licenseFee || 0}</span>
                  </p>
                </div>
                }

                {/* <button className={styles.addToCart} onClick={cartHandler}>
            ADD TO CART <LuArrowRight />
          </button> */}


                <button className={styles.addToCart} onClick={AddToCartClick}>
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
              {/* <button onClick={(e) => {

          editDesignHandler(e.target.value)
        }} style={{ color: "red", fontSize: 20 }}>getUrlDesign</button> */}
            </div>

            {showPopup && (
              <AddToCartPopup
                onSave={handleSaveDesign}
                onClose={() => setShowPopup(false)}
              />
            )}
            <div
              className="canvas-wrapper"
              style={{ position: "relative", top: 5, display: "none" }}
            >
              <canvas id="canvas-export" style={{ display: "none" }} />
            </div>
          </div></>
      }</>

  );
};

export default Review;