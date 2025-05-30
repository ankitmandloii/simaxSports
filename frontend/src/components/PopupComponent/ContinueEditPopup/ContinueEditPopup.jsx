import React from 'react'
import style from './ContinueEditPopup.module.css'
import { CrossIcon } from '../../iconsSvg/CustomIcon'
import { restoreDesignFromSavedState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice'
import { useDispatch } from 'react-redux'
import { restoreDesignSelectedProductSlice } from '../../../redux/ProductSlice/SelectedProductSlice'
import { restoreAllSlicesFromLocalStorage } from '../../utils/RestoreSliceStates'
const ContinueEditPopup = ({ handleContinuePopup }) => {
  const dispatch = useDispatch();

  const continueEditHandler = async () => {
    //  alert("continueEditHandler")    
    dispatch(restoreAllSlicesFromLocalStorage());
    handleContinuePopup();
  }
  const StartFromScratchHandler = () => {
    handleContinuePopup();
  }
  return (
    <div className={style.continueOverlay}>

      <div className={style.continueEditPopupMainDiv}>


        <div className={style.continueEditHeader}>
          <h4>Start Where You Left Off</h4>
          <span className={style.crossIconContinueBox} onClick={handleContinuePopup}>
            <CrossIcon />
          </span>
        </div>
        <div className="middle-img-continue-container">
          <div className={style.imgSmall}>
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />

          </div>
        </div>
        <button className={style.continueEditingBtn} onClick={continueEditHandler}>Continue Editing</button>
        <p className={style.startFromScratchPara}>or <span onClick={StartFromScratchHandler}> Start From Scratch</span></p>
      </div>
    </div>
  )
}

export default ContinueEditPopup