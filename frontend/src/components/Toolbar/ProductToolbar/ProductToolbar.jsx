import React from 'react'
import './ProductToolbar.css'
import camera from '../../images/camera.jpg'
import { IoAdd } from "react-icons/io5";
const ProductToolbar = () => {
  return (
    <div className="toolbar-main-container">
<div className='toolbar-main-heading'>
  <h5 className='Toolbar-badge'>Product</h5>
  <h3 >Manage Your Products</h3>
  <p>You can select multiple products and colors</p>
</div>
<div className="toolbar-box">
  <div className="toolbar-box-top-content">
  <div className="toolbar-head">
    <img src={camera} className='product-mini-img'/>
    <div >
 <h3>Essential red tshirt for men and women</h3>
 <p>Change</p>
    </div>
  </div>
  <div className='flex  '>
    <button className='black-button'>Change Product</button>
    <button>Add Cart</button>
  </div>
  </div>
  
  <button className='add-product-btn'> <IoAdd/> Add Products</button>
  <p>Customize method Example</p>
  <div className='common-btn'>
    <p>Printing</p>
    <p>No minimum</p>

  </div>
  <div className='common-btn'>
    <p>Printing</p>
    <p>No minimum</p>

  </div>
</div>
    </div>
    
  )
}

export default ProductToolbar