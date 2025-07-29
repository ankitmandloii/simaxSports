import React, { useEffect, useState } from 'react';
import style from './DynamicDimensionBox.module.css';
import { useSelector } from 'react-redux';

const DPI = 300;
const toInches = (px) => (px / DPI).toFixed(2);

const getDpiColor = (dpi) => {
  if (dpi >= 300) return '#4CAF50';    // Green
  if (dpi >= 250) return '#FFC107';    // Amber
  if (dpi >= 200) return '#FF5722';    // Orange/Red
  return '#000000';                    // Black
};

const DynamicDimensionBox = () => {
  const [nativeResolution, setNativeResolution] = useState(null);

  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedImageId = useSelector(
    (state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId
  );
  const allImageData = useSelector(
    (state) => state.TextFrontendDesignSlice.present[activeSide].images
  );

  const img = allImageData?.find((img) => img.id === selectedImageId);

  // Default values to prevent hook ordering issues
  const {
    left = 0,
    top = 0,
    width = 0,
    height = 0,
    scaleX = 1,
    scaleY = 1,
    src = null
  } = img || {};

  const renderWidthPx = width * scaleX;
  const renderHeightPx = height * scaleY;

  const widthInches = toInches(renderWidthPx);
  const heightInches = toInches(renderHeightPx);
  const leftInches = toInches(left);
  const topInches = toInches(top);

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      const renderWidthInches = renderWidthPx / DPI;
      const resolution = image.width / renderWidthInches;
      setNativeResolution(Math.round(resolution));
    };
  }, [src, renderWidthPx]);

  if (!img) return null;

  return (
    <div className={style.container}>
      <div className={style.box}>
        <div className={style.roww}>
          <p>Left</p>
          <p>{leftInches} in</p>
        </div>
        <div className={style.roww}>
          <p>Top</p>
          <p>{topInches} in</p>
        </div>
        <div className={style.roww}>
          <p>Width</p>
          <p>{widthInches} in</p>
        </div>
        <div className={style.roww}>
          <p>Height</p>
          <p>{heightInches} in</p>
        </div>
        {nativeResolution && (
          <div className={style.roww}>
            <p>Resolution</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: getDpiColor(nativeResolution),
                  display: 'inline-block',
                }}
              />
              <p style={{ margin: 0, color: getDpiColor(nativeResolution) }}>
                {nativeResolution} dpi
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicDimensionBox;
