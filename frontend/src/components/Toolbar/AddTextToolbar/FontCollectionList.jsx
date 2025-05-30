import React, { useState } from "react";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import ViewAllFonts from "./ViewAllFonts";
import PopularFonts from "./PopularFonts";
import AllFontsCategory from "./AllFontsCategory";
import FontsList from "./FontsList";
import style from './FontCollectionList.module.css'

function FontCollectionList({ onSelect, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedViewAll, setSelectedViewAll] = useState(false);
  const [selectedPopular, setSelectedPopular] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [topHeading, setTopHeading] = useState("Fonts"); // fonts , sub-category,View All, Popular

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  console.log(topHeading);

  function Render() {
    switch (topHeading) {
      case "Fonts":
        return (
          <AllFontsCategory
            onSelect={onSelect}
            setTopHeading={setTopHeading}
            handleCategoryClick={handleCategoryClick}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        );
        break;

      case "View All":
        return <ViewAllFonts onSelect={onSelect} />;
        break;

      case "Popular":
        return <PopularFonts onSelect={onSelect} />;
        break;

      default:
        return (
          <FontsList
            onSelect={onSelect}
            setTopHeading={setTopHeading}
            selectedSubCategory={selectedSubCategory}
          />
        );
        break;
    }
  }

  return (
    <>
      <div className={style.fontCollectionListHeader}>
        {(selectedSubCategory || selectedPopular || selectedViewAll) && (
          <IoArrowBackCircleSharp
            style={{ fontSize: 25, cursor: "pointer" }}
            onClick={() => {
              setSelectedPopular(null);
              setSelectedViewAll(null);
              setSelectedSubCategory(null);
              setTopHeading("Fonts");
            }}
          />
        )}

        <p>{topHeading}</p>
        <span className="FontCollectionList-header-cross" onClick={onClose}>
          <CrossIcon />
        </span>
      </div>

      <hr />

      <div className={style.fontListScrollable}>
        {!selectedSubCategory && !selectedViewAll && !selectedPopular && (
          <div className={style.fontCategoryOptionHeadingTopContainer}>
            <div
              className={style.fontCategoryOptionHeadingTop}
              onClick={() => {
                setSelectedPopular(!selectedPopular);
                setTopHeading("Popular");
                setSelectedSubCategory(null);
              }}
            >
              POPULAR
            </div>
            <div
              className={style.fontCategoryOptionHeadingTop}
              onClick={() => {
                setSelectedViewAll(true);
                setSelectedSubCategory(null);
                setTopHeading("View All");
              }}
            >
              View All
            </div>
          </div>
        )}

        {/* {selectedSubCategory ? (
          <FontsList
            onSelect={onSelect}
            setTopHeading={setTopHeading}
            selectedSubCategory={selectedSubCategory}
          />
        ) : selectedViewAll ? (
          <ViewAllFonts onSelect={onSelect} />
        ) : (
          <AllFontsCategory
            onSelect={onSelect}
            setTopHeading={setTopHeading}
            handleCategoryClick={handleCategoryClick}
            setSelectedSubCategory={setSelectedSubCategory}
          />
        )} */}

        {Render()}
      </div>
    </>
  );
}

export default FontCollectionList;
