
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import styles from './AddImageToolbar.module.css';
// import {
//   AlignCenterIcon,
//   LayeringFirstIcon,
//   LayeringSecondIcon,
//   FlipFirstIcon,
//   FlipSecondIcon,
//   LockIcon,
//   DuplicateIcon,
//   AngleActionIcon,
//   FlipFirstWhiteColorIcon,
//   FlipSecondWhiteColorIcon,
//   LayeringFirstIconWithBlackBg,
//   LayeringSecondIconWithBlackBg,
//   CrossIcon,
// } from '../../iconsSvg/CustomIcon.js';
// import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
// import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { duplicateImageState, moveElementBackwardState, moveElementForwardState, toggleImageLockState, toggleLoading, toggleLockState, updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { useNavigate } from 'react-router-dom';
// import ReplaceBackgroundColorPicker from '../../CommonComponent/ChooseColorBox/ReplaceBackgroundColorPicker.jsx';

// const BASE_FILTERS = [
//   { name: 'Normal', transform: '' },
//   { name: 'Single Color', transform: '?monochrome=red' },
//   { name: 'Black/White', transform: '?sat=-100' },
// ];

// const AddImageToolbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
//   const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
//   const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
//   const img = allImageData?.find((img) => img.id == selectedImageId);
//   const [rangeValuesSize, setRangeValuesSize] = useState(0);
//   const [rangeValuesRotate, setRangeValuesRotate] = useState(0);
//   const [flipXValue, setflipXValue] = useState(false);
//   const [flipYValue, setflipYValue] = useState(false);
//   const [duplicateActive, setDuplicateActive] = useState(false);
//   const [centerActive, setCenterActive] = useState(false);
//   const [removeBackground, setRemoveBackground] = useState(false);
//   const isLocked = img?.locked;
//   const [selectedFilter, setSelectedFilter] = useState('Normal');
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTransform, setActiveTransform] = useState('');
//   const [superResolution, setSuperResolution] = useState(false);
//   const [cropAndTrim, setCropAndTrim] = useState(false);
//   const [bgColor, setBgColor] = useState("var(--black-color)");
//   const [invertColor, setInvertColor] = useState(false);
//   const [solidColor, setSolidColor] = useState(false);
//   const [threshold, setThreshold] = useState(img?.solidColorThreshold || 11);
//   const canvasRef = useRef(null);

//   const [resetDefault, setResetDefault] = useState(false);
//   const imgRef = useRef(null);

//   const [filters, setFilters] = useState(BASE_FILTERS);
//   const [activeEffects, setActiveEffects] = useState([]);

//   const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
//   const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;
//   const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
//   const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

//   const [bgColorPopup, setBGColorPopup] = useState(false);

//   useEffect(() => {
//     if (!img) return handleBack();
//     setRangeValuesSize(img.scaledValue || 1);
//     setRangeValuesRotate(img.angle || 0);
//     setflipXValue(img.flipX || false);
//     setflipYValue(img.flipY || false);
//     setSelectedFilter(img?.selectedFilter || "Normal");
//     setRemoveBackground(img.removeBg || false);
//     setSuperResolution(img.superResolution || false);
//     setCropAndTrim(img.cropAndTrim || false);
//     setInvertColor(img.invertColor || false);
//     setSolidColor(img.solidColor || false);
//     setThreshold(img.solidColorThreshold || 11);
//     try {
//       const params = img.src?.split('?')[1] || '';
//       const currentTransform = params ? `?${params}` : '';
//       setActiveTransform(currentTransform);
//       const currentEffects = params
//         ? params.split('&').filter(param => !BASE_FILTERS.some(f => f.transform.includes(param)))
//         : [];
//       setActiveEffects(currentEffects);
//     } catch {}
//   }, [img, selectedImageId, resetDefault]);

//   useEffect(() => {
//     const tempImage = new Image();
//     tempImage.crossOrigin = "anonymous";
//     setLoading(true);
//     tempImage.onload = () => {
//       setLoading(false);
//       setPreviewUrl(img.src || '');
//       if (solidColor) applyThresholdEffect(tempImage);
//     };
//     tempImage.onerror = () => {
//       console.error("Failed to load image:", img?.src);
//       setPreviewUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif");
//       setLoading(false);
//     };
//     tempImage.src = img?.src;
//   }, [img, solidColor]);

//   useEffect(() => {
//     const newFilters = BASE_FILTERS.map(filter => {
//       const newActiveEffects = activeEffects.filter(f => f !== "invert=true");
//       if (filter.name === 'Normal') {
//         return { ...filter, transform: activeEffects.length ? `?${newActiveEffects.join('&')}` : '' };
//       }
//       if (filter.name === "Black/White") {
//         const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
//         const allParams = [...new Set([...baseParams, ...newActiveEffects])];
//         return { ...filter, transform: allParams.length ? `?${allParams.join('&')}` : '' };
//       }
//       const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
//       const allParams = [...new Set([...baseParams, ...activeEffects])];
//       return { ...filter, transform: allParams.length ? `?${allParams.join('&')}` : '' };
//     });
//     setFilters(newFilters);
//     console.log("Updated filters:", newFilters); // Debug log
//   }, [activeEffects]);

//   const DPI = 300;

//   const handleRangeInputSizeChange = (e) => {
//     const rawValue = e.target.value;
//     setRangeValuesSize(rawValue);
//     const inches = parseFloat(rawValue);
//     if (isNaN(inches) || inches < 0.2 || inches > 10) return;
//     const nativeWidthPx = img?.width;
//     if (!nativeWidthPx) return;
//     const newPixelWidth = inches * DPI;
//     const newScale = newPixelWidth / nativeWidthPx;
//     globalDispatch("scaleX", newScale);
//     globalDispatch("scaleY", newScale);
//     globalDispatch("scaledValue", inches);
//     setResetDefault(false);
//     if (img?.scale && !loading) { // Only scale if not loading a filter
//       img.scale(newScale);
//       img.canvas?.requestRenderAll();
//     }
//   };

