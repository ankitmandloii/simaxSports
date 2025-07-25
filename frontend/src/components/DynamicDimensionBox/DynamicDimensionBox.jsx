import React from 'react';
import style from './DynamicDimensionBox.module.css';
import { useSelector } from 'react-redux';

const DPI = 300; // Standard print DPI
const toInches = (px) => (px / DPI).toFixed(2);

const DynamicDimensionBox = () => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);
  const allImageData = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].images);

  const img = allImageData?.find((img) => img.id === selectedImageId);
  console.log("----img",img)

  if (!img) return null;

  const { left = 0, top = 0, width = 0, height = 0, scaleX = 1, scaleY = 1 } = img;

  const widthInches = toInches(width * scaleX);
  const heightInches = toInches(height * scaleY);
  const leftInches = toInches(left);
  const topInches = toInches(top);

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
      </div>
    </div>
  );
};

export default DynamicDimensionBox;
