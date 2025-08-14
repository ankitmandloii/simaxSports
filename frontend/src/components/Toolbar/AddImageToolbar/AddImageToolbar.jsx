
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AddImageToolbar.module.css'
import {
  AlignCenterIcon,
  LayeringFirstIcon,
  LayeringSecondIcon,
  FlipFirstIcon,
  FlipSecondIcon,
  LockIcon,
  DuplicateIcon,
  AngleActionIcon,
  FlipFirstWhiteColorIcon,
  FlipSecondWhiteColorIcon,
  LayeringFirstIconWithBlackBg,
  LayeringSecondIconWithBlackBg,
  CrossIcon,
} from '../../iconsSvg/CustomIcon.js';
import { FaChevronRight } from "react-icons/fa6";
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateImageState, moveElementBackwardState, moveElementForwardState, toggleImageLockState, toggleLoading, toggleLockState, updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { useNavigate } from 'react-router-dom';
import ReplaceBackgroundColorPicker from '../../CommonComponent/ChooseColorBox/ReplaceBackgroundColorPicker.jsx';
import ReplaceBg from '../ReplaceBg/ReplaceBg.jsx';




const AddImageToolbar = () => {
  const BASE_FILTERS = [
    { name: 'Normal', transform: '' },
    { name: 'Single Color', transform: '?monochrome=white' },
    { name: 'Black/White', transform: '?sat=-100' },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);

  const img = allImageData?.find((img) => img.id == selectedImageId);
  const isLocked = img?.locked;

  const [rangeValuesSize, setRangeValuesSize] = useState(0);
  const [rangeValuesRotate, setRangeValuesRotate] = useState(0);
  const [flipXValue, setflipXValue] = useState(false);
  const [flipYValue, setflipYValue] = useState(false);
  const [duplicateActive, setDuplicateActive] = useState(false);
  const [centerActive, setCenterActive] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [threshold, setThreshold] = useState(144);
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTransform, setActiveTransform] = useState('');
  const [superResolution, setSuperResolution] = useState(false);
  const [cropAndTrim, setCropAndTrim] = useState(false);
  const [bgColor, setBgColor] = useState("var(--black-color)");
  const [singleColor, setSingleColor] = useState("");
  const [invertColor, setInvertColor] = useState(false);
  const [solidColor, setSolidColor] = useState(false);
  const [editColor, setEditColor] = useState(false);
  const [resetDefault, setResetDefault] = useState(false);
  const [filters, setFilters] = useState(BASE_FILTERS);
  const [activeEffects, setActiveEffects] = useState([]);
  const [bgColorPopup, setBGColorPopup] = useState(false);
  const [ColorPopup, setColorPopup] = useState(false);
  const [replacebgwithAi, setreplaceBgwithAi] = useState(true);
  //  const [activeFilter, setActiveFilter] = useState(filters[0]);


  const imgRef = useRef(null);
  const textareaRef = useRef(null)

  const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;

  const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  // const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);


  // console.log("-----------imggg", imageContaintObject);

  useEffect(() => {

  }, [editColor, invertColor, selectedFilter])
  // Init from store
  useEffect(() => {
    // console.log("--img", img)
    if (!img) return handleBack();
    setRangeValuesSize(img.scaledValue || 1);
    setRangeValuesRotate(img.angle || 0);
    setflipXValue(img.flipX || false);
    setflipYValue(img.flipY || false);
    setSelectedFilter(img?.selectedFilter || "Normal")
    setLoading(img.loading)
    setSingleColor(img.singleColor);
    setThreshold(img.thresholdValue);
    setSolidColor(img.solidColor);
    setEditColor(img.editColor);

    // const tempImage = new Image();
    // globalDispatch("loading", true);
    // setLoading(true);
    // tempImage.onload = () => {
    //   setLoading(false);
    //   globalDispatch("loading", false)
    setPreviewUrl(img.src || '');
    console.log(previewUrl);
    // }
    // tempImage.onerror = () => {
    //   console.error("Failed to load image:", img?.src);
    //   setPreviewUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif");
    //   setLoading(false);
    //   globalDispatch("loading", false);
    // };

    // tempImage.src = img?.src
    try {
      const params = img.src?.split('?')[1] || '';
      const currentTransform = params ? `?${params}` : '';
      setActiveTransform(currentTransform);
      const currentEffects = params
        ? params.split('&').filter(param =>
          !BASE_FILTERS.some(f => f.transform.includes(param))
        )
        : [];
      console.log("cureent effects", currentEffects);
      setActiveEffects(currentEffects);
      setRemoveBackground(img.removeBg);
      setSuperResolution(img.superResolution);
      setCropAndTrim(img.cropAndTrim);
      setInvertColor(img.invertColor);
      setSolidColor(img.solidColor);
      // console.log("----------seleeee", selectedFilter);


      // const baseFilter = BASE_FILTERS.find(f =>
      //   currentTransform.includes(f.transform.replace('?', ''))
      // ) || BASE_FILTERS[0];
      // setSelectedFilter(baseFilter.name);
    } catch { }
  }, [img, selectedImageId, resetDefault, img?.loading]);


  async function processAndReplaceColors(imageSrc, color, editColor = false, extractedColors = []) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();

      // Handle cross-origin
      if (!imageSrc.startsWith("data:image")) {
        img.crossOrigin = "anonymous";
      }

      img.src = imageSrc;

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      // Draw image on canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let data = imageData.data;

      if (editColor) {
        const paletteUrl = imageSrc.split("?  ")[0] + "?palette=json";
        const res = await fetch(paletteUrl);
        const json = await res.json();
        const colors = json?.colors?.map(c => `${c.hex}`) || [];
        const updateColors = [...extractedColors];

        const minLength = Math.min(colors.length, updateColors.length);
        for (let i = 0; i < minLength; i++) {
          const targetColor = hexToRgbForReplaceColor(colors[i]);
          const newColor = hexToRgbForReplaceColor(updateColors[i]);

          for (let j = 0; j < data.length; j += 4) {
            const r = data[j], g = data[j + 1], b = data[j + 2];
            if (colorsMatch([r, g, b], targetColor, 50)) {
              data[j] = newColor[0];
              data[j + 1] = newColor[1];
              data[j + 2] = newColor[2];
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Convert canvas to blob and return object URL
      const objectURL = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/png", 0.92);
      });

      // Cleanup
      canvas.width = 0;
      canvas.height = 0;
      // canvas.remove();

      return objectURL;

    } catch (error) {
      console.error('Error in processing the image:', error);
      throw error;
    }
  }



  async function handleImage(imageSrc, color = "#ffffff", selectedFilter, invertColor, editColor) {
    try {


      setResetDefault(false);

      // globalDispatch("editColor", false);
      console.log("handle image function called with src", imageSrc);
      globalDispatch("loading", true); // Corrected the typo here

      // Await the base64 image after processing the image

      let currentBase64Image;
      console.log("curent seleteced filter is ", selectedFilter, img.selectedFilter)

      if (selectedFilter == "Single Color") {
        if (invertColor) {
          const applyFilterURL = await applyFilterAndGetUrl(imageSrc, color);
          currentBase64Image = await invertColorsAndGetUrl(applyFilterURL || previewUrl);
        }
        else {
          currentBase64Image = await applyFilterAndGetUrl(imageSrc, color);
        }
      }
      else if (selectedFilter == "Normal") {
        console.log("edit color state is: ", editColor)
        if (editColor) {
          currentBase64Image = await processAndReplaceColors(imageSrc, color, editColor, extractedColors);
        }
        else {
          currentBase64Image = await getBase64CanvasImage(imageSrc, color)

        }
      }
      else {
        currentBase64Image = await getBase64CanvasImage(imageSrc, color)
      }


      // Set the base64 image and dispatch it to the global state
      setBase64Image(currentBase64Image);

      // Dispatch the base64 string to your global state (no need to convert it to a string again)
      globalDispatch("base64CanvasImage", currentBase64Image);

      globalDispatch("base64CanvasImage", String(currentBase64Image));
      if (selectedFilter == "Normal") {
        globalDispatch("base64CanvasImageForNormalColor", String(currentBase64Image));
      }
      else if (selectedFilter == "Single Color") {
        globalDispatch("base64CanvasImageForSinglelColor", String(currentBase64Image));
      }
      else {
        globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(imageSrc));

      }

      // Set loading to false after the process is done
      globalDispatch("loading", false); // Corrected the typo here

      // Log the base64 image string to the console
      // console.log("base64CanvasImage:", base64Image.slice(0,5)); // Now you should see the actual base64 string

      // Now you can use the base64Image with fabric.js or any other logic you need
    } catch (error) {
      globalDispatch("loading", false); // Ensure loading is stopped even in case of error
      console.error("Error:", error); // Log any errors that occur
    }
  }


  useEffect(() => {
    const tempImage = new Image();
    // globalDispatch("loading", true);
    setLoading(true);
    tempImage.onload = () => {
      setLoading(false);
      // globalDispatch("loading", false)
      setPreviewUrl(img.src || '');
      // handleImage(previewUrl, singleColor, selectedFilter, invertColor);
    }
    tempImage.onerror = () => {
      console.error("Failed to load image:", img?.src);
      setPreviewUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif");
      setLoading(false);
      globalDispatch("loading", false);
    };

    tempImage.src = img?.src
  }, [selectedImageId])


  useEffect(() => {
    // console.log("%%%%%%%%%%%%%%%%Actiev efect", activeEffects)
    setFilters(BASE_FILTERS.map(filter => {
      const newActiveEffects = activeEffects.filter((f) => f != "invert=true");
      if (filter.name === 'Normal') {
        return {
          ...filter,
          transform: activeEffects.length ? `?${newActiveEffects.join('&')}` : '',
          image: img?.base64CanvasImageForNormalColor || buildUrl(activeEffects.length ? `?${newActiveEffects.join('&')}` : '', false, filter.name)
        };
      }
      if (filter.name === "Black/White") {
        const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
        const allParams = [...new Set([...baseParams, ...newActiveEffects])];
        return {
          ...filter,
          transform: allParams.length ? `?${allParams.join('&')}` : '',
          image: img?.base64CanvasImageForBlackAndWhitelColor || buildUrl(allParams.length ? `?${allParams.join('&')}` : '', false, filter.name)
        };
      }

      const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
      const allParams = [...new Set([...baseParams, ...activeEffects])];
      return {
        ...filter,
        transform: allParams.length ? `?${allParams.join('&')}` : '',
        image: img?.base64CanvasImageForSinglelColor || buildUrl(allParams.length ? `?${allParams.join('&')}` : '', false, filter.name)
      };
    }));
    // console.log(filters, "&&&&&&&&&&&&")
  }, [activeEffects, selectedImageId, img?.src]);

  const handleRangeInputSizeChange = (e) => {

    const rawValue = e.target.value;
    // console.log("------value", rawValue)
    setRangeValuesSize(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    const scaleX = img?.scaleX;
    const scaleY = img?.scaleY;

    // Use average of current X and Y scale as "prev size"
    const currentAvg = (scaleX + scaleY) / 2;

    const scaleRatio = parsed / currentAvg;

    globalDispatch("scaleX", scaleX * scaleRatio);
    globalDispatch("scaleY", scaleY * scaleRatio);
    globalDispatch("scaledValue", parsed);
    setResetDefault(false);
  };

  const DPI = 300; // dots per inch

  const handleBlur = () => {
    const parsed = parseFloat(rangeValuesSize);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
      setRangeValuesSize("1");
      globalDispatch("scaleX", 1);
      globalDispatch("scaleY", 1);
      globalDispatch("scaledValue", 1);
    }
    setResetDefault(false);
  };



  const handleRangeInputRotateChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesRotate(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) return;

    globalDispatch("angle", parsed);
    setResetDefault(false);
  };


  const handleRotateBlur = () => {
    const parsed = parseFloat(rangeValuesRotate);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) {
      setRangeValuesRotate("0");
      globalDispatch("angle", 0);
    }
    setResetDefault(false);
  };
  const handleDuplicateImage = () => {
    if (!selectedImageId) return;
    dispatch(duplicateImageState(selectedImageId));
  };


  const handleBack = () => {
    navigate('/design/product');
  }

  const globalDispatch = (label, value) => {
    dispatch(updateImageState({ id: selectedImageId, changes: { [label]: value }, isRenderOrNot: true }));
  };


  // const [filters, setFilters] = useState([
  //   { name: 'Normal', transform: '' },
  //   { name: 'Single Color', transform: '?monochrome=ff0000' },
  //   { name: 'Black/White', transform: '?sat=-100' }
  // ]);


  const buildUrl = useCallback((transform, resetAll, filterName) => {
    // console.log(transform, filterName, filterName, "<<<<<<<<<<<<<<<<<<<<<<")
    const base = img?.src?.split('?')[0] || '';
    if (resetAll) {
      return base;
    }
    return `${base}${transform}`;
  }, [img]);

  const applyTransform = useCallback(
    async (transform, resetAll, editColor) => {
      if (!img?.src) return;

      console.log("aply tranform call with tranform", transform);

      const newUrl = buildUrl(transform, resetAll);
      const loadingPlaceholder = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s'; // or any placeholder image

      // Set loading: true in local + global state
      setLoading(true);
      setPreviewUrl(loadingPlaceholder);
      const changes = {
        loading: true,
        position: img.position
      }
      // dispatch(toggleLoading({ changes }));
      // globalDispatch("loadingSrc", loadingPlaceholder);
      // globalDispatch("src", img.src); // keep old src while loading
      globalDispatch("loading", true); // keep old src while loading
      // globalDispatch("transform", transform);

      // Load transformed image
      const tempImage = new Image();
      tempImage.onload = async () => {
        // Only update everything when loaded successfully
        setPreviewUrl(newUrl);
        setActiveTransform(transform);

        globalDispatch("src", newUrl);
        await handleImage(newUrl, singleColor, selectedFilter, invertColor, false);
        dispatch(toggleLoading({ changes: { loading: false } }));
        globalDispatch("loadingSrc", null);
        // globalDispatch("loading", false);

        globalDispatch("removeBg", transform.includes("bg-remove=true"));
        globalDispatch(
          "removeBgParamValue",
          transform.includes("bg-remove=true") ? "bg-remove=true" : ""
        );

        // console.log("URL..............", newUrl)

        setLoading(false);
      };

      tempImage.onerror = () => {
        console.error("Failed to load image:", newUrl);
        setPreviewUrl(img.src);
        setLoading(false);
        globalDispatch("loading", false);
        globalDispatch("loadingSrc", null);
      };

      tempImage.src = newUrl; // Begin load
    },
    [img, buildUrl, globalDispatch]
  );



  const toggleEffect = (effect) => {
    setActiveEffects(prev => {
      const newEffects = prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect];

      const baseFilter = filters.find(f => f.name === selectedFilter) || BASE_FILTERS[0];
      const baseParams = baseFilter.transform.replace('?', '').split('&').filter(param =>
        BASE_FILTERS.some(base => base.transform.replace('?', '').includes(param))
      );

      const allParams = [...new Set([...baseParams, ...newEffects])];
      const newTransform = allParams.length ? `?${allParams.join('&')}` : '';

      applyTransform(newTransform, false, editColor);
      return newEffects;
    });
  };

  // Toggle a URL query parameter (like 'bg-remove=true') on/off in the activeTransform
  const toggle = (param, condition, filterName) => {
    // console.log("active tranform .......", activeTransform)
    console.log("toggle  functin call ", param, condition, filterName);
    // If condition is true, we want to **remove** the param from the activeTransform
    if (condition) {
      // Use a RegExp to find and remove the param and its trailing '&' if present
      // Example: '?invert=true&bg-remove=true' -> remove 'bg-remove=true'
      const cleaned = activeTransform.replace(new RegExp(`${param}(&|$)`), '');

      // Call applyTransform with the new transform string (with param removed)
      return applyTransform(cleaned, false, editColor);
    }

    // If condition is false, we want to **add** the param to the activeTransform
    // Decide whether to add with `?` or `&` depending on whether transform is empty or not
    const separator = activeTransform ? '&' : '?';

    // Build the new transform string with param added
    const updated = `${activeTransform}${separator}${param}`;

    // Call applyTransform with the new transform string (with param added)
    return applyTransform(updated, false, editColor);
  };

  const isActive = useCallback((param) => activeTransform.includes(param), [activeTransform]);


  const callForXFlip = () => {
    const value = !(img.flipX);
    setflipXValue(value);
    globalDispatch("flipX", value);
    // console.log("clicked", value);
    setResetDefault(false);
  }


  const callForYFlip = () => {
    const value = !(img.flipY);
    setflipYValue(value);
    //console.log("y value ", value);
    globalDispatch("flipY", value);
    setResetDefault(false);
  }

  const handleBringBackward = () => {
    // console.log("sending id ", selectedTextId)
    // dispatch(moveTextBackwardState(selectedTextId));
    dispatch(moveElementBackwardState(selectedImageId));

  };
  const handleBringForward = () => {
    // dispatch(moveTextForwardState(selectedTextId));
    dispatch(moveElementForwardState(selectedImageId));

  };


  function getRenderIconForSendToTop() {
    if (!img || (!allTextInputData && !allImageData)) return;

    // Calculate total number of elements (texts + images)
    const totalElements = (allTextInputData?.length || 0) + (allImageData?.length || 0);
    const layerIndex = img.layerIndex;

    // If the element is already at the top (highest layerIndex)
    if (layerIndex >= totalElements - 1) return true;

    return false;
  }

  function getRenderIconForSendToBack() {
    if (!img || (!allTextInputData && !allImageData)) return;

    const layerIndex = img.layerIndex;

    // If the element is already at the bottom (layerIndex 0)
    if (layerIndex <= 0) return true;

    return false;
  }


  const hasMounted = useRef(false); // ✅ move to top level

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // ⛔ skip on first render
    }

    removeBackgroundHandler(); // ✅ run on subsequent changes only
  }, [img?.removeBg]);

  function removeBackgroundHandler(e) {
    // update local state
    console.log("clicked on backgournd remove button");
    const checked = !removeBackground;
    const canvasToggle = document.querySelector(`[id^="canvas-"] input[type="checkbox"]`);
    if (canvasToggle && canvasToggle.checked !== checked) {
      canvasToggle.checked = checked;

      const slider = canvasToggle.nextElementSibling;

      const circle = slider?.nextElementSibling;
      slider.style.backgroundColor = checked ? "#3b82f6" : "#ccc";
      circle.style.transform = checked ? "translateX(18px)" : "translateX(0)";
    }

    const value = isActive('bg-remove=true');
    toggle('bg-remove=true', value)
    setRemoveBackground(!value);
    // update redux store
    globalDispatch("removeBg", !value);
    // handleImage(previewUrl);
    setResetDefault(false);
    fetchPalette();
    // setEditColor(false);
    // globalDispatch("editColor", false); 

  }

  async function invertColorHandler(base64Image) {
    // update local state
    // const value = isActive('invert=true');
    // toggle('invert=true', value)
    console.log("invert color funciton called");
    setInvertColor(!invertColor);
    // // update redux store
    globalDispatch("invertColor", !invertColor);
    setResetDefault(false);
    let Newbase64image;
    if (invertColor) {
      handleImage(img.src || previewUrl, singleColor, selectedFilter, !invertColor, editColor);
      // globalDispatch("base64CanvasImageForSinglelColor", String(Newbase64image));
    }
    else {
      globalDispatch("loading", true);
      Newbase64image = await invertColorsAndGetUrl(img.getBase64CanvasImage || base64Image || previewUrl);
      console.log("inverted image in base64", Newbase64image);
      globalDispatch("loading", false);
      globalDispatch("base64CanvasImage", Newbase64image);
      globalDispatch("base64CanvasImageForSinglelColor", String(Newbase64image));
    }



  }

  async function solidColorHandler(e) {
    // update local state
    const value = isActive('solid=true');
    // toggle('solid=true', value)
    // setSolidColor(!solidColor);
    globalDispatch("solidColor", !solidColor);
    globalDispatch("loading", true);
    console.log("solid color funciton called")

    // handleImage(previewUrl, color);
    const newBase64Image = await makeSolid(base64Image, threshold);
    // setPreviewUrl(String(newImgUrl));
    setBase64Image(newBase64Image)

    globalDispatch("base64CanvasImage", String(newBase64Image));
    if (selectedFilter == "Normal") {
      globalDispatch("base64CanvasImageForNormalColor", String(newBase64Image));
    }
    else if (selectedFilter === "Single Color") {
      globalDispatch("base64CanvasImageForSinglelColor", String(newBase64Image));
    }
    else {
      globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(newBase64Image));

    }
    globalDispatch("loading", false);
    // const base64 =

    // update redux store



    setResetDefault(false);
  }



  const bGReplaceColorChangedFunctionCalled = (color) => {
    const hex = color.replace('#', '');
    const value = isActive(`bg-remove=true&bg=${hex}`);
    toggle(`bg-remove=true&bg=${hex}`, value);

    setBgColor(color);
    setResetDefault(false);

    const imgixParam = `bg-remove=true&bg=${hex}`;
    globalDispatch("replaceBackgroundColor", color);
    globalDispatch("replaceBgParamValue", imgixParam);
  };

  function getBase64CanvasImage(imageSrc, color) {
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('HelperCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        // Optional: Fill background if needed (e.g., white)
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        // Export as Blob and convert to Object URL
        canvas.toBlob((blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            resolve(objectURL); // You can directly use this in img.src
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }

          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          // canvas.remove();
        }, "image/png", 0.92);
      };

      img.onerror = function () {
        reject(new Error("Failed to load image"));
      };
    });
  }
  async function makeSolid(imageSrc, threshold) {
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('HelperCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();

      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          const grayscale = (r + g + b) / 3;

          if (grayscale > threshold) {
            // Make transparent if light
            // data[i + 3] = 0;
          } else {
            // Keep original color and alpha
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            resolve(objectURL); // You can directly use this in img.src
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }

          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          // canvas.remove();
        }, "image/png", 0.92);
        // canvas.remove();
      };

      img.onerror = function () {
        resolve(imageSrc);
      };
    });
  }

  const [extractedColors, setExtractedColors] = useState([]);
  const [selectedColorToReplace, setSelectedColorToReplace] = useState(null);
  const [colorReplacePickerVisible, setColorReplacePickerVisible] = useState(false);
  const fetchPalette = async () => {
    if (!img?.src || selectedFilter !== "Normal") return;
    try {
      const paletteUrl = img.src.split("?")[0] + "?palette=json";
      const res = await fetch(paletteUrl);
      const json = await res.json();
      const colors = json?.colors?.map(c => `${c.hex}`) || [];
      setExtractedColors(colors);
      globalDispatch("extractedColors", colors);
    } catch (err) {
      console.error("Failed to fetch palette from Imgix:", err);
    }
  };
  useEffect(() => {
    if (img?.editColor) {
      setExtractedColors(img?.extractedColors);
    }
    else {
      fetchPalette();
    }
  }, [img?.src]);

  function applyFilterAndGetUrl(imageSrc, color) {
    imageSrc = String(imageSrc);
    if (imageSrc.includes("monochrome=black")) {
      imageSrc = imageSrc.replace("monochrome=black", "");
    }
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('HelperCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();

      // If imageSrc is base64, directly set img.src
      if (imageSrc.startsWith("data:image")) {
        img.src = imageSrc;
      } else {
        img.crossOrigin = "anonymous"; // Allow cross-  origin access
        img.src = imageSrc;  // For external URLs
      }

      img.onload = function () {
        // Set the canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Get the tint color in RGB
        const tint = hexToRgb(color);

        // Apply the effect: grayscale, sepia, and alpha tinting
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3]; // Alpha value

          // Calculate brightness and invert it
          const brightness = (r + g + b) / 3;
          const inverted = 255 - brightness;
          const alpha = inverted / 255;

          // If the pixel is fully transparent, retain transparency; else apply tint
          if (a === 0) {
            data[i + 3] = 0; // Keep the pixel transparent
          } else {
            // Apply tint color and alpha (preserving original alpha if the background exists)
            data[i] = tint.r; // Red
            data[i + 1] = tint.g; // Green
            data[i + 2] = tint.b; // Blue
            data[i + 3] = a * alpha; // Keep the transparency effect consistent
          }
        }

        // Put the altered image data back to the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the base64 representation of the canvas
        canvas.toBlob((blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            resolve(objectURL); // You can directly use this in img.src
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }

          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          // canvas.remove();
        }, "image/png", 0.92);
        // canvas.remove();
      };

      img.onerror = function () {
        resolve(imageSrc);
      };
    });
  }

  function invertColorsAndGetUrl(imageSrc) {
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('HelperCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();

      // If imageSrc is base64, directly set img.src
      if (imageSrc.startsWith("data:image")) {
        img.src = imageSrc;
      } else {
        img.crossOrigin = "anonymous"; // Allow cross-origin access
        img.src = imageSrc;  // For external URLs
      }

      img.onload = function () {
        // Set the canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Loop through each pixel and invert the brightness
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];     // Red
          data[i + 1] = 255 - data[i + 1]; // Green
          data[i + 2] = 255 - data[i + 2]; // Blue
        }

        // Put the altered image data back to the canvas
        ctx.putImageData(imageData, 0, 0);

        // Return the base64 representation of the inverted image
        canvas.toBlob((blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            resolve(objectURL); // You can directly use this in img.src
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }

          // Clean up canvas
          canvas.width = 0;
          canvas.height = 0;
          // canvas.remove();
        }, "image/png", 0.92);
        // canvas.remove();
      };

      img.onerror = function () {
        resolve(imageSrc);
      };
    });
  }



  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  const createBlobUrl = (base64Image) => {
    base64Image = String(base64Image)
    // Ensure the base64 string contains the 'data:image' header
    if (base64Image && base64Image.startsWith('data:image')) {
      const byteString = atob(base64Image.split(',')[1]); // Decode base64 string to binary data
      const ab = new ArrayBuffer(byteString.length);
      const ua = new Uint8Array(ab);

      // Fill the array with the decoded byte string
      for (let i = 0; i < byteString.length; i++) {
        ua[i] = byteString.charCodeAt(i);
      }

      // Create a Blob object from the binary data
      const blob = new Blob([ab], { type: 'image/png' });

      // Return a temporary URL representing the Blob object
      return URL.createObjectURL(blob);
    } else {
      console.error("Invalid base64 image string");
      return null;
    }
  };
  const ColorChangedFunctionCalled = async (color) => {
    // console.log("-----chngcolor", color)
    const hex = color.replace('#', '');
    // const value = isActive(`bg-remove=true&bg=${hex}`);
    // setColor(color);
    // globalDispatch("loading", true);
    globalDispatch("singleColor", color);
    setSingleColor(color);

    // handleImage(previewUrl, color);
    console.log("color cahnges funcitonc called", color, previewUrl);
    const newBase64Image = await handleImage(img.src || previewUrl, color, selectedFilter, invertColor.editColor);
    // setPreviewUrl(String(newImgUrl));
    // setBase64Image(newBase64Image)

    // globalDispatch("base64CanvasImage", String(newBase64Image));
    // if (selectedFilter == "Normal") {
    //   globalDispatch("base64CanvasImageForNormalColor", String(previewUrl));
    // }
    // else if (selectedFilter == "Single Color") {
    //   globalDispatch("base64CanvasImageForSinglelColor", String(newBase64Image));
    // }
    // else {
    //   globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(previewUrl));

    // }
    // globalDispatch("loading", false);
    // globalDispatch("replaceBgParamValue", imgixParam);
  };

  // const bGReplaceColorChangedFunctionCalled = (color) => {
  //   // Get current toggle state (true/false)
  //    const hex = color.replace('#', '');
  //   const value = isActive(`bg-remove=true&bg=${hex}`);

  //   // Toggle the param (enables/disables it)
  //   toggle(`bg-remove=true&bg=${hex}`, value);

  //   // Set local state
  //   setBgColor(color);
  //   setResetDefault(false);

  //   // Remove '#' and build Imgix param

  //   const imgixParam = `bg-remove=true&bg=${hex}`;

  //   // Update Redux store
  //   globalDispatch("replaceBackgroundColor", color);              // e.g. "#AABB22"
  //   globalDispatch("replaceBgParamValue", imgixParam);            // e.g. "bg-remove=true&bg=AABB22"
  // };



  const toggleBGReplaceColorPopup = () => {
    setBGColorPopup(!bgColorPopup);
  };

  const toggleColorPopup = () => {
    setColorPopup(!ColorPopup);
  };

  function cropAndTrimdHandler(e) {
    // update local state

    const value = isActive('trim=color');
    toggle('trim=color', value)
    setCropAndTrim(!value);
    // update redux store
    globalDispatch("cropAndTrim", !value);
    setResetDefault(false);
    fetchPalette();
    // setEditColor(false);
    // globalDispatch("editColor", false);

    // handleImage(previewUrl);
  }

  function superResolutiondHandler(e) {
    // update local state
    const value = isActive('auto=enhance&sharp=80&upscale=true');
    toggle('auto=enhance&sharp=80&upscale=true', value)
    setSuperResolution(!value);
    // update redux store
    globalDispatch("superResolution", !value);
    setResetDefault(false);
    fetchPalette();
    // setEditColor(false);
    // globalDispatch("editColor", false);
    // handleImage(previewUrl);
  }


  const handleReset = () => {
    if (resetDefault) return;
    // 1. Dispatch global image state reset
    const canvasComponent = document.querySelector(`#canvas-${activeSide}`); // Simple way, but ideally use refs or context
    const rect = canvasComponent.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const changes = {
      scaleX: 1,
      scaleY: 1,
      rotate: 0,
      flipX: false,
      flipY: false,
      position: { x: centerX, y: centerY },
      scaledValue: 1,
      angle: 0,
      locked: false,
      // AI operation states (optional to store)
      removeBg: false,
      cropAndTrim: false,
      superResolution: false,
      replaceBackgroundColor: "var(--black-color)",
      invertColor: false,
      singleColor: "#ffffff",
      editColor: false
    };
    fetchPalette();


    dispatch(updateImageState({ id: selectedImageId, changes }));

    // 2. Reset local component states
    setRemoveBackground(false);
    setCropAndTrim(false);
    setSuperResolution(false);
    setActiveTransform('');
    setBGColorPopup(false);
    setBgColor("var(--black-color)");
    setInvertColor(false);
    setEditColor(false);


    // 3. Remove active transformations via `toggle`
    // const removeBgKey = 'bg-remove=true';
    // const cropKey = 'trim=color';
    // const enhanceKey = 'auto=enhance&sharp=80&upscale=true';
    if (previewUrl?.split("?")?.length > 1) {
      applyTransform('', true, false);
    }
    setResetDefault(true);
    // handleImage(img.src.split("?")[0], "#ffffff");
    // setSelectedFilter("Normal")


    // if (isActive(removeBgKey)) toggle(removeBgKey, true);      // turns OFF
    // if (isActive(cropKey)) toggle(cropKey, true);              // turns OFF
    // if (isActive(enhanceKey)) toggle(enhanceKey, true);        // turns OFF

    // 4. Dispatch Redux AI states explicitly if needed
    // globalDispatch("removeBg", false);
    // globalDispatch("cropAndTrim", false);
    // globalDispatch("superResolution", false);

  };

  useEffect(() => {
    if (img?.src?.split("?").length <= 1) {
      // applyTransform("?auto=enhance");
    }
  }, [])

  async function thresholdHandler(e) {
    const threshold = e.target.value;
    setThreshold(threshold);

    globalDispatch("loading", true);
    globalDispatch("thresholdValue", threshold);
    console.log("solid color funciton called")

    // handleImage(previewUrl, color);
    const newBase64Image = await makeSolid(base64Image, threshold);
    // setPreviewUrl(String(newImgUrl));
    setBase64Image(newBase64Image)

    globalDispatch("base64CanvasImage", String(newBase64Image));
    if (img.selectedFilter == "Normal") {
      globalDispatch("base64CanvasImageForNormalColor", String(newBase64Image));
    }
    else if (img.selectedFilter === "Single Color") {
      globalDispatch("base64CanvasImageForSinglelColor", String(newBase64Image));
    }
    else {
      globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(newBase64Image));

    }
    globalDispatch("loading", false);
  }

  function replaceColorAndGetBase64(imageSrc, targetHex, newHex, tolerance = 50) {
    console.log(targetHex, newHex, "replaceColorAndGetBase64 functiion", imageSrc)
    return new Promise(async (resolve, reject) => {
      const canvas = document.getElementById('HelperCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();

      // Support CORS if external URL
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      img.onload = async function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const targetColor = hexToRgbForReplaceColor(targetHex);
        const newColor = hexToRgbForReplaceColor(newHex);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];

          if (colorsMatch([r, g, b], targetColor, tolerance)) {
            data[i] = newColor[0];
            data[i + 1] = newColor[1];
            data[i + 2] = newColor[2];
          }
        }

        ctx.putImageData(imageData, 0, 0);
        const base64 = canvas.toDataURL('image/png');


        const objectURL = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error("Failed to convert canvas to blob"));
            }
          }, "image/png", 0.92);
        });

        // Cleanup
        canvas.width = 0;
        canvas.height = 0;
        // canvas.remove();

        resolve(objectURL);
        // canvas.remove();
      };

      img.onerror = function () {
        resolve(imageSrc);
      };
    });
  }

  function hexToRgbForReplaceColor(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  function colorsMatch(c1, c2, tolerance = 50) {
    return (
      Math.abs(c1[0] - c2[0]) < tolerance &&
      Math.abs(c1[1] - c2[1]) < tolerance &&
      Math.abs(c1[2] - c2[2]) < tolerance
    );
  }



  const applyColorBlend = async (originalColor, newColor, index) => {
    console.log("apply color blend fucntion called", originalColor, newColor, previewUrl);
    globalDispatch("loading", true);
    setLoading(true);
    const cuurentBase64Image = await replaceColorAndGetBase64(img.base64CanvasImage || base64Image || previewUrl, originalColor, newColor);
    globalDispatch("base64CanvasImage", cuurentBase64Image);
    setBase64Image(cuurentBase64Image);
    setLoading(true);
    globalDispatch("base64CanvasImageForNormalColor", String(cuurentBase64Image));
    // console.log("new base 64 image ", cuurentBase64Image);
    // fetchPalette();
    const newColors = [...extractedColors];
    newColors[index] = newColor;
    setExtractedColors(newColors);
    globalDispatch("extractedColors", newColors);
    globalDispatch("loading", false);
    setEditColor(true);
    globalDispatch("editColor", true);
    setResetDefault(false);


  };
  // console.log("previewUrl", previewUrl, "image src", img?.src);
  //  if(loading) return <div className={styles.loadingOverlay}><div className={styles.loadingSpinner} /><p>Applying changes...</p></div>;
  return (

    <div className="toolbar-main-container ">
      {replacebgwithAi ? (
        <>
          <div className='toolbar-main-heading'>
            <h5 className='Toolbar-badge'>Upload Art</h5>
            <span className={styles.crossIcon} onClick={handleBack}><CrossIcon /></span>
            <h3>Edit Your Artwork</h3>
            <p>Our design professionals will select ink colors for you or tellus your preferred colors at checkout.</p>
          </div>

          <div className={styles.toolbarBox}>

            <>
              <>
                <hr />
                <div className={`${styles.addTextInnerMainContainerr} ${isLocked ? styles.lockedToolbar : ''}`}>
                  <div className={styles.filterSection}>
                    <h4>Filters</h4>
                    <span className={styles.filterSpannAi}>AI GENERATED</span>
                    <div className={styles.filterOptions}>
                      {filters.map(f => (
                        <div
                          key={f.name}
                          className={`${styles.filterOption}${selectedFilter === f.name ? ' ' + styles.filterOptionActive : ''}`}
                          onClick={() => {
                            if (loading) return;
                            // applyTransform(f.transform);
                            setSelectedFilter(f.name);
                            globalDispatch("src", buildUrl(f.transform, false, f.name));
                            globalDispatch("selectedFilter", f.name);
                            // globalDispatch("base64CanvasImage", f.image);
                            handleImage(buildUrl(f.transform, false, f.name), singleColor, f.name, invertColor, editColor);
                            if (f.name != "Normal") setResetDefault(false);
                          }}
                        >
                          {
                            loading ? <> <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt={f.name} className={styles.filterImage} onError={e => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'} /></> : <> {f.image && <img src={f.image} alt={f.name} className={styles.filterImage} onError={e => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'} />}</>
                          }

                          <div className={styles.filterLabel}>{f.name}</div>
                          {/* <img
                        src={previewUrl} alt={filter.name} className={styles.filterImage} onError={() => alert("Image not publicly accessible")} />
                      <div className={styles.filterLabel}>{filter.name}</div> */}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* {selectedFilter === "Normal" || selectedFilter === "Single Color" && (<hr />)} */}

                  {/* {selectedFilter === "Normal" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Edit Colors</div>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleTextColorPopup}>
                  <SpanColorBox color={textColor} />
                  <SpanColorBox color={textColor} />
                  <SpanColorBox color={textColor} />
                  <span><AngleActionIcon /></span>
                  {textColorPopup && (
                    <ChooseColorBox
                      addColorPopupHAndler={toggleTextColorPopup}
                      title="Text Color"
                      defaultColor={textColor}
                      onColorChange={textColorChangedFunctionCalled}  // Update text color
                      button={true}
                    />

                  )}
                </div>
              </div>)} */}



                  {/* {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}> */}
                  {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Colors</div> */}
                  {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleTextColorPopup}>
                  <SpanColorBox color={textColor} />
                  <span><AngleActionIcon /></span>
                  {textColorPopup && (
                    <ChooseColorBox
                      addColorPopupHAndler={toggleTextColorPopup}
                      title="Text Color"
                      defaultColor={textColor}
                      onColorChange={textColorChangedFunctionCalled}  // Update text color
                      button={true}
                    />

                  )}
                </div> */}
                  {/* </div>)} */}



                  {selectedFilter === "Normal" && (<hr />)}
                  {selectedFilter === "Normal" && (
                    <>
                      <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                        <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                          Edit Colors
                        </div>

                        <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                          {extractedColors.length > 0 ? (
                            extractedColors.map((color, index) => (
                              // <span>{color}</span>
                              <SpanColorBox
                                key={index}
                                color={color}
                                onClick={() => {
                                  setSelectedColorToReplace({ color, index });
                                  setColorReplacePickerVisible(true);
                                }}
                              />
                            ))
                          ) : (
                            <p style={{ fontSize: "12px" }}>Loading palette...</p>
                          )}

                          {colorReplacePickerVisible && (
                            <ReplaceBackgroundColorPicker
                              closePopupHandler={() => setColorReplacePickerVisible(false)}
                              defaultColor={selectedColorToReplace.color}
                              onApply={(newColor) => {
                                applyColorBlend(selectedColorToReplace.color, newColor, selectedColorToReplace.index);
                                setColorReplacePickerVisible(false);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedFilter === "Black/Whte" && null}


                  {selectedFilter === "Single Color" && (<hr />)}

                  {/* color */}
                  {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Color
                    </div>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleColorPopup}>
                      <SpanColorBox color={singleColor} />
                      {ColorPopup && (
                        <ReplaceBackgroundColorPicker
                          closePopupHandler={toggleColorPopup}
                          defaultColor={singleColor}
                          onApply={ColorChangedFunctionCalled}
                        />
                      )}


                      {/* <span><AngleActionIcon /></span> */}



                    </div>
                  </div>

                  )}

                  <hr />
                  {/* ----invertcolor */}
                  {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Inverts Colors

                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={invertColor}
                        onChange={() => invertColorHandler(img.getBase64CanvasImage || base64Image)}
                        disabled={loading}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  )}
                  {/* {
                    selectedFilter === "Single Color" &&
                    <hr />
                  }


                  {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Make Solid

                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={solidColor}
                        onChange={solidColorHandler}
                        disabled={loading}
                      />
                      <span className={styles.slider}></span>
                    </label>

                  </div>
                  )}
                  {
                    selectedFilter == "Single Color" && solidColor &&
                    <hr></hr>
                  } */}
                  {/* {
                    selectedFilter == "Single Color" && solidColor &&
                    <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                      <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                        Threshold:
                      </div>

                      <input type="range" id="threshold" class="slider" min="0" max="255" value={threshold} onChange={thresholdHandler} />
                      <span id={styles.thresholdValue}>{threshold}</span>
                    </div>
                  } */}
                  {(selectedFilter === "Single Color" && <hr />)}

                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Remove Background
                      <span className={styles.aiBadge}>AI</span>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={removeBackground}
                        id='removeBackgroundInput'
                        // onChange={() => toggle('bg-remove=true', isActive('bg-remove=true'))}
                        onChange={removeBackgroundHandler}
                        disabled={loading}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>



                  <hr />
                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Crop & Trim
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={cropAndTrim}
                        onChange={cropAndTrimdHandler}
                        disabled={loading}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>




                  <hr />
                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Super Resolution
                      <span className={styles.aiBadge}>AI</span>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={isActive('auto=enhance&sharp=80&upscale=true')}
                        onChange={superResolutiondHandler}
                        disabled={loading}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <hr />


                  <div className={styles.toolbarBoxFontValueSetInnerContainer} onClick={() => setreplaceBgwithAi(false)}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading} >Replace Background With AI<span className={styles.aiBadge}>AI</span></div>
                    <span className={styles.rightarrow}><FaChevronRight /></span>

                    {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleBGReplaceColorPopup}>
                  <SpanColorBox color={bgColor} />
                  {bgColorPopup && (
                    <ReplaceBackgroundColorPicker
                      closePopupHandler={toggleBGReplaceColorPopup}
                      defaultColor={bgColor}
                      onApply={bGReplaceColorChangedFunctionCalled}
                    />
                  )}


                  {/* <span><AngleActionIcon /></span> */}



                    {/* </div> */}
                  </div>

                  <hr />

                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Size
                    </div>
                    <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
                      <input
                        type="range"
                        name="size"
                        min="0.1"
                        max="10"
                        step="0.1"
                        value={rangeValuesSize}
                        onChange={handleRangeInputSizeChange}
                      />

                      <input
                        type="number"
                        min="0.2"
                        max="10"
                        step="0.1"
                        value={rangeValuesSize}
                        onChange={handleRangeInputSizeChange}
                        onBlur={handleBlur}
                        className={styles.spanValueBoxInput}
                      />
                      {/* Size end here */}



                    </div>
                  </div>


                  <hr></hr>






                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                      Rotate
                    </div>
                    <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
                      <input
                        type="range"
                        id="min"
                        name="min"
                        min="0"
                        max="360"
                        step="0.1"
                        value={rangeValuesRotate}
                        onChange={handleRangeInputRotateChange}
                      />

                      <input
                        type="number"
                        min="0"
                        max="360"
                        step="0.1"
                        value={rangeValuesRotate}
                        onChange={handleRangeInputRotateChange}
                        onBlur={handleRotateBlur}
                        className={styles.spanValueBoxInput}
                      />


                    </div>
                  </div>

                  <hr></hr>

                  <p className={styles.resetButton} onClick={handleReset}>Reset To Default</p>

                </div>

                {/* this is toolbar of image for upload art exm- layring, flip, color, size, arc, rotate, spacing */}
                <div className={styles.addTextFirstToolbarBoxContainer}>

                  <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                    <div
                      className={`${styles.toolbarBoxIconsContainer} ${centerActive ? styles.toolbarBoxIconsContainerActive : ''}`}
                      onClick={() => {
                        const canvasComponent = document.querySelector(`#canvas-${activeSide}`); // Simple way, but ideally use refs or context
                        const rect = canvasComponent.getBoundingClientRect();
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        globalDispatch("position", { x: centerX, y: img.position.y });
                        setCenterActive(!centerActive);
                        setResetDefault(false);
                      }}
                    >
                      <span><AlignCenterIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container'>Center</div>
                  </div>

                  <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                    <div className={styles.toolbarBoxIconsContainerForTogether}>

                      {
                        getRenderIconForSendToTop() ? <div className={styles.toolbarBoxIconsContainerLayering1}> <span><LayeringFirstIcon /></span> </div> : <div className={styles.toolbarBoxIconsContainerLayering1}
                          onClick={() => handleBringForward()}
                        >
                          <span><LayeringFirstIconWithBlackBg /></span></div>
                      }

                      {
                        getRenderIconForSendToBack() ? <div className={styles.toolbarBoxIconsContainerLayering2} > <span><LayeringSecondIcon /></span> </div> : <div className={styles.toolbarBoxIconsContainerLayering2}
                          onClick={() => handleBringBackward()}
                        >  <span><LayeringSecondIconWithBlackBg /></span></div>
                      }
                    </div>
                    Layering
                  </div>

                  <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                    <div className={styles.toolbarBoxIconsContainerForTogether}>
                      <div className={colorClassName}
                        onClick={() => callForXFlip()}
                      ><span>{icon}</span></div>
                      <div className={colorClassNameForY}
                        onClick={() => callForYFlip()}
                      ><span>{iconY}</span></div>
                    </div>
                    Flip
                  </div>

                  <div
                    className={styles.toolbarBoxIconsAndHeadingContainer}
                    onClick={() => dispatch(toggleImageLockState(selectedImageId))}
                  >
                    <div className={`${styles.toolbarBoxIconsContainer} ${isLocked ? styles.toolbarBoxIconsContainerActive : ''}`}>
                      <span><LockIcon /></span>
                    </div>
                    <div className="toolbar-box-heading-container">Lock</div>
                  </div>

                  <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`} onClick={handleDuplicateImage}>
                    <div className={`${styles.toolbarBoxIconsContainer} ${duplicateActive ? styles.toolbarBoxIconsContainerActive : ''}`}>
                      <span><DuplicateIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container' >Duplicate</div>
                  </div>
                </div>


                {/* toolbar ends here */}
              </>

            </>

          </div>
        </>) :
        (<ReplaceBg replacebgwithAi={replacebgwithAi} setreplaceBgwithAi={setreplaceBgwithAi} img={img} />)}
    </div>

  );
};

export default AddImageToolbar;
