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
// import FontCollectionList from './FontCollectionList';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { duplicateImageState, updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { useNavigate } from 'react-router-dom';
// import { setCenterState, setFlipXState, setFlipYState, setFontFamilyState, setOutLineColorState, setOutLineSizeState, setRangeState, setText, setTextColorState } from '../../../redux/canvasSlice/CanvasSlice.js';
// import SpanValueBox from '../../CommonComponent/SpanValueBox/SpanValueBox.jsx';
// import { duplicateTextState, addTextState, updateTextState, toggleLockState, moveTextForwardState, moveTextBackwardState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
// import { setSelectedBackTextState } from '../../../redux/BackendDesign/TextBackendDesignSlice.js';

const BASE_FILTERS = [
  { name: 'Normal', transform: '' },
  { name: 'Single Color', transform: '?monochrome=fff000' },
  { name: 'Black/White', transform: '?sat=-100' },
];


const AddImageToolbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedTextId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  const img = allImageData.find((img) => img.id == selectedImageId);

  const [rangeValuesSize, setRangeValuesSize] = useState(0);
  const [rangeValuesRotate, setRangeValuesRotate] = useState(0);
  const [flipXValue, setflipXValue] = useState(false);
  const [flipYValue, setflipYValue] = useState(false);
  const [duplicateActive, setDuplicateActive] = useState(false);
  const [centerActive, setCenterActive] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTransform, setActiveTransform] = useState('');
  const [cropAndTrim, setCropAndTrim] = useState(false);
  const [superResolution, setSuperResolution] = useState(false);
  const imgRef = useRef(null);

  const [filters, setFilters] = useState(BASE_FILTERS);
  const [activeEffects, setActiveEffects] = useState([]);
  //  const [activeFilter, setActiveFilter] = useState(filters[0]);


  const textareaRef = useRef(null)

  const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;

  const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;


  // const [textColorPopup, setTextColorPopup] = useState(false);

  // Init from store
  useEffect(() => {
    if (!img) return;
    setRangeValuesSize(img.scaledValue || 1);
    setRangeValuesRotate(img.angle || 0);
    setflipXValue(img.flipX || false);
    setflipYValue(img.flipY || false);
    setPreviewUrl(img.src || '');
    try {
      const params = img.src?.split('?')[1] || '';
      const currentTransform = params ? `?${params}` : '';
      setActiveTransform(currentTransform);

      const currentEffects = params
        ? params.split('&').filter(param =>
          !BASE_FILTERS.some(f => f.transform.includes(param))
        )
        : [];
      setActiveEffects(currentEffects);

      // const baseFilter = BASE_FILTERS.find(f =>
      //   currentTransform.includes(f.transform.replace('?', ''))
      // ) || BASE_FILTERS[0];
      // setSelectedFilter(baseFilter.name);
    } catch { }
  }, [img]);


  useEffect(() => {
    setFilters(BASE_FILTERS.map(filter => {
      if (filter.name === 'Normal') {
        return {
          ...filter,
          transform: activeEffects.length ? `?${activeEffects.join('&')}` : ''
        };
      }

      const baseParams = filter.transform.replace('?', '').split('&').filter(Boolean);
      const allParams = [...new Set([...baseParams, ...activeEffects])];
      return {
        ...filter,
        transform: allParams.length ? `?${allParams.join('&')}` : ''
      };
    }));
  }, [activeEffects]);

  const handleRangeInputSizeChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesSize(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0.2 || parsed > 10) return;

    const scaleX = img.scaleX;
    const scaleY = img.scaleY;

    // Use average of current X and Y scale as "prev size"
    const currentAvg = (scaleX + scaleY) / 2;

    const scaleRatio = parsed / currentAvg;

    globalDispatch("scaleX", scaleX * scaleRatio);
    globalDispatch("scaleY", scaleY * scaleRatio);
    globalDispatch("scaledValue", parsed);
  };

  const handleBlur = () => {
    // const parsed = parseFloat(rangeValuesSize);
    // if (isNaN(parsed) || parsed < 0.2 || parsed > 10) {
    //   setRangeValuesSize("5");
    //   setPrevSize(5);
    //   globalDispatch("scaleX", 5);
    //   globalDispatch("scaleY", 5);
    //   globalDispatch("scaledValue", 5);
    // }
  };



  const handleRangeInputRotateChange = (e) => {
    const rawValue = e.target.value;
    setRangeValuesRotate(rawValue);

    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 360) return;

    globalDispatch("angle", parsed);
  };


  const handleRotateBlur = () => {
    // const parsed = parseFloat(rangeValuesRotate);
    // if (isNaN(parsed) || parsed < 0 || parsed > 360) {
    //   setRangeValuesRotate("0");
    //   globalDispatch("rotate", 0);
    // }
  };
  const handleDuplicateImage = () => {
    if (!selectedImageId) return;
    dispatch(duplicateImageState(selectedImageId));
  };


  const handleBack = () => {
    navigate('/design/product');
  }

  const globalDispatch = useCallback((label, value) => {
    dispatch(updateImageState({ id: selectedImageId, changes: { [label]: value }, isRenderOrNot: true }));
  }, [dispatch, selectedImageId]);


  // const [filters, setFilters] = useState([
  //   { name: 'Normal', transform: '' },
  //   { name: 'Single Color', transform: '?monochrome=ff0000' },
  //   { name: 'Black/White', transform: '?sat=-100' }
  // ]);
  const buildUrl = useCallback((transform) => {
    const base = img?.src?.split('?')[0] || '';
    return `${base}${transform}`;
  }, [img]);

  const applyTransform = useCallback(
    async (transform) => {
      if (!img?.src) return;

      setLoading(true); // Start loading
      const newUrl = buildUrl(transform);

      // Create a new Image object to truly track loading
      const tempImage = new Image();
      tempImage.onload = () => {
        setPreviewUrl(newUrl); // Update previewUrl only when loaded
        setActiveTransform(transform);
        globalDispatch('src', newUrl); // Dispatch to Redux only when loaded
        globalDispatch('removeBg', transform.includes('bg-remove=true'));
        globalDispatch('removeBgParamValue', transform.includes('bg-remove=true') ? 'bg-remove=true' : '');
        setLoading(false); // End loading
      };
      tempImage.onerror = () => {
        console.error('Failed to load image:', newUrl);
        setPreviewUrl('/placeholder.png'); // Fallback on error
        setLoading(false); // End loading even on error
      };
      tempImage.src = newUrl; // Start loading the image
    },
    [img, buildUrl, globalDispatch]
  ); //


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

      applyTransform(newTransform);
      return newEffects;
    });
  };

  const toggle = (param, condition) => applyTransform(condition ? activeTransform.replace(new RegExp(`${param}(&|$)`), '') : `${activeTransform}${activeTransform ? '&' : '?'}${param}`);

  const isActive = useCallback((param) => activeTransform.includes(param), [activeTransform]);


  const callForXFlip = () => {
    // const value = !(imageContaintObject.flipX);
    // setflipXValue(value);
    // globalDispatch("flipX", value);
    //console.log("clicked", value);
  }




  //for FLipY


  const callForYFlip = () => {
    // const value = !(imageContaintObject.flipY);
    // setflipYValue(value);
    // //console.log("y value ", value);
    // globalDispatch("flipY", value);
  }

  // useEffect(() => {
  //   //console.log(currentTextToolbarId, "id =>");
  // }, [flipXValue, flipYValue])

  const handleDuplcateTextInput = () => {
    // const islocked = imageContaintObject.locked;
    // if (islocked) return;
    // setDuplicateActive(prev => !prev);
    // dispatch(duplicateTextState(currentTextToolbarId));
  }

  const handleBringBackward = () => {

    // dispatch(moveTextBackwardState(selectedTextId));
  };
  const handleBringForward = () => {
    //dispatch(moveTextForwardState(selectedTextId));
  };

  function getRenderIconForSendToTop() {
    // if (!imageContaintObject || !allTextInputData) return;
    // // console.log(imageContaintObject.layerIndex + 1, allTextInputData.length, "both values");
    // const layerIndex = imageContaintObject.layerIndex;
    // const ArraySize = allTextInputData.length - 1;


    // // console.log(layerIndex, ArraySize, "layer data")

    // if (layerIndex > 0 && layerIndex < ArraySize) return false;

    // if (layerIndex < ArraySize) return false

    // return true;

  }
  function getRenderIconForSendToBack() {
    // if (!imageContaintObject || !allTextInputData) return;
    // const layerIndex = imageContaintObject.layerIndex;
    // const ArraySize = allTextInputData.length;

    // // console.log(layerIndex, ArraySize, "layer data")

    // if (layerIndex > 0 && layerIndex < ArraySize) return false;

    // if (layerIndex > 0) return false

    // return true;
  }

  function removeBackgroundHandler(e) {
    // update local state
    const value = isActive('bg-remove=true');
    toggle('bg-remove=true', value)
    setRemoveBackground(!removeBackground);
    // update redux store
    globalDispatch("removeBg", !removeBackground);
  }

  function cropAndTrimdHandler(e) {
    // update local state

    const value = isActive('fit=crop&crop=faces&w=400&h=400');
    toggle('fit=crop&crop=faces&w=400&h=400', value)
    setCropAndTrim(value);
    // update redux store
    globalDispatch("cropAndTrim", value);
  }

  function superResolutiondHandler(e) {
    // update local state
    const value = isActive('auto=enhance&sharp=80&upscale=true');
    toggle('auto=enhance&sharp=80&upscale=true', value)
    setSuperResolution(value);
    // update redux store
    globalDispatch("superResolution", value);
  }
  useEffect(() => {
    applyTransform();
  }, [])

  // console.log("previewUrl", previewUrl, "image src", img?.src);
  //  if(loading) return <div className={styles.loadingOverlay}><div className={styles.loadingSpinner} /><p>Applying changes...</p></div>;
  return (

    <div className="toolbar-main-container ">

      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Upload Art</h5>
        <span className={styles.crossIcon} onClick={handleBack}><CrossIcon /></span>
        <h3>Edit Your Artwork</h3>
        <p>Our design professionals will select ink colors <br></br> for you or tellus your preferred colors at checkout.</p>
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
                        applyTransform(f.transform);
                        setSelectedFilter(f.name);
                      }}
                    >
                      {
                        loading ? <> <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt={f.name} className={styles.filterImage} onError={e => e.target.src = '/placeholder.png'} /></> : <> {previewUrl && <img src={buildUrl(f.transform)} alt={f.name} className={styles.filterImage} onError={e => e.target.src = '/placeholder.png'} />}</>
                      }


                      <div className={styles.filterLabel}>{f.name}</div>
                      {/* <img
                        src={previewUrl} alt={filter.name} className={styles.filterImage} onError={() => alert("Image not publicly accessible")} />
                      <div className={styles.filterLabel}>{filter.name}</div> */}
                    </div>
                  ))}
                </div>
              </div>

              {selectedFilter === "Normal" || selectedFilter === "Single Color" && (<hr />)}

              {selectedFilter === "Normal" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Edit Colors</div>
                {/* <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={toggleTextColorPopup}>
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
                </div> */}
              </div>)}



              {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Colors</div>
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
              </div>)}
              {selectedFilter === "Black/Whte" && null}


              {selectedFilter === "Single Color" && (<hr />)}



              {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                  Inverts Colors

                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                  // checked={"removeBackground"}
                  // onChange={"toggleRemoveBackground"}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              )}
              <hr />


              {selectedFilter === "Single Color" && (<div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
                  Make Solid

                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                  // checked={"removeBackground"}
                  // onChange={"toggleRemoveBackground"}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              )}
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
                    checked={superResolution}
                    onChange={superResolutiondHandler}
                    disabled={loading}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <hr />


              <div className={styles.toolbarBoxFontValueSetInnerContainer}>
                <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Replace Background With AI<span className={styles.aiBadge}>AI</span></div>

                <div className={styles.toolbarBoxFontValueSetInnerActionheading} onClick={() => { }}>


                  <span><AngleActionIcon /></span>



                </div>
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
                    min="0.2"
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
                    // onChange={handleRangeInputSizeChange}
                    // onBlur={handleBlur}
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
                    // value={rangeValuesRotate}
                    // onChange={handleRangeInputRotateChange}
                    // onBlur={handleRotateBlur}
                    className={styles.spanValueBoxInput}
                  />


                </div>
              </div>

              <hr></hr>
              <p className='add-image-reset-text'>Reset To Default</p>

            </div>

            {/* this is toolbar of image for upload art exm- layring, flip, color, size, arc, rotate, spacing */}
            <div className={styles.addTextFirstToolbarBoxContainer}>

              <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                <div
                  className={`${styles.toolbarBoxIconsContainer} ${centerActive ? styles.toolbarBoxIconsContainerActive : ''}`}
                  onClick={() => {
                    // globalDispatch("position", { x: 325, y: imageContaintObject.position.y });
                    // setCenterActive(!centerActive);
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
                    // onClick={() => handleBringForward()}
                    >
                      <span><LayeringFirstIconWithBlackBg /></span></div>
                  }

                  {
                    getRenderIconForSendToBack() ? <div className={styles.toolbarBoxIconsContainerLayering2} > <span><LayeringSecondIcon /></span> </div> : <div className={styles.toolbarBoxIconsContainerLayering2}
                    // onClick={() => handleBringBackward()}
                    >  <span><LayeringSecondIconWithBlackBg /></span></div>
                  }
                </div>
                Layering
              </div>

              <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
                <div className={styles.toolbarBoxIconsContainerForTogether}>
                  <div className={colorClassName}
                  // onClick={() => callForXFlip()}
                  ><span>{icon}</span></div>
                  <div className={colorClassNameForY}
                  //  onClick={() => callForYFlip()}
                  ><span>{iconY}</span></div>
                </div>
                Flip
              </div>

              <div
                className={styles.toolbarBoxIconsAndHeadingContainer}
              // onClick={() => dispatch(toggleLockState(currentTextToolbarId))}
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
    </div >
  );
};

export default AddImageToolbar;