//   const handleBlur = () => {
//     const parsed = parseFloat(rangeValuesSize);
//     if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
//       setRangeValuesSize("1");
//       globalDispatch("scaleX", 1);
//       globalDispatch("scaleY", 1);
//       globalDispatch("scaledValue", 1);
//     }
//     setResetDefault(false);
//   };

//   const handleRangeInputRotateChange = (e) => {
//     const rawValue = e.target.value;
//     setRangeValuesRotate(rawValue);
//     const parsed = parseFloat(rawValue);
//     if (isNaN(parsed) || parsed < 0 || parsed > 360) return;
//     globalDispatch("angle", parsed);
//     setResetDefault(false);
//   };

//   const handleRotateBlur = () => {
//     const parsed = parseFloat(rangeValuesRotate);
//     if (isNaN(parsed) || parsed < 0 || parsed > 360) {
//       setRangeValuesRotate("0");
//       globalDispatch("angle", 0);
//     }
//     setResetDefault(false);
//   };

//   const handleDuplicateImage = () => {
//     if (!selectedImageId) return;
//     dispatch(duplicateImageState(selectedImageId));
//   };

//   const handleBack = () => {
//     navigate('/design/product');
//   };

//   const globalDispatch = useCallback((label, value) => {
//     dispatch(updateImageState({ id: selectedImageId, changes: { [label]: value }, isRenderOrNot: true }));
//   }, [dispatch, selectedImageId]);

//   const buildUrl = useCallback((transform, resetAll, filterName) => {
//     const base = img?.src?.split('?')[0] || '';
//     if (resetAll) return base;
//     const newUrl = `${base}${transform}`;
//     console.log("Built URL:", newUrl); // Debug log
//     return newUrl;
//   }, [img]);

//   const applyTransform = useCallback(async (transform, resetAll) => {
//     if (!img?.src) return;
//     const newUrl = buildUrl(transform, resetAll);
//     const loadingPlaceholder = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s';
//     setLoading(true);
//     setPreviewUrl(loadingPlaceholder);
//     const changes = { loading: true, position: img.position };
//     dispatch(toggleLoading({ changes }));
//     globalDispatch("loadingSrc", loadingPlaceholder);
//     globalDispatch("src", img.src);
//     globalDispatch("loading", true);
//     globalDispatch("transform", transform);
//     const tempImage = new Image();
//     tempImage.crossOrigin = "anonymous";
//     tempImage.onload = () => {
//       console.log("Transformed image loaded:", newUrl); // Debug log
//       setPreviewUrl(newUrl);
//       setActiveTransform(transform);
//       globalDispatch("src", newUrl);
//       dispatch(toggleLoading({ changes: { loading: false } }));
//       globalDispatch("loadingSrc", null);
//       globalDispatch("loading", false);
//       globalDispatch("removeBg", transform.includes("bg-remove=true"));
//       globalDispatch("removeBgParamValue", transform.includes("bg-remove=true") ? "bg-remove=true" : "");
//       setLoading(false);
//     };
//     tempImage.onerror = (e) => {
//       console.error("Failed to load transformed image:", newUrl, e);
//       setPreviewUrl(img.src); // Fallback to original
//       setLoading(false);
//       globalDispatch("loading", false);
//       globalDispatch("loadingSrc", null);
//     };
//     tempImage.src = newUrl;
//   }, [img, buildUrl, globalDispatch]);

//   const toggleEffect = (effect) => {
//     setActiveEffects(prev => {
//       const newEffects = prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect];
//       const baseFilter = filters.find(f => f.name === selectedFilter) || BASE_FILTERS[0];
//       const baseParams = baseFilter.transform.replace('?', '').split('&').filter(param => BASE_FILTERS.some(base => base.transform.replace('?', '').includes(param)));
//       const allParams = [...new Set([...baseParams, ...newEffects])];
//       const newTransform = allParams.length ? `?${allParams.join('&')}` : '';
//       applyTransform(newTransform);
//       return newEffects;
//     });
//   };

//   const toggle = (param, condition, filterName) => {
//     if (condition) {
//       const cleaned = activeTransform.replace(new RegExp(`${param}(&|$)`), '');
//       return applyTransform(cleaned);
//     }
//     const separator = activeTransform ? '&' : '?';
//     const updated = `${activeTransform}${separator}${param}`;
//     return applyTransform(updated);
//   };

//   const isActive = useCallback((param) => activeTransform.includes(param), [activeTransform]);

//   const callForXFlip = () => {
//     const value = !(img.flipX);
//     setflipXValue(value);
//     globalDispatch("flipX", value);
//     setResetDefault(false);
//   };

//   const callForYFlip = () => {
//     const value = !(img.flipY);
//     setflipYValue(value);
//     globalDispatch("flipY", value);
//     setResetDefault(false);
//   };

//   const handleBringBackward = () => dispatch(moveElementBackwardState(selectedImageId));
//   const handleBringForward = () => dispatch(moveElementForwardState(selectedImageId));

//   function getRenderIconForSendToTop() {
//     if (!img || (!allImageData)) return;
//     const totalElements = allImageData?.length || 0;
//     const layerIndex = img.layerIndex;
//     return layerIndex >= totalElements - 1;
//   }

//   function getRenderIconForSendToBack() {
//     if (!img || (!allImageData)) return;
//     const layerIndex = img.layerIndex;
//     return layerIndex <= 0;
//   }

//   function removeBackgroundHandler(e) {
//     const checked = !removeBackground;
//     const canvasToggle = document.querySelector(`[id^="canvas-"] input[type="checkbox"]`);
//     if (canvasToggle && canvasToggle.checked !== checked) {
//       canvasToggle.checked = checked;
//       const slider = canvasToggle.nextElementSibling;
//       const circle = slider?.nextElementSibling;
//       slider.style.backgroundColor = checked ? "#3b82f6" : "#ccc";
//       circle.style.transform = checked ? "translateX(18px)" : "translateX(0)";
//     }
//     const value = isActive('bg-remove=true');
//     toggle('bg-remove=true', value);
//     setRemoveBackground(checked);
//     globalDispatch("removeBg", checked);
//     setResetDefault(false);
//   }

