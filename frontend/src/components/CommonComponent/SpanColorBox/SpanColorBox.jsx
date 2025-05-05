import React from 'react'
import './SpanColorBox.css'
const SpanColorBox = ({ color = '#ccc', onClick }) => {
  return (
    <span className='small-color-span'
    style={{
      backgroundColor: color,
     
      cursor: 'pointer',
    }}
    onClick={onClick}></span> 
  )
}

export default SpanColorBox
