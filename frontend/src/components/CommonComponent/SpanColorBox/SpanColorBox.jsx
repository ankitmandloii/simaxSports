import React from 'react'
import './SpanColorBox.css'
const SpanColorBox = ({ color = '#ccc', onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <span className='small-color-span'
      style={{
        backgroundColor: color,
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></span>
  )
}

export default SpanColorBox