//   function invertColorHandler(e) {
//     const value = isActive('invert=true');
//     toggle('invert=true', value);
//     setInvertColor(!invertColor);
//     globalDispatch("invertColor", !invertColor);
//     setResetDefault(false);
//   }

//   function solidColorHandler(e) {
//     const value = isActive('solid=true');
//     const thresholdParam = `solid=true&threshold=${threshold}`;
//     toggle(thresholdParam, value);
//     setSolidColor(!solidColor);
//     globalDispatch("solidColor", !solidColor);
//     globalDispatch("solidColorThreshold", threshold);
//     setResetDefault(false);
//     if (!solidColor) {
//       const tempImage = new Image();
//       tempImage.crossOrigin = "anonymous";
//       tempImage.onload = () => applyThresholdEffect(tempImage);
//       tempImage.onerror = () => console.error("Failed to reload image for solid color:", img?.src);
//       tempImage.src = img?.src;
//     }
//   }

//   const bGReplaceColorChangedFunctionCalled = (color) => {
//     const hex = color.replace('#', '');
//     const value = isActive(`bg-remove=true&bg=${hex}`);
//     toggle(`bg-remove=true&bg=${hex}`, value);
//     setBgColor(color);
//     setResetDefault(false);
//     const imgixParam = `bg-remove=true&bg=${hex}`;
//     globalDispatch("replaceBackgroundColor", color);
//     globalDispatch("replaceBgParamValue", imgixParam);
//   };

//   const toggleBGReplaceColorPopup = () => setBGColorPopup(!bgColorPopup);

//   function cropAndTrimdHandler(e) {
//     const value = isActive('trim=color');
//     toggle('trim=color', value);
//     setCropAndTrim(!cropAndTrim);
//     globalDispatch("cropAndTrim", !cropAndTrim);
//     setResetDefault(false);
//   }

//   function superResolutiondHandler(e) {
//     const value = isActive('auto=enhance&sharp=80&upscale=true');
//     toggle('auto=enhance&sharp=80&upscale=true', value);
//     setSuperResolution(!superResolution);
//     globalDispatch("superResolution", !superResolution);
//     setResetDefault(false);
//   }

//   const applyThresholdEffect = (image) => {
//     if (!solidColor || !canvasRef.current || !img?.src) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0);
//     try {
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
//       for (let i = 0; i < data.length; i += 4) {
//         const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
//         const value = grayscale > threshold ? 255 : 0;
//         data[i] = data[i + 1] = data[i + 2] = value;
//       }
//       ctx.putImageData(imageData, 0, 0);
//       const newUrl = canvas.toDataURL();
//       setPreviewUrl(newUrl);
//       globalDispatch("src", newUrl);
//     } catch (error) {
//       console.error("Error processing image data:", error);
//       setPreviewUrl(img.src);
//     }
//   };

//   const handleThresholdChange = (e) => {
//     const value = parseInt(e.target.value);
//     setThreshold(value);
//     globalDispatch("solidColorThreshold", value);
//     // const baseParam = `solid=true&threshold=${value}`;
//     // const valueCheck = isActive(baseParam);
//     // toggle(baseParam, valueCheck);
//     if (solidColor && img?.src) {
//       const tempImage = new Image();
//       tempImage.crossOrigin = "anonymous";
//       tempImage.onload = () => {
//         applyThresholdEffect(tempImage); // Reprocess with new threshold
//       };
//       tempImage.onerror = () => console.error("Failed to reload image for threshold:", img?.src);
//       tempImage.src = img?.src;
//     }
//   };

//   const handleReset = () => {
//     if (resetDefault) return;
//     const changes = {
//       scaleX: 1,
//       scaleY: 1,
//       rotate: 0,
//       flipX: false,
//       flipY: false,
//       position: { x: 280, y: 200 },
//       scaledValue: 1,
//       angle: 0,
//       locked: false,
//       removeBg: false,
//       cropAndTrim: false,
//       superResolution: false,
//       replaceBackgroundColor: "var(--black-color)",
//       solidColor: false,
//       solidColorThreshold: 11,
//     };
//     dispatch(updateImageState({ id: selectedImageId, changes }));
//     setRemoveBackground(false);
//     setCropAndTrim(false);
//     setSuperResolution(false);
//     setActiveTransform('');
//     setBGColorPopup(false);
//     setBgColor("var(--black-color)");
//     setSolidColor(false);
//     setThreshold(11);
//     if (previewUrl?.split("?")?.length > 1) applyTransform('', true);
//     setResetDefault(true);
//   };

//   useEffect(() => {
//     if (img?.src?.split("?").length <= 1) {
//     }
//   }, []);

