import React from 'react'
import categorizedFonts from '../../fonts/allFonts'
import style from './FontCollectionList.module.css'
function ViewAllFonts({ onSelect }) {
  return (
    <div
      className={style
        .subcategoryBlock}
    >
      {categorizedFonts.map((cat) =>
        cat.fonts.map((font) => (
          <div
            key={font.name}
            onClick={() => onSelect(font.name, font.fontFamily)}
            className={style.fontCategoryOption}
            style={{ fontFamily: font.fontFamily }}
          >
            {font.name}
          </div>
        ))
      )}
    </div>
  )
}

export default ViewAllFonts