import React from "react";
import style from './FontCollectionList.module.css'

function FontsList({ selectedSubCategory, onSelect }) {
    console.log(selectedSubCategory, "selectedSubCategory")
    return (
        <div className={style.subcategoryBlock}>
            {selectedSubCategory && selectedSubCategory.map((font) => (
                <div
                    key={font.name}
                    onClick={() => onSelect(font.name, font.fontFamily)}
                    className={style.fontCategoryOption}
                    style={{ fontFamily: font.fontFamily }}
                >
                    {font.name}
                </div>
            ))}
        </div>
    );
}

export default FontsList;
