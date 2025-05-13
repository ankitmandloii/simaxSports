import React from "react";
import "./AddProductContainer.css";
import products from "../../product";
import colorwheel1 from '../../images/color-wheel1.png'

// const AddProductContainer = ({ isOpen, onClose, products }) => {
  const AddProductContainer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Product</h2>
          
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <hr></hr>
        <p>Select From Our Most Popular Products</p>

        <ul className="product-list">
          {products.map((product, index) => (
            <li className="modal-product" key={index}>
              <img src={product.imgurl} alt={product.name} className="modal-productimg"/>
              <p>{product.name}</p>
              <br/>
              <div className="modal-productcolor-container">
                <img src={colorwheel1} alt="image" className='modal-productcolor-img'/>
                <p>4 Colors</p>
              </div>
             
            </li>
          ))}
        </ul>
        
        <div className="modal-allproductButtonContainer">
            <button  className="modal-AllproductButton">BROWSE ALL PRODUCTS</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductContainer;
