import React from "react";
import categorizedFonts from "../../fonts/allFonts";

function AllFontsCategory({
  onSelect,
  setTopHeading,
  handleCategoryClick,
  setSelectedSubCategory,
}) {
  return (
    <div className="FontCollectionList-category">
      {categorizedFonts.map((cat) => (
        <div
          className="font-Category-option-heading"
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
