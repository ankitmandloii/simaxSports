// import React from "react";
// import "./FontCollectionList.css";
// import { CrossIcon } from "../../iconsSvg/CustomIcon";

// function FontCollectionList({ onSelect, onClose }) {
//   // const dummyCollectionOfFontsCategory = [
//   //     { id: 1, nameOfCategory: 'Comic', fontFamily: 'Georgia, serif', fontWeight: '400', fontStyle: 'normal' },
//   //     { id: 2, nameOfCategory: 'Comic', fontFamily: 'Arial, sans-serif', fontWeight: '700', fontStyle: 'italic' },
//   //     { id: 3, nameOfCategory: 'Comic', fontFamily: 'Roboto, sans-serif: '400', fontStyle: 'normal' },
//   //     { id: 4, nameOfCategory: 'Comic', fontFamily: 'Courier New, monospace', fontWeight: '400', fontStyle: 'normal' },
//   //     { id: 5, nameOfCategory: 'Comic', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: '400', fontStyle: 'normal' },
//   //     { id: 6, nameOfCategory: 'Comic', fontFamily: 'Consolas, monospace', fontWeight: '500', fontStyle: 'italic' },
//   //     { id: 7, nameOfCategory: 'Comic', fontFamily: 'Indie Flower', fontWeight: '400', fontStyle: 'normal' },
//   //     { id: 8, nameOfCategory: 'Comic', fontFamily: 'Reenie Beanie', fontWeight: '400', fontStyle: 'italic' },
//   //     { id: 9, nameOfCategory: 'Comic', fontFamily: 'Architects Daughter', fontWeight: '400', fontStyle: 'normal' },

//   //     { id: 10, nameOfCategory: 'Brush', fontFamily: 'Brush Script MT', fontWeight: '400', fontStyle: 'italic' },
//   //     { id: 11, nameOfCategory: 'Brush', fontFamily: 'Pacifico', fontWeight: '400', fontStyle: 'normal' },

//   //     { id: 12, nameOfCategory: 'Standard', fontFamily: 'Arial', fontWeight: '400', fontStyle: 'normal' },
//   //     { id: 13, nameOfCategory: 'Standard', fontFamily: 'Verdana', fontWeight: '700', fontStyle: 'normal' },

//   //     { id: 14, nameOfCategory: 'Serif', fontFamily: 'Times New Roman', fontWeight: '400', fontStyle: 'normal' },

//   //     { id: 15, nameOfCategory: 'Mono', fontFamily: 'Courier New', fontWeight: '400', fontStyle: 'normal' },

//   //     { id: 16, nameOfCategory: 'Geometric', fontFamily: 'Futura', fontWeight: '400', fontStyle: 'normal' }
//   //   ];

//   const fontFamilyArry = [
//     {
//       key: "georgia",
//       name: "Georgia",
//       fontFamily: "Georgia, serif",
//     },
//     {
//       key: "arial",
//       name: "Arial",
//       fontFamily: "Arial, sans-serif",
//     },
//     {
//       key: "roboto",
//       name: "Roboto",
//       fontFamily: "Roboto, sans-serif",
//     },
//     {
//       key: "Noto Sans Georgian",
//       name: "Noto Sans Georgian",
//       fontFamily: "Noto Sans Georgian",
//     },
//     {
//       key: "helvetica_neue",
//       name: "Helvetica Neue",
//       fontFamily: "Helvetica Neue, sans-serif",
//     },
//     {
//       key: "consolas",
//       name: "Consolas",
//       fontFamily: "Consolas, monospace",
//     },
//     {
//       key: "segoe_ui",
//       name: "Segoe UI",
//       fontFamily: "Segoe UI, sans-serif",
//     },
//     {
//       key: "system_ui",
//       name: "System UI",
//       fontFamily: "-apple-system",
//     },
//   ];

//   const categorizedFonts = [
//     {
//       category: "Basic",
//       subcategories: [
//         {
//           name: "Sans-serif",
//           fonts: [
//             { name: "Lato", fontFamily: "Lato, sans-serif" },
//             { name: "Poppins", fontFamily: "Poppins, sans-serif" },
//             { name: "Barlow", fontFamily: "Barlow, sans-serif" },
//             { name: "Open Sans", fontFamily: "Open Sans, sans-serif" },
//             { name: "Roboto", fontFamily: "Roboto, sans-serif" },
//             { name: "Work Sans", fontFamily: "Work Sans, sans-serif" },
//           ],
//         },
//         {
//           name: "Serif",
//           fonts: [
//             { name: "Caudex", fontFamily: "Caudex, serif" },
//             { name: "Crimson Text", fontFamily: "Crimson Text, serif" },
//             {
//               name: "Cormorant Garamond",
//               fontFamily: "Cormorant Garamond, serif",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       category: "Elegant",
//       subcategories: [
//         {
//           name: "Serif Display",
//           fonts: [
//             { name: "Forum", fontFamily: "Forum, serif" },
//             { name: "Playfair Display", fontFamily: "Playfair Display, serif" },
//             { name: "Lora", fontFamily: "Lora, serif" },
//           ],
//         },
//       ],
//     },
//     {
//       category: "Casual",
//       subcategories: [
//         {
//           name: "Handwriting",
//           fonts: [
//             { name: "Pacifico", fontFamily: "Pacifico, cursive" },
//             {
//               name: "Shadows Into Light",
//               fontFamily: "Shadows Into Light, cursive",
//             },
//             { name: "Dancing Script", fontFamily: "Dancing Script, cursive" },
//           ],
//         },
//       ],
//     },
//     {
//       category: "Youthful",
//       subcategories: [
//         {
//           name: "Fun Display",
//           fonts: [
//             { name: "Fredoka", fontFamily: "Fredoka, sans-serif" },
//             { name: "Chewy", fontFamily: "Chewy, cursive" },
//           ],
//         },
//       ],
//     },
//   ];

//   return (
//     <>
//       <div className="FontCollectionList-header">
//         <p>Font</p>
//         <span className="FontCollectionList-header-cross" onClick={onClose}>
//           <CrossIcon />
//         </span>
//       </div>

//       <hr></hr>
//       <div className="font-list-scrollable">
//         <div className="FontCollectionList-category">
//           <div className="font-Category-option-heading">POPULAR</div>
//           <div className="font-Category-option-heading">View All</div>

//           {/* {fontFamilyArry.map((data) => (
//             <div
//               key={data.key}
//               onClick={() => onSelect(data.name, data.fontFamily)}
//               className="font-Category-option"
//             >
//               {data.name}
//             </div>
//           ))} */}
//         </div>
//       </div>
//     </>
//   );
// }

// export default FontCollectionList;

import React, { useState } from "react";
import "./FontCollectionList.css";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import categorizedFonts from "../../fonts/allFonts";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import ViewAllFonts from "./ViewAllFonts";
import PopularFonts from "./PopularFonts";
import AllFontsCategory from "./AllFontsCategory";
import FontsList from "./FontsList";

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
      <div className="FontCollectionList-header">
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

      <div className="font-list-scrollable">
        {!selectedSubCategory && !selectedViewAll && !selectedPopular  && (
          <div className="font-Category-option-heading-top-container">
            <div
              className="font-Category-option-heading-top"
              onClick={() => {
                setSelectedPopular(!selectedPopular);
                setTopHeading("Popular");
                setSelectedSubCategory(null);
              }}
            >
              POPULAR
            </div>
            <div
              className="font-Category-option-heading-top "
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
