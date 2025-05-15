import React from 'react'
import categorizedFonts from '../../fonts/allFonts'

function PopularFonts({onSelect}) {
  return (
      <div
            className="subcategory-block"
          >
            {categorizedFonts.map((cat) =>
              cat.fonts.map((font) => (
                <div
                  key={font.name}
                  onClick={() => onSelect(font.name, font.fontFamily)}
                  className="font-Category-option"
                  style={{ fontFamily: font.fontFamily }}
                >
                  {font.name}
                </div>
              ))
            )}
          </div>
  )
}

export default PopularFonts