

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AddImageToolbar.module.css'
import loadingImage from "../../images/Loading_icon.gif"
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
import { applyFilterAndGetUrl, getBase64CanvasImage, invertColorsAndGetUrl, processAndReplaceColors, replaceColorAndGetBase64 } from '../../ImageOperation/CanvasImageOperations.js';
import { store } from '../../../redux/store.js';
import { original } from '@reduxjs/toolkit';




const AddImageToolbar = () => {
  const useFilterRef = useRef([]);
  const BASE_FILTERS = [
    { name: 'Normal', transform: '' },
    { name: 'Single Color', transform: '' },
    { name: 'Black/White', transform: '?sat=-100' },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const allTextInputData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].texts);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const img = allImageData?.find((img) => img.id == selectedImageId);
  const { data: settings } = useSelector((state) => state.settingsReducer);
  const AdminSettingsforAioperation = settings?.artworkEditorSettings || {};
  // console.log("----img", img)
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
  const [singleColor, setSingleColor] = useState("#ffffff");
  const [invertColor, setInvertColor] = useState(false);
  const [solidColor, setSolidColor] = useState(false);
  const [editColor, setEditColor] = useState(false);
  const [resetDefault, setResetDefault] = useState(false);
  const [filters, setFilters] = useState(BASE_FILTERS);
  const [activeEffects, setActiveEffects] = useState([]);
  const [bgColorPopup, setBGColorPopup] = useState(false);
  const [ColorPopup, setColorPopup] = useState(false);
  const [replacebgwithAi, setreplaceBgwithAi] = useState(true);
  const [targetDpi, setTargetDpi] = useState(300)
  //  const [activeFilter, setActiveFilter] = useState(filters[0]);


  const imgRef = useRef(null);
  const textareaRef = useRef(null)

  const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;

  const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  // const imageContaintObject = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);


  // console.log("-----------imggg", imageContaintObject);
  const DEFAULT_TARGET_DPI = 300;

  function calcByTargetDpi({ originalWidthPx, originalHeightPx, scaleX, scaleY, targetDpi }) {
    // console.log("-----------originalwidth", originalWidthPx);
    // console.log("-----------originalHeightPx", originalHeightPx)

    // const widthPixels = Math.round((originalWidthPx ?? 0) * (scale ?? 1));
    // const heightPixels = Math.round((originalHeightPx ?? 0) * (scale ?? 1));
    const widthPixels = Math.round((originalWidthPx ?? 0) * (scaleX ?? 1));
    const heightPixels = Math.round((originalHeightPx ?? 0) * (scaleY ?? 1));

    return {
      pixels: { width: widthPixels, height: heightPixels },
      inches: {
        width: (widthPixels / targetDpi).toFixed(2),
        height: (heightPixels / targetDpi).toFixed(2),
      },
      dpi: targetDpi,
      effectedDpi: parseInt(originalWidthPx / ((widthPixels / targetDpi).toFixed(2)))
    };
  }


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
    setPreviewUrl(img.src || '');
    setResetDefault(img.resetDefault || false);
    setExtractedColors(img?.extractedColors);
    // console.log(previewUrl);
    try {
      const params = img.src?.split('?')[1] || '';
      const currentTransform = params ? `?${params}` : '';
      setActiveTransform(currentTransform);
      const currentEffects = params
        ? params.split('&').filter(param =>
          !BASE_FILTERS.some(f => f.transform.includes(param))
        )
        : [];
      // console.log("cureent effects", currentEffects);
      setActiveEffects(currentEffects);
      setRemoveBackground(img.removeBg);
      setSuperResolution(img.superResolution);
      setCropAndTrim(img.cropAndTrim);
      setInvertColor(img.invertColor);
      setSolidColor(img.solidColor);
    } catch { }
  }, [img, selectedImageId, resetDefault, img?.loading, img?.base64CanvasImage]);

  useEffect(() => {
    // if (!img?.src || (img?.originalWidth && img?.originalHeight)) return;
    if (!img?.src) return;

    const probe = new Image();
    probe.crossOrigin = "anonymous";
    console.log("----------src", img?.src)
    console.log("----------probbe", probe.width, probe.height)

    probe.src = img.src.split("?")[0];
    probe.onload = () => {
      dispatch(updateImageState({
        id: selectedImageId,
        changes: {
          originalWidth: probe.width,
          originalHeight: probe.height,
        },
        isRenderOrNot: true,
      }));
    };
  }, [img?.src, img?.originalWidth, img?.originalHeight, dispatch, selectedImageId]);

  const getDisplayDimensions = () => {
    if (!img?.originalWidth || !img?.originalHeight) {
      // console.log("img originalWidth not present");
      return {
        pixels: { width: 0, height: 0 },
        inches: { width: '0.00', height: '0.00' },
        dpi: targetDpi,
      };
    }
    // const scale = img?.scaledValue ?? 1;
    const scaleX = img?.scaleX ?? 1;
    const scaleY = img?.scaleY ?? 1;
    // console.log("img originalWidth present");

    return calcByTargetDpi({
      originalWidthPx: img.originalWidth,
      originalHeightPx: img.originalHeight,
      scaleX,
      scaleY,
      // scale,
      targetDpi,
    });
  };

  function updateFilter() {
    setLoading(true);
    const newFilters = BASE_FILTERS.map(filter => {
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
        image: img?.base64CanvasImageForSinglelColor || loadingImage
      };
    })
    setFilters(newFilters);
    setLoading(false);
    return newFilters;
  }
  useEffect(() => {
    // console.log("%%%%%%%%%%%%%%%%Actiev efect", activeEffects)

    // console.log(filters, "&&&&&&&&&&&&")
    useFilterRef.current = updateFilter()
    // console.log(useFilterRef.current, "filter updated>>>>>>>>>>>>>")
  }, [activeEffects]);


  async function handleImage(imageSrc, color = "#ffffff", selectedFilter, invertColor, editColor, activeEffectsParams) {
    try {


      setResetDefault(false);
      globalDispatch("loading", true);
      // globalDispatch("editColor", false);
      // globalDispatch("loading", true); // Corrected the typo here
      console.log("handle image function called with src", imageSrc, color, selectedFilter, invertColor, editColor);

      let currentBase64Image;

      let normalColorImage, singleColorImage, blackWhiteColorImage;
      const newfilters = updateFilter();

      const baseUrl = imageSrc.split("?")[0] || "";
      const params = imageSrc.split("?")[1] || ""
      const filteredParams = params.replace("sat=-100", "");
      // console.log("params", params, "filteredParams", filteredParams)

      const normalSrc = baseUrl + "?" + filteredParams
      const singleSrc = baseUrl + "?" + filteredParams
      const blackAndWhiteSrc = baseUrl + "?" + params + (!params.includes("sat=-100") ? "&sat=-100" : "")
      const allTransformImage = [normalSrc, singleSrc, blackAndWhiteSrc];

      // console.log("curent seleteced filter is ", selectedFilter)
      // console.log("stored seletected filter is ", img.selectedFilter)

      // for normal color image
      if (editColor) {
        normalColorImage = await processAndReplaceColors(allTransformImage[0], color, editColor, extractedColors);
      }
      else {
        normalColorImage = await getBase64CanvasImage(allTransformImage[0], color)
      }

      //for single color image
      if (invertColor) {
        const applyFilterURL = await applyFilterAndGetUrl(allTransformImage[1], color);
        singleColorImage = await invertColorsAndGetUrl(applyFilterURL || previewUrl);
      }
      else {
        singleColorImage = await applyFilterAndGetUrl(allTransformImage[1], color);
      }

      // for black and white image
      blackWhiteColorImage = await getBase64CanvasImage(allTransformImage[2], color)

      if (selectedFilter == "Single Color") {
        currentBase64Image = singleColorImage;
      }
      else if (selectedFilter == "Normal") {
        currentBase64Image = normalColorImage;
      }
      else {
        currentBase64Image = blackWhiteColorImage;
      }


      // Set the base64 image and dispatch it to the global state
      setBase64Image(currentBase64Image);
      // Dispatch the base64 string to your global state (no need to convert it to a string again)
      globalDispatch("base64CanvasImage", currentBase64Image);

      globalDispatch("base64CanvasImageForNormalColor", String(normalColorImage));
      globalDispatch("base64CanvasImageForSinglelColor", String(singleColorImage));
      globalDispatch("base64CanvasImageForBlackAndWhitelColor", String(blackWhiteColorImage));
      // Set loading to false after the process is done
      globalDispatch("loading", false); // Corrected the typo here
    } catch (error) {
      globalDispatch("loading", false); // Ensure loading is stopped even in case of error
      console.error("Error:", error); // Log any errors that occur
    }
  }

  function replaceBgHandler(imageSrc) {
    // console.log("--------------------replace call", imageSrc)
    // const changes = {
    //   scaleX: 1,
    //   removeBg: false,
    //   cropAndTrim: false,
    //   superResolution: false,
    // };
    globalDispatch("src", imageSrc);
    handleImage(imageSrc, singleColor, selectedFilter, invertColor, editColor);
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
      setPreviewUrl({ loadingImage });
      setLoading(false);
      globalDispatch("loading", false);
    };
    if (img?.src) {
      tempImage.src = img?.src
    }

  }, [selectedImageId])




  const handleRangeInputSizeChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesSize(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    const scaleX = img?.scaleX ?? 1;
    const scaleY = img?.scaleY ?? 1;
    const currentAvg = (scaleX + scaleY) / 2;
    const scaleRatio = parsed / currentAvg;

    console.log('Scale calculation:', { scaleX, scaleY, currentAvg, scaleRatio, parsed });

    const effectiveDpi = targetDpi || DEFAULT_TARGET_DPI;
    const dims = img?.originalWidth && img?.originalHeight
      ? calcByTargetDpi({
        originalWidthPx: img.originalWidth,
        originalHeightPx: img.originalHeight,
        scaleX: scaleX * scaleRatio,
        scaleY: scaleY * scaleRatio,
        targetDpi: effectiveDpi,
      })
      : { pixels: { width: 0, height: 0 }, inches: { width: '0.00', height: '0.00' }, dpi: effectiveDpi };

    console.log('Dispatching dims:', dims);

    dispatch(updateImageState({
      id: selectedImageId,
      changes: {
        loadingText: true,
        scaleX: scaleX * scaleRatio,
        scaleY: scaleY * scaleRatio,
        scaledValue: parsed,
        widthPixels: dims.pixels.width,
        heightPixels: dims.pixels.height,
        widthInches: dims.inches.width,
        heightInches: dims.inches.height,
        dpi: dims.dpi,
        loadingText: false,
      },
      isRenderOrNot: true,
    }));
    setResetDefault(false);
  };

  const DPI = 300; // dots per inch

  const handleBlur = () => {
    const parsed = parseFloat(rangeValuesSize);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
      const fallbackScale = 1;
      setRangeValuesSize("1");

      const dims = img?.originalWidth && img?.originalHeight
        ? calcByTargetDpi({
          originalWidthPx: img.originalWidth,
          originalHeightPx: img.originalHeight,
          scale: fallbackScale,
          targetDpi,
        })
        : { pixels: { width: 0, height: 0 }, inches: { width: '0.00', height: '0.00' }, dpi: targetDpi };

      dispatch(updateImageState({
        id: selectedImageId,
        changes: {
          loadingText: true,
          scaleX: 1,
          scaleY: 1,
          scaledValue: 1,
          widthPixels: dims.pixels.width,
          heightPixels: dims.pixels.height,
          widthInches: dims.inches.width,
          heightInches: dims.inches.height,
          dpi: dims.dpi,
          loadingText: false,
        },
        isRenderOrNot: true,
      }));
    }
    setResetDefault(false);
  };



  const handleRangeInputRotateChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesRotate(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) return;
    globalDispatch("loadingText", true);
    globalDispatch("angle", parsed);
    globalDispatch("loadingText", false);
    setResetDefault(false);
  };


  const handleRotateBlur = () => {
    const parsed = parseFloat(rangeValuesRotate);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) {
      setRangeValuesRotate("0");
      globalDispatch("loadingText", true);
      globalDispatch("angle", 0);
      globalDispatch("loadingText", false);
    }
    setResetDefault(false);
  };
  const handleDuplicateImage = () => {
    if (!selectedImageId) return;
    globalDispatch("loadingText", true);
    dispatch(duplicateImageState(selectedImageId));
    globalDispatch("loadingText", false);
  };


  const handleBack = () => {
    navigate('/design/product');
  }

  const globalDispatch = (label, value) => {
    dispatch(updateImageState({ id: selectedImageId, changes: { [label]: value }, isRenderOrNot: true }));
  };





  const buildUrl = useCallback((transform, resetAll, filterName) => {
    // console.log(transform, filterName, selectedFilter, "<<<<<<<<<<<<<<<<<<<<<<")
    const base = img?.src?.split('?')[0] || '';
    if (resetAll) {
      return base;
    }
    if (!filterName) {
      if (selectedFilter == "Black/White") {
        if (!transform.includes("sat=-100")) {
          transform = transform ? `${transform}&sat=-100` : '?sat=-100';
        }
      }
      else {
        if (transform.includes("sat=-100")) {
          transform = transform.replace("sat=-100", "");
        }
      }

    }
    return `${base}${transform}`;
  }, [img]);

  const applyTransform = useCallback(
    async (transform, resetAll, editColor, newActiveEffects) => {
      if (!img?.src) return;
      globalDispatch("loading", true);
      console.log("aply tranform call with tranform", transform);

      const newUrl = buildUrl(transform, resetAll);

      setLoading(true);
      // Load transformed image
      const tempImage = new Image();
      tempImage.onload = async () => {
        // Only update everything when loaded successfully
        setPreviewUrl(newUrl);
        setActiveTransform(transform);
        globalDispatch("src", newUrl);
        await handleImage(newUrl, singleColor, selectedFilter, img?.invertColor ?? invertColor, false, newActiveEffects);
        setLoading(false);
      };

      tempImage.onerror = () => {
        console.error("Failed to load image:", newUrl);
        setPreviewUrl(img.src);
        setLoading(false);
        globalDispatch("loading", false);
      };

      tempImage.src = newUrl; // Begin load
    },
    [img, buildUrl, globalDispatch]
  );



  // const toggleEffect = (effect) => {
  //   setActiveEffects(prev => {
  //     const newEffects = prev.includes(effect)
  //       ? prev.filter(e => e !== effect)
  //       : [...prev, effect];

  //     const baseFilter = filters.find(f => f.name === selectedFilter) || BASE_FILTERS[0];
  //     const baseParams = baseFilter.transform.replace('?', '').split('&').filter(param =>
  //       BASE_FILTERS.some(base => base.transform.replace('?', '').includes(param))
  //     );

  //     const allParams = [...new Set([...baseParams, ...newEffects])];
  //     const newTransform = allParams.length ? `?${allParams.join('&')}` : '';

  //     applyTransform(newTransform, false, editColor);
  //     return newEffects;
  //   });
  // };
  function cleanTransformString(str) {
    if (!str) return "";

    return str
      .replace(/\?&+/, "?")         // replace "?&" with "?"
      .replace(/&&+/g, "&")         // replace multiple "&" with single "&"
      .replace(/(\?|&)$/, "")       // remove trailing ? or &
      .replace(/undefined/g, "")    // remove accidental "undefined"
      .trim();
  }
  useEffect(() => {
    // console.log("activeEffects changed:", activeEffects);
  }, [activeEffects]);


  // Toggle a URL query parameter (like 'bg-remove=true') on/off in the activeTransform
  const toggle = (param, condition, filterName) => {
    // CONDITION TRUE MEANS REMOVE
    // CONDITION FALSE MEANS ADD
    if (condition) {
      const cleaned = activeTransform.replace(new RegExp(`${param}(&|$)`), '');
      const cleanedParam = cleanTransformString(cleaned);
      // console.log(cleanedParam, "cleanedParam..........");

      // setActiveEffects(effect => effect?.filter(ef => ef !== cleaned))
      const newActiveEffects = activeEffects?.filter(ef => ef !== cleaned)
      // console.log("acitve effects", activeEffects)

      return applyTransform(cleanedParam, false, editColor, newActiveEffects);
    }

    const separator = activeTransform ? '&' : '?';
    const updated = `${activeTransform}${separator}${param}`;
    const updatedParam = cleanTransformString(updated);
    // console.log(updatedParam, "updatedparam......");

    // setActiveEffects(prev => [...prev, updatedParam])
    const newActiveEffects = [...activeEffects, updatedParam]
    // console.log("acitve effects", activeEffects)
    return applyTransform(updatedParam, false, editColor, newActiveEffects);
  };


  const isActive = useCallback((param) => activeTransform.includes(param), [activeTransform]);


  const callForXFlip = () => {
    const value = !(img.flipX);
    setflipXValue(value);
    globalDispatch("loadingText", true);
    globalDispatch("flipX", value);
    globalDispatch("loadingText", false);
    // console.log("clicked", value);
    setResetDefault(false);
  }


  const callForYFlip = () => {
    const value = !(img.flipY);
    setflipYValue(value);
    //console.log("y value ", value);
    globalDispatch("loadingText", true);


    globalDispatch("flipY", value);
    globalDispatch("loadingText", false);

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

  // useEffect(() => {
  //   console.log("hasmounted", hasMounted)
  //   if (!hasMounted.current) {
  //     hasMounted.current = true;
  //     return; // ⛔ skip on first render
  //   }
  //   // console.log("remove background is calling");
  //   removeBackgroundHandler(); // ✅ run on subsequent changes only
  // }, [img?.removeBgImagebtn]);

  function removeBackgroundHandler(e) {
    // update local state
    globalDispatch("loading", true);
    // console.log("clicked on backgournd remove button");
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
    setEditColor(false);
    globalDispatch("editColor", false);

  }

  async function invertColorHandler() {
    const state = store.getState();
    const activeSide = state.TextFrontendDesignSlice.activeSide;
    const images = state.TextFrontendDesignSlice.present[activeSide].images;
    const selectedImageId = state.TextFrontendDesignSlice.present[activeSide].selectedImageId;
    const currentImageObject = images.find((img) => img.id === selectedImageId);
    const getBase64CanvasImage = currentImageObject?.getBase64CanvasImage || img?.base64CanvasImage || previewUrl;
    const originalImage = currentImageObject?.src || previewUrl;
    setInvertColor(!invertColor);
    // // update redux store
    globalDispatch("invertColor", !invertColor);
    setResetDefault(false);
    if (invertColor) {
      handleImage(originalImage || previewUrl, singleColor, selectedFilter, !invertColor, editColor);
      // globalDispatch("base64CanvasImageForSinglelColor", String(Newbase64image));
    }
    else {
      globalDispatch("loading", true);
      const Newbase64image = await invertColorsAndGetUrl(getBase64CanvasImage || base64Image || previewUrl);
      // console.log("inverted image in base64", Newbase64image);
      globalDispatch("base64CanvasImage", Newbase64image);
      globalDispatch("base64CanvasImageForSinglelColor", String(Newbase64image));
      globalDispatch("loading", false);
    }



  }

  async function solidColorHandler(e) {
    // update local state
    const value = isActive('solid=true');
    // toggle('solid=true', value)
    // setSolidColor(!solidColor);
    globalDispatch("solidColor", !solidColor);
    globalDispatch("loading", true);
    // console.log("solid color funciton called")

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

  // function getBase64CanvasImage(imageSrc, color) {
  //   return new Promise((resolve, reject) => {
  //     const canvas = document.getElementById('HelperCanvas');
  //     const ctx = canvas.getContext('2d', { willReadFrequently: true });
  //     const img = new Image();
  //     img.crossOrigin = "anonymous";
  //     img.src = imageSrc;

  //     img.onload = function () {
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       // Optional: Fill background if needed (e.g., white)
  //       ctx.fillStyle = "transparent";
  //       ctx.fillRect(0, 0, canvas.width, canvas.height);

  //       ctx.drawImage(img, 0, 0);

  //       // Export as Blob and convert to Object URL
  //       canvas.toBlob((blob) => {
  //         if (blob) {
  //           const objectURL = URL.createObjectURL(blob);
  //           resolve(objectURL); // You can directly use this in img.src
  //         } else {
  //           reject(new Error("Failed to convert canvas to blob"));
  //         }

  //         // Clean up canvas
  //         canvas.width = 0;
  //         canvas.height = 0;
  //         // canvas.remove();
  //       }, "image/png", 0.92);
  //     };

  //     img.onerror = function () {
  //       reject(new Error("Failed to load image"));
  //     };
  //   });
  // }
  // getBase64CanvasImage
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
  }, [img?.src, selectedImageId]);



  // applyFilterAndGetUrl
  // function invertColorsAndGetUrl(imageSrc) {
  //   return new Promise((resolve, reject) => {
  //     const canvas = document.getElementById('HelperCanvas');
  //     const ctx = canvas.getContext('2d', { willReadFrequently: true });
  //     const img = new Image();

  //     // If imageSrc is base64, directly set img.src
  //     if (imageSrc.startsWith("data:image")) {
  //       img.src = imageSrc;
  //     } else {
  //       img.crossOrigin = "anonymous"; // Allow cross-origin access
  //       img.src = imageSrc;  // For external URLs
  //     }

  //     img.onload = function () {
  //       // Set the canvas size to the image size
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       // Draw the original image onto the canvas
  //       ctx.drawImage(img, 0, 0);

  //       // Get the image data from the canvas
  //       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //       const data = imageData.data;

  //       // Loop through each pixel and invert the brightness
  //       for (let i = 0; i < data.length; i += 4) {
  //         data[i] = 255 - data[i];     // Red
  //         data[i + 1] = 255 - data[i + 1]; // Green
  //         data[i + 2] = 255 - data[i + 2]; // Blue
  //       }

  //       // Put the altered image data back to the canvas
  //       ctx.putImageData(imageData, 0, 0);

  //       // Return the base64 representation of the inverted image
  //       canvas.toBlob((blob) => {
  //         if (blob) {
  //           const objectURL = URL.createObjectURL(blob);
  //           resolve(objectURL); // You can directly use this in img.src
  //         } else {
  //           reject(new Error("Failed to convert canvas to blob"));
  //         }

  //         // Clean up canvas
  //         canvas.width = 0;
  //         canvas.height = 0;
  //         // canvas.remove();
  //       }, "image/png", 0.92);
  //       // canvas.remove();
  //     };

  //     img.onerror = function () {
  //       resolve(imageSrc);
  //     };
  //   });
  // }



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
    // console.log("color cahnges funcitonc called", color, previewUrl);
    const newBase64Image = await handleImage(img.src || previewUrl, color, selectedFilter, invertColor, editColor);

  };





  const toggleBGReplaceColorPopup = () => {
    setBGColorPopup(!bgColorPopup);
  };

  const toggleColorPopup = () => {
    setColorPopup(!ColorPopup);
  };

  function cropAndTrimdHandler(e) {
    // update local state
    globalDispatch("loading", true);
    const value = isActive('trim=color');
    toggle('trim=color', value)
    setCropAndTrim(!value);
    // update redux store
    globalDispatch("cropAndTrim", !value);
    setResetDefault(false);
    fetchPalette();
    setEditColor(false);
    globalDispatch("editColor", false);

    // handleImage(previewUrl);
  }

  function superResolutiondHandler(e) {
    // update local state
    globalDispatch("loading", true);

    const value = isActive('auto=enhance&sharp=80&upscale=true');
    toggle('auto=enhance&sharp=80&upscale=true', value)
    setSuperResolution(!value);
    // update redux store
    globalDispatch("superResolution", !value);
    setResetDefault(false);
    fetchPalette();
    setEditColor(false);
    globalDispatch("editColor", false);
    // handleImage(previewUrl);
  }


  const handleReset = async () => {
    if (resetDefault) return;
    // 1. Dispatch global image state reset
    const canvasComponent = document.querySelector(`#canvas-${activeSide}`); // Simple way, but ideally use refs or context
    const rect = canvasComponent.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const applyFilterURL = await applyFilterAndGetUrl(img.src ?? previewUrl, "#ffffff");
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
      editColor: false,
      src: previewUrl.split("?")[0],
      selectedFilter: "Normal",
      base64CanvasImageForNormalColor: previewUrl.split("?")[0],
      base64CanvasImageForSinglelColor: applyFilterURL,
      base64CanvasImageForBlackAndWhitelColor: previewUrl.split("?")[0] + "?sat=-100",
      base64CanvasImage: previewUrl.split("?")[0],
    };
    fetchPalette();

    hasMounted.current = true;

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
    // if (previewUrl?.split("?")?.length > 1) {
    //   applyTransform('', true, false);
    //   dispatch(updateImageState({ id: selectedImageId, changes }));
    // }
    // else {
    //   changes.src = previewUrl.split("?")[0];
    //   console.log(changes.src);
    // }
    dispatch(updateImageState({ id: selectedImageId, changes }));
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
    // console.log("solid color funciton called")

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



  const applyColorBlend = async (originalColor, newColor, index) => {
    // console.log("apply color blend fucntion called", originalColor, newColor, previewUrl);
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
  const [dims, setDims] = useState(null)
  useEffect(() => {
    const dims = getDisplayDimensions();
    setDims(dims)
    if (selectedImageId === null) return;
    dispatch(updateImageState({
      id: selectedImageId,
      changes: {
        // loadingText: true,
        // scaleX: scaleX * scaleRatio,
        // scaleY: scaleY * scaleRatio,
        // scaledValue: parsed,
        widthPixels: dims?.pixels?.width,
        heightPixels: dims?.pixels?.height,
        widthInches: dims?.inches?.width,
        heightInches: dims?.inches?.height,
        dpi: dims.dpi,
        // loadingText: false,
      },
      isRenderOrNot: true,
    }));
  }, [img?.src, img?.width, img?.height, img?.scale, img?.scaleX, img?.scaleY, img])

  const rf = useRef(null);

  useEffect(() => {
    if (img?.base64CanvasImageForSinglelColor) {

      console.log("base64CanvasImageForSinglelColor already exists", img?.base64CanvasImageForSinglelColor);
      if (!img.base64CanvasImageForSinglelColor.startsWith("blob")) return;

    }
    // console.log(img.base64CanvasImageForSinglelColor, "base64CanvasImageForSinglelColor");
    if (!filters || filters.length === 0) return;
    if (rf.current) return
    rf.current = true;
    (async () => {
      const applyFilterURL = await applyFilterAndGetUrl(img?.src ?? previewUrl, img?.singleColor ?? singleColor);
      // console.log("applied filter url ", applyFilterURL);
      globalDispatch("base64CanvasImageForSinglelColor", String(applyFilterURL));
      setFilters(fs => fs.map(f => {
        if (f.name === "Single Color") {
          return { ...f, transform: '', image: applyFilterURL };
        }
        return f;
      }));
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs when filters are populated


  useEffect(() => {
    console.log("stored selected filter is being updated", img?.selectedFilter)
  }, [img?.selectedFilter])
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
                            // globalDispatch("src", buildUrl(f.transform, false, f.name));
                            globalDispatch("selectedFilter", f.name);
                            globalDispatch("base64CanvasImage", f.image);
                            // handleImage(buildUrl(f.transform, false, f.name), singleColor, f.name, invertColor, img.editColor || editColor);
                            if (f.name != "Normal") setResetDefault(false);
                          }}
                        >
                          {
                            loading ? <> <img src={loadingImage} alt={f.name} className={styles.filterImage} /></> : <> {f.image && <img src={f.image} alt={f.name} className={styles.filterImage} onError={e => e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'} />}</>
                          }


                          <div className={styles.filterLabel}>{f.name}</div>

                        </div>
                      ))}
                    </div>
                  </div>


                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Dimensions & DPI :    </div> */}

                    <div className={styles.toolbarBoxFontValueSetInnerActioninch}>
                      <p><span>Width: </span> {dims?.inches.width} IN</p>
                      <p><span>Height:</span> {dims?.inches.height} IN</p>
                      {/* <p><span>Pixels: </span>{dims.pixels.width} × {dims.pixels.height}</p> */}
                      {/* <p>DPI: {targetDpi} ({getDPILabel(targetDpi)})</p>
                            <p>Pixels: {dims.pixels.width} × {dims.pixels.height}</p> */}
                    </div>
                  </div>

                  <hr />
                  <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                    {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Dimensions & DPI :    </div> */}

                    {/* return ( */}
                    <div className={styles.toolbarBoxFontValueSetInnerActioninch}>
                      {/* <p><span>Width: </span> {dims.inches.width} IN</p>
                          <p><span>Height:</span> {dims.inches.height} IN</p> */}
                      <p><span>Pixels: </span>{dims?.pixels.width} × {dims?.pixels.height}</p>
                      {/* <p><span>Pixels: </span>1254 × 1254</p> */}

                      <p>DPI: {dims?.effectedDpi ?? 300} </p>
                      {/* <p>Pixels: {dims.pixels.width} × {dims.pixels.height}</p>  */}
                    </div>
                    {/* {(() => {

                      );
                    })()} */}
                  </div>
                  {selectedFilter === "Normal" && <hr />}

                  {selectedFilter === "Normal" && (
                    <>
                      <div className={styles.toolbarBoxFontValueSetInnerContainer}>

                        <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                          Edit Colors
                        </div>

                        <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                          {extractedColors?.length > 0 ? (
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



                  {selectedFilter === "Black/White" && null}


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
                  {!AdminSettingsforAioperation?.removeBackgroundAI && selectedFilter === "Single Color" && <hr />}
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

                  {AdminSettingsforAioperation?.removeBackgroundAI && (
                    <>

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

                    </>

                  )}







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
                  {!removeBackground && < hr />}
                  {AdminSettingsforAioperation?.replaceBackgroundAI && (

                    !removeBackground && <div className={styles.toolbarBoxFontValueSetInnerContainer} onClick={() => setreplaceBgwithAi(false)}>
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


                  )
                  }

                  {AdminSettingsforAioperation?.replaceBackgroundAI && <hr />}
                  {/* <hr /> */}


                  {/* <hr /> */}

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
                        globalDispatch("loadingText", true);

                        globalDispatch("position", { x: centerX, y: img.position.y });
                        globalDispatch("loadingText", false);

                        setCenterActive(!centerActive);
                        setResetDefault(false);
                      }}
                    >
                      <span><AlignCenterIcon /></span>
                    </div>
                    <div className='toolbar-box-heading-container'>Center</div>
                  </div>

                  {/* <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
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
                  </div> */}
                  <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                    <div className={styles.toolbarBoxIconsContainerForTogether}>

                      {
                        getRenderIconForSendToTop() ? <div className={styles.toolbarBoxIconsContainerLayering1}  > <span><LayeringFirstIcon /></span> </div> : <div className={styles.toolbarBoxIconsContainerLayering1Active} onClick={() => handleBringForward()} > <span><LayeringFirstIcon /></span></div>
                      }

                      {
                        getRenderIconForSendToBack() ? <div className={styles.toolbarBoxIconsContainerLayering2} > <span><LayeringSecondIcon /></span> </div> : <div className={styles.toolbarBoxIconsContainerLayering2Active} onClick={() => handleBringBackward()}>  <span><LayeringSecondIcon /></span></div>
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
        (<ReplaceBg replacebgwithAi={replacebgwithAi} setreplaceBgwithAi={setreplaceBgwithAi} replaceBgHandler={replaceBgHandler} img={img} />)}
    </div>

  );
};

export default AddImageToolbar;