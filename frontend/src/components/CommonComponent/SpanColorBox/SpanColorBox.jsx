import React from 'react'
import style from './SpanColorBox.module.css'
const SpanColorBox = ({ color = '#ccc', onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <span className={style.smallColorSpan}
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
