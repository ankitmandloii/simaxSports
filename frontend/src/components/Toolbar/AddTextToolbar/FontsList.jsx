import React from "react";

function FontsList({ selectedSubCategory, onSelect }) {
    console.log(selectedSubCategory,"selectedSubCategory")
    return (
        <div className="subcategory-block">
            {selectedSubCategory && selectedSubCategory.map((font) => (
                <div
                    key={font.name}
                    onClick={() => onSelect(font.name, font.fontFamily)}
                    className="font-Category-option"
                    style={{ fontFamily: font.fontFamily }}
                >
                    {font.name}
                </div>
            ))}
        </div>
    );
}

export default FontsList;
