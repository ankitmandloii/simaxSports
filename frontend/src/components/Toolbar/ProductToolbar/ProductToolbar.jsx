import React, { useState } from 'react'
import './ProductToolbar.css'
import { IoAdd } from "react-icons/io5";
import miniProd from '../../images/mini-prod.png'
import colorwheel from '../../images/color-wheel.png'
import { RxCross1 } from "react-icons/rx";
import ChangePopup from '../../PopupComponent/ChangeProductPopup/ChangePopup';
import SpanColorBox from '../../CommonComponent/SpanColorBox/SpanColorBox';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
// import AddProductContainer from '../../addProductContainer/AddProductContainer';
const ProductToolbar = () => {
  const [changeProductPopup,setchangeProductPopup]=useState(false);
  const [addColorPopup,setaddColorPopup]=useState(false);

  const changeProductPopupHandler=()=>{
    setchangeProductPopup(!changeProductPopup);
  }
  const addColorPopupHAndler=()=>{
    setaddColorPopup(!addColorPopup);
  }
  const Onclose=()=>{
    setchangeProductPopup(false);
  }
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="toolbar-main-container">
       {/* <AddProductContainer
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        products={products}
      /> */}
<div className='toolbar-main-heading'>
  <h5 className='Toolbar-badge'>Product</h5>
  <h2 >Manage Your Products</h2>
  <p>You can select multiple products and colors</p>
</div>
<div className="toolbar-box">
  <div className="toolbar-box-top-content">
  <div className="toolbar-head">
    <div className="mini-prod-img-container">
    <img src={miniProd} className='product-mini-img'/>

    </div>
    <div >
 <h4>Essential red tshirt for men and women</h4>
 <p className='toolbar-span'>Change</p>
    </div>
  </div>
  <div className='toolbar-middle-button '>
    <button className='black-button' onClick={changeProductPopupHandler}>Change Product</button>
    <div className="add-color-btn-main-container">
    <div className='addCart-button' onClick={addColorPopupHAndler}>
      <img src={colorwheel} alt="image" className='color-img'/>
       <p >Add Color</p>
    </div>
    {addColorPopup &&  <ChooseColorBox addColorPopupHAndler={addColorPopupHAndler} title="Add another color"/>}
   
    </div>
   
  </div>
  </div>
  
  <button className='add-product-btn' onClick={()=>setShowModal(true)}> <IoAdd/> Add Products</button>
  <p className='center'>Customize Method Example</p>
  
  <div className='no-minimum-butn-container'>
  <div className='common-btn active'>
    <h4>Printing</h4>
    <p>No minimum</p>
  </div>
  <div className='common-btn'>
    <h4>Ebbroidery</h4>
    <p>No minimum</p>

  </div>
  </div>
  
</div>
{changeProductPopup && <ChangePopup onClose={Onclose}/>}
    </div>
    

    
  )
}

export default ProductToolbar