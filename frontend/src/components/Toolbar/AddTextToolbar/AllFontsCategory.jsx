import React from "react";
import categorizedFonts from "../../fonts/allFonts";
import style from './FontCollectionList.module.css'

function AllFontsCategory({
  onSelect,
  setTopHeading,
  handleCategoryClick,
  setSelectedSubCategory,
}) {
  return (
    <div className={style.fontCollectionListCategory}>
      {categorizedFonts.map((cat) => (
        <div
          className={style.fontCategoryOptionHeading}
          onClick={() => {
            handleCategoryClick(cat.category);
            setSelectedSubCategory(cat.fonts);
            setTopHeading(cat.category);
          }}
          style={{ fontFamily: cat.fonts[0].fontFamily }}
        >
          {cat.category}
        </div>
      ))}
    </div>
  );
}

export default AllFontsCategory;