//   return (
//     <div className="toolbar-main-container">
//       <div className="toolbar-main-heading">
//         <h5 className="Toolbar-badge">Upload Art</h5>
//         <span className={styles.crossIcon} onClick={handleBack}><CrossIcon /></span>
//         <h3>Edit Your Artwork</h3>
//         <p>Our design professionals will select ink colors for you or tell us your preferred colors at checkout.</p>
//       </div>
//       <div className={styles.toolbarBox}>
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//         <>
//           <hr />
//           <div className={`${styles.addTextInnerMainContainerr} ${isLocked ? styles.lockedToolbar : ''}`}>
//             <div className={styles.filterSection}>
//               <h4>Filters</h4>
//               <span className={styles.filterSpannAi}>AI GENERATED</span>
//               <div className={styles.filterOptions}>
//                 {filters.map(f => (
//                   <div
//                     key={f.name}
//                     className={`${styles.filterOption}${selectedFilter === f.name ? ' ' + styles.filterOptionActive : ''}`}
//                     onClick={() => {
//                       setSelectedFilter(f.name);
//                       const newUrl = buildUrl(f.transform, false, f.name);
//                       globalDispatch("src", newUrl);
//                       globalDispatch("selectedFilter", f.name);
//                       setPreviewUrl(newUrl); // Immediately update preview
//                       if (f.name !== "Normal") setResetDefault(false);
//                     }}
//                   >
//                     {loading ? (
//                       <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt={f.name} className={styles.filterImage} onError={e => e.target.src = '/placeholder.png'} />
//                     ) : (
//                       previewUrl && <img src={previewUrl} alt={f.name} className={styles.filterImage} onError={e => e.target.src = '/placeholder.png'} />
//                     )}
//                     <div className={styles.filterLabel}>{f.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {selectedFilter === "Single Color" && (
//               <>
//                 <hr />
//                 <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                   <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                     Inverts Colors
//                   </div>
//                   <label className={styles.switch}>
//                     <input
//                       type="checkbox"
//                       checked={invertColor}
//                       onChange={invertColorHandler}
//                       disabled={loading}
//                     />
//                     <span className={styles.slider}></span>
//                   </label>
//                 </div>
//                 <hr />
//                 <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                   <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                     Make Solid
//                   </div>
//                   <label className={styles.switch}>
//                     <input
//                       type="checkbox"
//                       checked={solidColor}
//                       onChange={solidColorHandler}
//                       disabled={loading}
//                     />
//                     <span className={styles.slider}></span>
//                   </label>
//                 </div>
//                 {solidColor && (
//                   <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                     <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                       Threshold: <strong>{threshold}</strong>
//                     </div>
//                     <input
//                       type="range"
//                       min="0"
//                       max="255"
//                       step="1"
//                       value={threshold}
//                       onChange={handleThresholdChange}
//                       disabled={!solidColor || loading}
//                     />
//                   </div>
//                 )}
//                 {(selectedFilter === "Single Color" && <hr />)}
//               </>
//             )}
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Remove Background
//                 <span className={styles.aiBadge}>AI</span>
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={removeBackground}
//                   onChange={removeBackgroundHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Crop & Trim
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={cropAndTrim}
//                   onChange={cropAndTrimdHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Super Resolution
//                 <span className={styles.aiBadge}>AI</span>
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={superResolution}
//                   onChange={superResolutiondHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Replace Background With AI<span className={styles.aiBadge}>AI</span></div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleBGReplaceColorPopup}>
//                 <SpanColorBox color={bgColor} />
//                 {bgColorPopup && (
//                   <ReplaceBackgroundColorPicker
//                     closePopupHandler={toggleBGReplaceColorPopup}
//                     defaultColor={bgColor}
//                     onApply={bGReplaceColorChangedFunctionCalled}
//                   />
//                 )}
//               </div>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Size
//               </div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
//                 <input
//                   type="range"
//                   name="size"
//                   min="0.1"
//                   max="10"
//                   step="0.1"
//                   value={rangeValuesSize}
//                   onChange={handleRangeInputSizeChange}
//                 />
//                 <input
//                   type="number"
//                   min="0.2"
//                   max="10"
//                   step="0.1"
//                   value={rangeValuesSize}
//                   onChange={handleRangeInputSizeChange}
//                   onBlur={handleBlur}
//                   className={styles.spanValueBoxInput}
//                 />
//               </div>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Rotate
//               </div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
//                 <input
//                   type="range"
//                   id="min"
//                   name="min"
//                   min="0"
//                   max="360"
//                   step="0.1"
//                   value={rangeValuesRotate}
//                   onChange={handleRangeInputRotateChange}
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   max="360"
//                   step="0.1"
//                   value={rangeValuesRotate}
//                   onChange={handleRangeInputRotateChange}
//                   onBlur={handleRotateBlur}
//                   className={styles.spanValueBoxInput}
//                 />
//               </div>
//             </div>
//             <hr />
//             <p className={styles.resetButton} onClick={handleReset}>Reset To Defaults</p>
//           </div>
//           <div className={styles.addTextFirstToolbarBoxContainer}>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div
//                 className={`${styles.toolbarBoxIconsContainer} ${centerActive ? styles.toolbarBoxIconsContainerActive : ''}`}
//                 onClick={() => {
//                   globalDispatch("position", { x: 290, y: img.position.y });
//                   setCenterActive(!centerActive);
//                   setResetDefault(false);
//                 }}
//               >
//                 <span><AlignCenterIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Center</div>
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div className={styles.toolbarBoxIconsContainerForTogether}>
//                 {getRenderIconForSendToTop() ? <div className={styles.toolbarBoxIconsContainerLayering1}><span><LayeringFirstIcon /></span></div> : <div className={styles.toolbarBoxIconsContainerLayering1} onClick={() => handleBringForward()}><span><LayeringFirstIconWithBlackBg /></span></div>}
//                 {getRenderIconForSendToBack() ? <div className={styles.toolbarBoxIconsContainerLayering2}><span><LayeringSecondIcon /></span></div> : <div className={styles.toolbarBoxIconsContainerLayering2} onClick={() => handleBringBackward()}><span><LayeringSecondIconWithBlackBg /></span></div>}
//               </div>
//               Layering
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div className={styles.toolbarBoxIconsContainerForTogether}>
//                 <div className={colorClassName} onClick={() => callForXFlip()}><span>{icon}</span></div>
//                 <div className={colorClassNameForY} onClick={() => callForYFlip()}><span>{iconY}</span></div>
//               </div>
//               Flip
//             </div>
//             <div className={styles.toolbarBoxIconsAndHeadingContainer} onClick={() => dispatch(toggleImageLockState(selectedImageId))}>
//               <div className={`${styles.toolbarBoxIconsContainer} ${isLocked ? styles.toolbarBoxIconsContainerActive : ''}`}>
//                 <span><LockIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Lock</div>
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`} onClick={handleDuplicateImage}>
//               <div className={`${styles.toolbarBoxIconsContainer} ${duplicateActive ? styles.toolbarBoxIconsContainerActive : ''}`}>
//                 <span><DuplicateIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Duplicate</div>
//             </div>
//           </div>
//         </>
//       </div>
//     </div>
//   );
// };

// export default AddImageToolbar;



// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import styles from './AddImageToolbar.module.css';
// import {
//   AlignCenterIcon,
//   LayeringFirstIcon,
//   LayeringSecondIcon,
//   FlipFirstIcon,
//   FlipSecondIcon,
//   LockIcon,
//   DuplicateIcon,
//   AngleActionIcon,
//   FlipFirstWhiteColorIcon,
//   FlipSecondWhiteColorIcon,
//   LayeringFirstIconWithBlackBg,
//   LayeringSecondIconWithBlackBg,
//   CrossIcon,
// } from '../../iconsSvg/CustomIcon.js';
// import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
// import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { duplicateImageState, moveElementBackwardState, moveElementForwardState, toggleImageLockState, toggleLoading, toggleLockState, updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { useNavigate } from 'react-router-dom';
// import ReplaceBackgroundColorPicker from '../../CommonComponent/ChooseColorBox/ReplaceBackgroundColorPicker.jsx';

// const BASE_FILTERS = [
//   { name: 'Normal', transform: '' },
//   { name: 'Single Color', transform: '?monochrome=red' },
//   { name: 'Black/White', transform: '?sat=-100' },
// ];

// const AddImageToolbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
//   const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
//   const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
//   const img = allImageData?.find((img) => img.id === selectedImageId);
//   const [rangeValuesSize, setRangeValuesSize] = useState(0);
//   const [rangeValuesRotate, setRangeValuesRotate] = useState(0);
//   const [flipXValue, setflipXValue] = useState(false);
//   const [flipYValue, setflipYValue] = useState(false);
//   const [duplicateActive, setDuplicateActive] = useState(false);
//   const [centerActive, setCenterActive] = useState(false);
//   const [removeBackground, setRemoveBackground] = useState(false);
//   const isLocked = img?.locked;
//   const [selectedFilter, setSelectedFilter] = useState('Normal');
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [activeTransform, setActiveTransform] = useState('');
//   const [superResolution, setSuperResolution] = useState(false);
//   const [cropAndTrim, setCropAndTrim] = useState(false);
//   const [bgColor, setBgColor] = useState("var(--black-color)");
//   const [invertColor, setInvertColor] = useState(false);
//   const [solidColor, setSolidColor] = useState(false);
//   const [threshold, setThreshold] = useState(141); // Default threshold value
//   const canvasRef = useRef(null);

//   const [resetDefault, setResetDefault] = useState(false);
//   const imgRef = useRef(null);

//   const [filters, setFilters] = useState(BASE_FILTERS);
//   const [activeEffects, setActiveEffects] = useState([]);

//   const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
//   const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;
//   const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
//   const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

//   const [bgColorPopup, setBGColorPopup] = useState(false);

//   useEffect(() => {
//     if (!img) return handleBack();
//     setRangeValuesSize(img.scaledValue || 1);
//     setRangeValuesRotate(img.angle || 0);
//     setflipXValue(img.flipX || false);
//     setflipYValue(img.flipY || false);
//     setSelectedFilter(img?.selectedFilter || "Normal");
//     setRemoveBackground(img.removeBg || false);
//     setSuperResolution(img.superResolution || false);
//     setCropAndTrim(img.cropAndTrim || false);
//     setInvertColor(img.invertColor || false);
//     setSolidColor(img.solidColor || false);
//     setThreshold(img.threshold || 141); // Load threshold from state
//     try {
//       const params = img.src?.split('?')[1] || '';
//       const currentTransform = params ? `?${params}` : '';
//       setActiveTransform(currentTransform);
//       const currentEffects = params ? params.split('&').filter(param => !BASE_FILTERS.some(f => f.transform.includes(param))) : [];
//       setActiveEffects(currentEffects);
//     } catch {}
//   }, [img, selectedImageId, resetDefault]);

//   useEffect(() => {
//     const tempImage = new Image();
//     tempImage.crossOrigin = "anonymous"; // Request image with CORS
//     setLoading(true);
//     tempImage.onload = () => {
//       setLoading(false);
//       setPreviewUrl(img.src || '');
//       applyThresholdEffect(tempImage); // Apply threshold effect if solidColor is true
//     };
//     tempImage.onerror = () => {
//       console.error("Failed to load image:", img?.src);
//       setPreviewUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif");
//       setLoading(false);
//     };
//     tempImage.src = img?.src;
//   }, [img, solidColor, threshold]);

//   useEffect(() => {
//     setFilters(BASE_FILTERS.map(filter => {
//       const newActiveEffects = activeEffects.filter(f => f !== "invert=true");
//       if (filter.name === 'Normal') {
//         return { ...filter, transform: activeEffects.length ? `?${newActiveEffects.join('&')}` : '' };
//       }
//       if (filter.name === "Black/White") {
//         const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
//         const allParams = [...new Set([...baseParams, ...newActiveEffects])];
//         return { ...filter, transform: allParams.length ? `?${allParams.join('&')}` : '' };
//       }
//       const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
//       const allParams = [...new Set([...baseParams, ...activeEffects])];
//       return { ...filter, transform: allParams.length ? `?${allParams.join('&')}` : '' };
//     }));
//   }, [activeEffects]);

//   const DPI = 300;

//   const handleRangeInputSizeChange = (e) => {
//     const rawValue = e.target.value;
//     setRangeValuesSize(rawValue);
//     const inches = parseFloat(rawValue);
//     if (isNaN(inches) || inches < 0.2 || inches > 10) return;
//     const nativeWidthPx = img?.width;
//     if (!nativeWidthPx) return;
//     const newPixelWidth = inches * DPI;
//     const newScale = newPixelWidth / nativeWidthPx;
//     globalDispatch("scaleX", newScale);
//     globalDispatch("scaleY", newScale);
//     globalDispatch("scaledValue", inches);
//     setResetDefault(false);
//     if (img?.scale) {
//       img.scale(newScale);
//       img.canvas?.requestRenderAll();
//     }
//   };

//   const handleBlur = () => {
//     const parsed = parseFloat(rangeValuesSize);
//     if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
//       setRangeValuesSize("1");
//       globalDispatch("scaleX", 1);
//       globalDispatch("scaleY", 1);
//       globalDispatch("scaledValue", 1);
//     }
//     setResetDefault(false);
//   };

//   const handleRangeInputRotateChange = (e) => {
//     const rawValue = e.target.value;
//     setRangeValuesRotate(rawValue);
//     const parsed = parseFloat(rawValue);
//     if (isNaN(parsed) || parsed < 0 || parsed > 360) return;
//     globalDispatch("angle", parsed);
//     setResetDefault(false);
//   };

//   const handleRotateBlur = () => {
//     const parsed = parseFloat(rangeValuesRotate);
//     if (isNaN(parsed) || parsed < 0 || parsed > 360) {
//       setRangeValuesRotate("0");
//       globalDispatch("angle", 0);
//     }
//     setResetDefault(false);
//   };

//   const handleDuplicateImage = () => {
//     if (!selectedImageId) return;
//     dispatch(duplicateImageState(selectedImageId));
//   };

//   const handleBack = () => {
//     navigate('/design/product');
//   };

//   const globalDispatch = useCallback((label, value) => {
//     dispatch(updateImageState({ id: selectedImageId, changes: { [label]: value }, isRenderOrNot: true }));
//   }, [dispatch, selectedImageId]);

//   const buildUrl = useCallback((transform, resetAll, filterName) => {
//     const base = img?.src?.split('?')[0] || '';
//     if (resetAll) return base;
//     return `${base}${transform}`;
//   }, [img]);

//   const applyTransform = useCallback(async (transform, resetAll) => {
//     if (!img?.src) return;
//     const newUrl = buildUrl(transform, resetAll);
//     const loadingPlaceholder = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdaMPJEC39w7gkdk_8CDYdbujh2-GcycSXeQ&s';
//     setLoading(true);
//     setPreviewUrl(loadingPlaceholder);
//     const changes = { loading: true, position: img.position };
//     dispatch(toggleLoading({ changes }));
//     globalDispatch("loadingSrc", loadingPlaceholder);
//     globalDispatch("src", img.src);
//     globalDispatch("loading", true);
//     globalDispatch("transform", transform);
//     const tempImage = new Image();
//     tempImage.crossOrigin = "anonymous"; // Request image with CORS
//     tempImage.onload = () => {
//       setPreviewUrl(newUrl);
//       setActiveTransform(transform);
//       globalDispatch("src", newUrl);
//       dispatch(toggleLoading({ changes: { loading: false } }));
//       globalDispatch("loadingSrc", null);
//       globalDispatch("loading", false);
//       globalDispatch("removeBg", transform.includes("bg-remove=true"));
//       globalDispatch("removeBgParamValue", transform.includes("bg-remove=true") ? "bg-remove=true" : "");
//       setLoading(false);
//     };
//     tempImage.onerror = () => {
//       console.error("Failed to load image:", newUrl);
//       setPreviewUrl(img.src);
//       setLoading(false);
//       globalDispatch("loading", false);
//       globalDispatch("loadingSrc", null);
//     };
//     tempImage.src = newUrl;
//   }, [img, buildUrl, globalDispatch]);

//   const toggleEffect = (effect) => {
//     setActiveEffects(prev => {
//       const newEffects = prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect];
//       const baseFilter = filters.find(f => f.name === selectedFilter) || BASE_FILTERS[0];
//       const baseParams = baseFilter.transform.replace('?', '').split('&').filter(param => BASE_FILTERS.some(base => base.transform.replace('?', '').includes(param)));
//       const allParams = [...new Set([...baseParams, ...newEffects])];
//       const newTransform = allParams.length ? `?${allParams.join('&')}` : '';
//       applyTransform(newTransform);
//       return newEffects;
//     });
//   };

//   const toggle = (param, condition, filterName) => {
//     if (condition) {
//       const cleaned = activeTransform.replace(new RegExp(`${param}(&|$)`), '');
//       return applyTransform(cleaned);
//     }
//     const separator = activeTransform ? '&' : '?';
//     const updated = `${activeTransform}${separator}${param}`;
//     return applyTransform(updated);
//   };

//   const isActive = useCallback((param) => activeTransform.includes(param), [activeTransform]);

//   const callForXFlip = () => {
//     const value = !(img.flipX);
//     setflipXValue(value);
//     globalDispatch("flipX", value);
//     setResetDefault(false);
//   };

//   const callForYFlip = () => {
//     const value = !(img.flipY);
//     setflipYValue(value);
//     globalDispatch("flipY", value);
//     setResetDefault(false);
//   };

//   const handleBringBackward = () => dispatch(moveElementBackwardState(selectedImageId));
//   const handleBringForward = () => dispatch(moveElementForwardState(selectedImageId));

//   function getRenderIconForSendToTop() {
//     if (!img || (!allImageData)) return;
//     const totalElements = allImageData?.length || 0;
//     const layerIndex = img.layerIndex;
//     return layerIndex >= totalElements - 1;
//   }

//   function getRenderIconForSendToBack() {
//     if (!img || (!allImageData)) return;
//     const layerIndex = img.layerIndex;
//     return layerIndex <= 0;
//   }

//   function removeBackgroundHandler(e) {
//     const checked = !removeBackground;
//     const value = isActive('bg-remove=true');
//     toggle('bg-remove=true', value);
//     setRemoveBackground(checked);
//     globalDispatch("removeBg", checked);
//     setResetDefault(false);
//   }

//   function invertColorHandler(e) {
//     const value = isActive('invert=true');
//     toggle('invert=true', value);
//     setInvertColor(!invertColor);
//     globalDispatch("invertColor", !invertColor);
//     setResetDefault(false);
//   }

//   function solidColorHandler(e) {
//     const value = isActive('solid=true');
//     toggle('solid=true', value);
//     setSolidColor(!solidColor);
//     globalDispatch("solidColor", !solidColor);
//     setResetDefault(false);
//     if (!solidColor) {
//       applyThresholdEffect(new Image()); // Reapply threshold effect when toggling on
//     }
//   }

//   const bGReplaceColorChangedFunctionCalled = (color) => {
//     const hex = color.replace('#', '');
//     const value = isActive(`bg-remove=true&bg=${hex}`);
//     toggle(`bg-remove=true&bg=${hex}`, value);
//     setBgColor(color);
//     setResetDefault(false);
//     const imgixParam = `bg-remove=true&bg=${hex}`;
//     globalDispatch("replaceBackgroundColor", color);
//     globalDispatch("replaceBgParamValue", imgixParam);
//   };

//   const toggleBGReplaceColorPopup = () => setBGColorPopup(!bgColorPopup);

//   function cropAndTrimdHandler(e) {
//     const value = isActive('trim=color');
//     toggle('trim=color', value);
//     setCropAndTrim(!cropAndTrim);
//     globalDispatch("cropAndTrim", !cropAndTrim);
//     setResetDefault(false);
//   }

//   function superResolutiondHandler(e) {
//     const value = isActive('auto=enhance&sharp=80&upscale=true');
//     toggle('auto=enhance&sharp=80&upscale=true', value);
//     setSuperResolution(!superResolution);
//     globalDispatch("superResolution", !superResolution);
//     setResetDefault(false);
//   }

//   const applyThresholdEffect = (image) => {
//     if (!solidColor || !canvasRef.current || !img?.src) return;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0);
//     try {
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;
//       for (let i = 0; i < data.length; i += 4) {
//         const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;
//         const value = grayscale > threshold ? 255 : 0;
//         data[i] = data[i + 1] = data[i + 2] = value;
//       }
//       ctx.putImageData(imageData, 0, 0);
//       const newUrl = canvas.toDataURL();
//       setPreviewUrl(newUrl);
//       globalDispatch("src", newUrl);
//     } catch (error) {
//       console.error("Error processing image data:", error);
//       // Fallback to original image if CORS fails
//       setPreviewUrl(img.src);
//     }
//   };

//   const handleThresholdChange = (e) => {
//     const newThreshold = parseInt(e.target.value, 10);
//     setThreshold(newThreshold);
//     globalDispatch("threshold", newThreshold);
//     if (solidColor && img?.src) {
//       const tempImage = new Image();
//       tempImage.crossOrigin = "anonymous"; // Request with CORS
//       tempImage.onload = () => applyThresholdEffect(tempImage);
//       tempImage.onerror = () => console.error("Failed to reload image for threshold:", img.src);
//       tempImage.src = img.src;
//     }
//   };

//   const handleReset = () => {
//     if (resetDefault) return;
//     const changes = {
//       scaleX: 1,
//       scaleY: 1,
//       rotate: 0,
//       flipX: false,
//       flipY: false,
//       position: { x: 280, y: 200 },
//       scaledValue: 1,
//       angle: 0,
//       locked: false,
//       removeBg: false,
//       cropAndTrim: false,
//       superResolution: false,
//       replaceBackgroundColor: "var(--black-color)",
//       solidColor: false,
//       threshold: 141,
//     };
//     dispatch(updateImageState({ id: selectedImageId, changes }));
//     setRemoveBackground(false);
//     setCropAndTrim(false);
//     setSuperResolution(false);
//     setActiveTransform('');
//     setBGColorPopup(false);
//     setBgColor("var(--black-color)");
//     setSolidColor(false);
//     setThreshold(141);
//     if (previewUrl?.split("?")?.length > 1) applyTransform('', true);
//     setResetDefault(true);
//   };

//   return (
//     <div className="toolbar-main-container">
//       <div className="toolbar-main-heading">
//         <h5 className="Toolbar-badge">Upload Art</h5>
//         <span className={styles.crossIcon} onClick={handleBack}><CrossIcon /></span>
//         <h3>Edit Your Artwork</h3>
//         <p>Our design professionals will select ink colors for you or tell us your preferred colors at checkout.</p>
//       </div>
//       <div className={styles.toolbarBox}>
//         <canvas ref={canvasRef} style={{ display: 'none' }} />
//         <>
//           <hr />
//           <div className={`${styles.addTextInnerMainContainerr} ${isLocked ? styles.lockedToolbar : ''}`}>
//             <div className={styles.filterSection}>
//               <h4>Filters</h4>
//               <span className={styles.filterSpannAi}>AI GENERATED</span>
//               <div className={styles.filterOptions}>
//                 {filters.map(f => (
//                   <div
//                     key={f.name}
//                     className={`${styles.filterOption}${selectedFilter === f.name ? ' ' + styles.filterOptionActive : ''}`}
//                     onClick={() => {
//                       setSelectedFilter(f.name);
//                       globalDispatch("src", buildUrl(f.transform, false, f.name));
//                       globalDispatch("selectedFilter", f.name);
//                       if (f.name !== "Normal") setResetDefault(false);
//                     }}
//                   >
//                     {loading ? <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt={f.name} className={styles.filterImage} /> : previewUrl && <img src={previewUrl} alt={f.name} className={styles.filterImage} />}
//                     <div className={styles.filterLabel}>{f.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {selectedFilter === "Single Color" && (
//               <>
//                 <hr />
//                 <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                   <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                     Inverts Colors
//                   </div>
//                   <label className={styles.switch}>
//                     <input
//                       type="checkbox"
//                       checked={invertColor}
//                       onChange={invertColorHandler}
//                       disabled={loading}
//                     />
//                     <span className={styles.slider}></span>
//                   </label>
//                 </div>
//                 <hr />
//                 <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                   <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                     Make Solid
//                   </div>
//                   <label className={styles.switch}>
//                     <input
//                       type="checkbox"
//                       checked={solidColor}
//                       onChange={solidColorHandler}
//                       disabled={loading}
//                     />
//                     <span className={styles.slider}></span>
//                   </label>
//                 </div>
//                 {solidColor && (
//                   <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//                     <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                       Threshold
//                     </div>
//                     <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
//                       <input
//                         type="range"
//                         min="0"
//                         max="255"
//                         value={threshold}
//                         onChange={handleThresholdChange}
//                         className={styles.slider}
//                       />
//                       <span>{threshold}</span>
//                     </div>
//                   </div>
//                 )}
//                 {(selectedFilter === "Single Color" && <hr />)}
//               </>
//             )}
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Remove Background
//                 <span className={styles.aiBadge}>AI</span>
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={removeBackground}
//                   onChange={removeBackgroundHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Crop & Trim
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={cropAndTrim}
//                   onChange={cropAndTrimdHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Super Resolution
//                 <span className={styles.aiBadge}>AI</span>
//               </div>
//               <label className={styles.switch}>
//                 <input
//                   type="checkbox"
//                   checked={superResolution}
//                   onChange={superResolutiondHandler}
//                   disabled={loading}
//                 />
//                 <span className={styles.slider}></span>
//               </label>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Replace Background With AI<span className={styles.aiBadge}>AI</span></div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleBGReplaceColorPopup}>
//                 <SpanColorBox color={bgColor} />
//                 {bgColorPopup && (
//                   <ReplaceBackgroundColorPicker
//                     closePopupHandler={toggleBGReplaceColorPopup}
//                     defaultColor={bgColor}
//                     onApply={bGReplaceColorChangedFunctionCalled}
//                   />
//                 )}
//               </div>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Size
//               </div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
//                 <input
//                   type="range"
//                   name="size"
//                   min="0.1"
//                   max="10"
//                   step="0.1"
//                   value={rangeValuesSize}
//                   onChange={handleRangeInputSizeChange}
//                 />
//                 <input
//                   type="number"
//                   min="0.2"
//                   max="10"
//                   step="0.1"
//                   value={rangeValuesSize}
//                   onChange={handleRangeInputSizeChange}
//                   onBlur={handleBlur}
//                   className={styles.spanValueBoxInput}
//                 />
//               </div>
//             </div>
//             <hr />
//             <div className={styles.toolbarBoxFontValueSetInnerContainer}>
//               <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
//                 Rotate
//               </div>
//               <div className={styles.toolbarBoxFontValueSetInnerActionlogo}>
//                 <input
//                   type="range"
//                   id="min"
//                   name="min"
//                   min="0"
//                   max="360"
//                   step="0.1"
//                   value={rangeValuesRotate}
//                   onChange={handleRangeInputRotateChange}
//                 />
//                 <input
//                   type="number"
//                   min="0"
//                   max="360"
//                   step="0.1"
//                   value={rangeValuesRotate}
//                   onChange={handleRangeInputRotateChange}
//                   onBlur={handleRotateBlur}
//                   className={styles.spanValueBoxInput}
//                 />
//               </div>
//             </div>
//             <hr />
//             <p className={styles.resetButton} onClick={handleReset}>Reset To Defaults</p>
//           </div>
//           <div className={styles.addTextFirstToolbarBoxContainer}>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div
//                 className={`${styles.toolbarBoxIconsContainer} ${centerActive ? styles.toolbarBoxIconsContainerActive : ''}`}
//                 onClick={() => {
//                   globalDispatch("position", { x: 290, y: img.position.y });
//                   setCenterActive(!centerActive);
//                   setResetDefault(false);
//                 }}
//               >
//                 <span><AlignCenterIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Center</div>
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div className={styles.toolbarBoxIconsContainerForTogether}>
//                 {getRenderIconForSendToTop() ? <div className={styles.toolbarBoxIconsContainerLayering1}><span><LayeringFirstIcon /></span></div> : <div className={styles.toolbarBoxIconsContainerLayering1} onClick={() => handleBringForward()}><span><LayeringFirstIconWithBlackBg /></span></div>}
//                 {getRenderIconForSendToBack() ? <div className={styles.toolbarBoxIconsContainerLayering2}><span><LayeringSecondIcon /></span></div> : <div className={styles.toolbarBoxIconsContainerLayering2} onClick={() => handleBringBackward()}><span><LayeringSecondIconWithBlackBg /></span></div>}
//               </div>
//               Layering
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
//               <div className={styles.toolbarBoxIconsContainerForTogether}>
//                 <div className={colorClassName} onClick={() => callForXFlip()}><span>{icon}</span></div>
//                 <div className={colorClassNameForY} onClick={() => callForYFlip()}><span>{iconY}</span></div>
//               </div>
//               Flip
//             </div>
//             <div className={styles.toolbarBoxIconsAndHeadingContainer} onClick={() => dispatch(toggleImageLockState(selectedImageId))}>
//               <div className={`${styles.toolbarBoxIconsContainer} ${isLocked ? styles.toolbarBoxIconsContainerActive : ''}`}>
//                 <span><LockIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Lock</div>
//             </div>
//             <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`} onClick={handleDuplicateImage}>
//               <div className={`${styles.toolbarBoxIconsContainer} ${duplicateActive ? styles.toolbarBoxIconsContainerActive : ''}`}>
//                 <span><DuplicateIcon /></span>
//               </div>
//               <div className="toolbar-box-heading-container">Duplicate</div>
//             </div>
//           </div>
//         </>
//       </div>
//     </div>
//   );
// };

// export default AddImageToolbar;