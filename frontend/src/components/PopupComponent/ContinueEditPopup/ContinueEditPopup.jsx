import React from 'react'
import './ContinueEditPopup.css'
import { CrossIcon } from '../../iconsSvg/CustomIcon'
import { restoreDesignFromSavedState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice'
import { useDispatch } from 'react-redux'
import { restoreDesignSelectedProductSlice } from '../../../redux/ProductSlice/SelectedProductSlice'
import { restoreAllSlicesFromLocalStorage } from '../../utils/RestoreSliceStates'
const ContinueEditPopup = ({ handleContinuePopup }) => {
  const dispatch = useDispatch();

  const continueEditHandler = async() => {
    //  alert("continueEditHandler")    
    dispatch(restoreAllSlicesFromLocalStorage());
    handleContinuePopup();
  }
  const StartFromScratchHandler = () => {
    handleContinuePopup();
   }
  return (
    <div className="continue-overlay">

      <div className='continue-edit-popup-mainDiv'>


        <div className="continue-edit-header">
          <h4>Start Where You Left Off</h4>
          <span className='cross-icon-continue-box' onClick={handleContinuePopup}>
            <CrossIcon />
          </span>
        </div>
        <div className="middle-img-continue-container">
          <div className="img-small">
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />
            <img src='https://cdn.shopify.com/s/files/1/0724/8517/5535/files/unisex-premium-sweatshirt-team-red-front-6765fb41737e1.png?v=1734736719' />

          </div>
        </div>
        <button className='continue-editing-btn' onClick={continueEditHandler}>Continue Editing</button>
        <p className='start-from-scratch-para'>or <span onClick={StartFromScratchHandler}> Start From Scratch</span></p>
      </div>
    </div>
  )
}

export default ContinueEditPopup