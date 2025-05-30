import React from 'react'
import style from './SpanValueBox.module.css'
const SpanValueBox = ({ valueShow }) => {
  return (
    <span className={style.SpanValueBoxSmallColorSpan}>{valueShow}</span>
  )
}

export default SpanValueBox
