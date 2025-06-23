import React, { useEffect, useRef, useState } from 'react';
import styles from './AddImageToolbar.module.css';
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
} from '../../iconsSvg/CustomIcon.js';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox.jsx';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import axios from 'axios';

const filters = [
  { name: 'Normal', transform: '' },
  { name: 'Single Color', transform: '?blend=ff0000&blend-mode=color' },
  { name: 'Black/White', transform: '?sat=-100' },
];

const IMGIX_DOMAIN = 'your-subdomain.imgix.net'; // Replace with your actual Imgix domain

const AddImageToolbar = () => {
  const dispatch = useDispatch();
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);
  const imageContaintObject = allImageData.find((img) => img.id == selectedImageId);
  
  const [rangeValuesSize, setRangeValuesSize] = useState(imageContaintObject ? imageContaintObject.scaledValue : 1);
  const [rangeValuesRotate, setRangeValuesRotate] = useState(imageContaintObject ? imageContaintObject.rotate : 0);
  const [flipXValue, setflipXValue] = useState(imageContaintObject ? imageContaintObject.flipX : false);
  const [flipYValue, setflipYValue] = useState(imageContaintObject ? imageContaintObject.flipY : false);
  const [duplicateActive, setDuplicateActive] = useState(false);
  const [centerActive, setCenterActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedFilter, setSelectedFilter] = useState('Normal');
  const [activeTransform, setActiveTransform] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const isLocked = imageContaintObject?.locked;
  
  const colorClassName = flipXValue !== true ? styles.toolbarBoxIconsContainerFlip1 : styles.toolbarBoxIconsContainerClickStyleFlip1;
  const icon = flipXValue !== true ? <FlipFirstIcon /> : <FlipFirstWhiteColorIcon />;
  
  const colorClassNameForY = flipYValue !== true ? styles.toolbarBoxIconsContainerFlip2 : styles.toolbarBoxIconsContainerClickStyleFlip2;
  const iconY = flipYValue !== true ? <FlipSecondIcon /> : <FlipSecondWhiteColorIcon />;

  useEffect(() => {
    if (imageContaintObject) {  
      setRangeValuesSize(imageContaintObject.scaledValue || 1);
      setRangeValuesRotate(imageContaintObject.rotate || 0);
      setflipXValue(imageContaintObject.flipX || false);
      setflipYValue(imageContaintObject.flipY || false);
      
      // Initialize with the current image URL and any existing transformations
      if (imageContaintObject.src) {
        setPreviewUrl(imageContaintObject.src);
        // Extract existing transformations if any
        const url = new URL(imageContaintObject.src);
        const existingParams = url.search;
        setActiveTransform(existingParams);
      }
    }
  }, [imageContaintObject, selectedImageId]);

  const globalDispatch = (label, value) => {
    dispatch(updateImageState({
      id: selectedImageId,
      changes: { [label]: value },
      isRenderOrNot: true,
    }));
  };

  const applyTransform = async (transform) => {
    if (!imageContaintObject?.src) return;
    
    setLoading(true);
    setActiveTransform(transform);
    setSelectedFilter(filters.find(f => f.transform === transform)?.name || 'Normal');
    
    try {
      // For demo purposes, we'll just construct the URL directly
      // In a real app, you might want to upload to your server first
      let newUrl = imageContaintObject.src;
      
      // Remove existing query params if any
      const baseUrl = imageContaintObject.src.split('?')[0];
      
      // Apply new transformations
      newUrl = `${baseUrl}${transform}`;
      
      // If we're doing flip transformations, add them to the URL
      if (flipXValue) {
        newUrl += (transform ? '&' : '?') + 'flip=h';
      }
      if (flipYValue) {
        newUrl += (transform || flipXValue ? '&' : '?') + 'flip=v';
      }
      
      setPreviewUrl(newUrl);
      
      // Update Redux store with the new URL
      globalDispatch("src", newUrl);
      
      // If this was a background removal, update that state
      if (transform.includes('bg-remove=true')) {
        globalDispatch("removeBg", true);
        globalDispatch("removeBgParamValue", 'bg-remove=true');
      } else if (transform === '') {
        globalDispatch("removeBg", false);
        globalDispatch("removeBgParamValue", '');
      }
      
    } catch (error) {
      console.error('Transformation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRemoveBackground = () => {
    if (activeTransform.includes('bg-remove=true')) {
      // If background removal is already active, turn it off
      applyTransform(activeTransform.replace('bg-remove=true', ''));
    } else {
      // Otherwise, add background removal to current transform
      const separator = activeTransform ? '&' : '?';
      applyTransform(`${activeTransform}${separator}bg-remove=true`);
    }
  };

  const toggleCropAndTrim = () => {
    if (activeTransform.includes('fit=crop')) {
      applyTransform(activeTransform.replace(/fit=crop(&|$)/, '').replace(/crop=faces(&|$)/, ''));
    } else {
      const separator = activeTransform ? '&' : '?';
      applyTransform(`${activeTransform}${separator}fit=crop&crop=faces`);
    }
  };

  const toggleSuperResolution = () => {
    if (activeTransform.includes('auto=enhance')) {
      applyTransform(activeTransform.replace(/auto=enhance(&|$)/, '').replace(/sharp=80(&|$)/, ''));
    } else {
      const separator = activeTransform ? '&' : '?';
      applyTransform(`${activeTransform}${separator}auto=enhance&sharp=80`);
    }
  };

  const callForXFlip = () => {
    const newFlipX = !flipXValue;
    setflipXValue(newFlipX);
    globalDispatch("flipX", newFlipX);
    
    // Update the URL with flip transformation
    let newTransform = activeTransform;
    
    if (newFlipX) {
      const separator = newTransform ? '&' : '?';
      newTransform = `${newTransform}${separator}flip=h`;
    } else {
      newTransform = newTransform.replace(/flip=h(&|$)/, '');
    }
    
    setActiveTransform(newTransform);
    applyTransform(newTransform);
  };

  const callForYFlip = () => {
    const newFlipY = !flipYValue;
    setflipYValue(newFlipY);
    globalDispatch("flipY", newFlipY);
    
    // Update the URL with flip transformation
    let newTransform = activeTransform;
    
    if (newFlipY) {
      const separator = newTransform ? '&' : '?';
      newTransform = `${newTransform}${separator}flip=v`;
    } else {
      newTransform = newTransform.replace(/flip=v(&|$)/, '');
    }
    
    setActiveTransform(newTransform);
    applyTransform(newTransform);
  };

  const handleRangeInputSizeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0.2 || value > 10) return;
    
    setRangeValuesSize(value);
    globalDispatch("scaledValue", value);
    
    // For Imgix, we could add a scale parameter, but it's often better to handle scaling client-side
    // as it affects the displayed size but not the actual image data
  };

  const handleRangeInputRotateChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0 || value > 360) return;
    
    setRangeValuesRotate(value);
    globalDispatch("rotate", value);
    
    // Update the URL with rotation
    let newTransform = activeTransform;
    const rotParam = `rot=${value}`;
    
    if (newTransform.includes('rot=')) {
      newTransform = newTransform.replace(/rot=[^&]*/, rotParam);
    } else {
      const separator = newTransform ? '&' : '?';
      newTransform = `${newTransform}${separator}${rotParam}`;
    }
    
    setActiveTransform(newTransform);
    applyTransform(newTransform);
  };

  const isRemoveBgActive = activeTransform.includes('bg-remove=true');
  const isCropActive = activeTransform.includes('fit=crop');
  const isSuperResActive = activeTransform.includes('auto=enhance');

  return (
    <div className="toolbar-main-container ">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Upload Art</h5>
        <h3>Edit Your Artwork</h3>
        <p>Our design professionals will select ink colors <br></br> for you or tellus your preferred colors at checkout.</p>
      </div>

      <div className={styles.toolbarBox}>
        <div className={`${styles.addTextInnerMainContainerr} ${isLocked ? styles.lockedToolbar : ''}`}>
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Filters</div>
            <div className={styles.filterOptions}>
              {filters.map(filter => (
                <div
                  key={filter.name}
                  className={`${styles.filterOption} ${selectedFilter === filter.name ? styles.filterOptionActive : ''}`}
                  onClick={() => applyTransform(filter.transform)}
                >
                  {previewUrl && (
                    <img
                      src={`${previewUrl.split('?')[0]}${filter.transform}`}
                      alt={filter.name}
                      className={styles.filterImage}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png'; // Fallback image
                      }}
                    />
                  )}
                  <div className={styles.filterLabel}>{filter.name}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedFilter === "Normal" || selectedFilter === "Single Color" && (<hr />)}

          {selectedFilter === "Normal" && (
            <div className={styles.toolbarBoxFontValueSetInnerContainer}>
              <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Edit Colors</div>
              {/* Color editing UI would go here */}
            </div>
          )}

          {selectedFilter === "Single Color" && (
            <div className={styles.toolbarBoxFontValueSetInnerContainer}>
              <div className={styles.toolbarBoxFontValueSetInnerActionheading}>Colors</div>
              {/* Color selection UI would go here */}
            </div>
          )}

          {selectedFilter === "Single Color" && (<hr />)}

          <div className={styles.toolbarBoxFontValueSetInnerContainer}>
            <div className={styles.toolbarBoxFontValueSetInnerActionheading}>
              Remove Background
              <span className={styles.aiBadge}>AI</span>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={isRemoveBgActive}
                onChange={toggleRemoveBackground}
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
                checked={isCropActive}
                onChange={toggleCropAndTrim}
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
                checked={isSuperResActive}
                onChange={toggleSuperResolution}
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
                disabled={loading}
              />
              <input
                type="number"
                min="0.2"
                max="10"
                step="0.1"
                value={rangeValuesSize}
                onChange={(e) => setRangeValuesSize(e.target.value)}
                onBlur={(e) => handleRangeInputSizeChange(e)}
                className={styles.spanValueBoxInput}
                disabled={loading}
              />
            </div>
          </div>

          <hr />

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
                disabled={loading}
              />
              <input
                type="number"
                min="0"
                max="360"
                step="0.1"
                value={rangeValuesRotate}
                onChange={(e) => setRangeValuesRotate(e.target.value)}
                onBlur={(e) => handleRangeInputRotateChange(e)}
                className={styles.spanValueBoxInput}
                disabled={loading}
              />
            </div>
          </div>

          <hr />
          <p className='add-image-reset-text' onClick={() => applyTransform('')}>Reset To Default</p>
        </div>

        {/* Toolbar buttons for flip, layer, etc. */}
        <div className={styles.addTextFirstToolbarBoxContainer}>
          <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
            <div
              className={`${styles.toolbarBoxIconsContainer} ${centerActive ? styles.toolbarBoxIconsContainerActive : ''}`}
              onClick={() => {
                globalDispatch("position", { x: 325, y: imageContaintObject?.position?.y || 0 });
                setCenterActive(!centerActive);
              }}
            >
              <span><AlignCenterIcon /></span>
            </div>
            <div className='toolbar-box-heading-container'>Center</div>
          </div>

          <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
            <div className={styles.toolbarBoxIconsContainerForTogether}>
              <div className={styles.toolbarBoxIconsContainerLayering1}>
                <span><LayeringFirstIconWithBlackBg /></span>
              </div>
              <div className={styles.toolbarBoxIconsContainerLayering2}>
                <span><LayeringSecondIconWithBlackBg /></span>
              </div>
            </div>
            Layering
          </div>

          <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
            <div className={styles.toolbarBoxIconsContainerForTogether}>
              <div className={colorClassName} onClick={callForXFlip}>
                <span>{icon}</span>
              </div>
              <div className={colorClassNameForY} onClick={callForYFlip}>
                <span>{iconY}</span>
              </div>
            </div>
            Flip
          </div>

          <div className={styles.toolbarBoxIconsAndHeadingContainer}>
            <div className={`${styles.toolbarBoxIconsContainer} ${isLocked ? styles.toolbarBoxIconsContainerActive : ''}`}>
              <span><LockIcon /></span>
            </div>
            <div className="toolbar-box-heading-container">Lock</div>
          </div>

          <div className={`${styles.toolbarBoxIconsAndHeadingContainer} ${isLocked ? styles.lockedToolbar : ''}`}>
            <div className={`${styles.toolbarBoxIconsContainer} ${duplicateActive ? styles.toolbarBoxIconsContainerActive : ''}`}>
              <span><DuplicateIcon /></span>
            </div>
            <div className='toolbar-box-heading-container'>Duplicate</div>
          </div>
        </div>
      </div>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
          <p>Applying changes...</p>
        </div>
      )}
    </div>
  );
};

export default AddImageToolbar;