
// import AddProductContainer from '../../addProductContainer/AddProductContainer';
// const ProductToolbar = () => {
//   const [changeProductPopup,setchangeProductPopup]=useState(false);
//   const [addColorPopup,setaddColorPopup]=useState(false);
//   const [chngColorPopup,setChangeColorPopup]=useState(false);
//   const changeProductPopupHandler=()=>{
//     setchangeProductPopup(!changeProductPopup);
//   }
//   const addColorPopupHAndler=()=>{
//     setaddColorPopup(!addColorPopup);
//   }
//   const Onclose=()=>{
//     setchangeProductPopup(false);
//   }
//   const chngColorPopupHandler=()=>{
//     setChangeColorPopup(!chngColorPopup);
//   }
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <div className="toolbar-main-container product-toolbar">
//        {/* <AddProductContainer
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         products={products}
//       /> */}
// <div className='toolbar-main-heading'>
//   <h5 className='Toolbar-badge'>Product</h5>
//   <h2 >Manage Your Products</h2>
//   <p>You can select multiple products and colors</p>
// </div>
// <div className="toolbar-box">
//   <div className="toolbar-box-top-content">
//   <div className="toolbar-head">
//     <div className="mini-prod-img-container">
//     <img src={miniProd} className='product-mini-img'/>

//     </div>
//     <div >
//  <h4>Essential red tshirt for men and women</h4>
//  <button className='toolbar-span' onClick={chngColorPopupHandler}>Change</button>
//  {chngColorPopup && <ChooseColorBox title="Choose Color" chngColorPopupHandler={chngColorPopupHandler}/>}
//     </div>
//   </div>
//   <div className='toolbar-middle-button '>
//     <button className='black-button' onClick={changeProductPopupHandler}>Change Product</button>
//     <div className="add-color-btn-main-container">
//     <div className='addCart-button' onClick={addColorPopupHAndler}>
//       <img src={colorwheel} alt="image" className='color-img'/>
//        <p >Add Color</p>
//     </div>
//     {addColorPopup &&  <ChooseColorBox addColorPopupHAndler={addColorPopupHAndler} title="Add another color"/>}

//     </div>

//   </div>
//   </div>

//   <button className='add-product-btn' onClick={()=>setShowModal(true)}> <IoAdd/> Add Products</button>
//   <p className='center'>Customize Method Example</p>

//   <div className='no-minimum-butn-container'>
//   <div className='common-btn active'>
//     <h4>Printing</h4>
//     <p>No minimum</p>
//   </div>
//   <div className='common-btn'>
//     <h4>Ebbroidery</h4>
//     <p>No minimum</p>

//   </div>
//   </div>

// </div>
// {changeProductPopup && <ChangePopup onClose={Onclose}/>}
//     </div>



//   )
// }
import React, { useState } from 'react';
import './ProductToolbar.css';
import { IoAdd } from 'react-icons/io5';
import colorwheel from '../../images/color-wheel.png';
import ChangePopup from '../../PopupComponent/ChangeProductPopup/ChangePopup';
import ChooseColorBox from '../../CommonComponent/ChooseColorBox/ChooseColorBox';
import { CrossIcon } from '../../iconsSvg/CustomIcon';

const ProductToolbar = () => {
  const [changeProductPopup, setChangeProductPopup] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);

  // For individual popups
  const [colorPopupIndex, setColorPopupIndex] = useState(null);
  const [changeColorPopupIndex, setChangeColorPopupIndex] = useState(null);

  const openChangeProductPopup = (isAdd = false, index = null) => {
    setIsAddingProduct(isAdd);
    setEditingProductIndex(index);
    setChangeProductPopup(true);
  };

  const handleProductSelect = (product) => {
    if (isAddingProduct) {
      setSelectedProducts((prev) => [...prev, product]);
    } else if (editingProductIndex !== null) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[editingProductIndex] = product;
      setSelectedProducts(updatedProducts);
    }
    setChangeProductPopup(false);
  };

  const handleDeleteProduct = (indexToDelete) => {
    setSelectedProducts((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  return (
    <div className="toolbar-main-container product-toolbar">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Product</h5>
        <h2>Manage Your Products</h2>
        <p>You can select multiple products and colors</p>
      </div>

      <div className="toolbar-box">
        {selectedProducts.map((product, index) => (
          <div className="toolbar-product-head" key={index}>
            <div className="toolbar-head">
              <div className="mini-prod-img-container">
                <img src={product.thumbnail} className="product-mini-img" alt="product" />
              </div>
              <div>
                <h4>{product.title}</h4>
                <button
                  className="toolbar-span"
                  onClick={() =>
                    setChangeColorPopupIndex((prev) => (prev === index ? null : index))
                  }
                >
                  Change
                </button>
                {changeColorPopupIndex === index && (
                  <ChooseColorBox
                    title="Choose Color"
                    chngColorPopupHandler={() => setChangeColorPopupIndex(null)}
                  />
                )}
              </div>
              <span
                className="crossProdICon"
                onClick={() => handleDeleteProduct(index)}
                style={{ cursor: 'pointer' }}
              >
                <CrossIcon />
              </span>
            </div>

            <div className="toolbar-middle-button">
              <button className="black-button" onClick={() => openChangeProductPopup(false, index)}>
                Change Product
              </button>

              <div className="add-color-btn-main-container">
                <div
                  className="addCart-button"
                  onClick={() => setColorPopupIndex((prev) => (prev === index ? null : index))}
                >
                  <img src={colorwheel} alt="color wheel" className="color-img" />
                  <p>Add Color</p>
                </div>
                {colorPopupIndex === index && (
                  <ChooseColorBox
                    addColorPopupHAndler={() => setColorPopupIndex(null)}
                    title="Add another color"
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        <button className="add-product-btn" onClick={() => openChangeProductPopup(true)}>
          <IoAdd /> Add Products
        </button>

        <p className="center">Customize Method Example</p>

        <div className="no-minimum-butn-container">
          <div className="common-btn active">
            <h4>Printing</h4>
            <p>No minimum</p>
          </div>
    
        </div>
      </div>

      {changeProductPopup && (
        <ChangePopup
          onClose={() => setChangeProductPopup(false)}
          onProductSelect={handleProductSelect}
        />
      )}
    </div>
  );
};

export default ProductToolbar;
