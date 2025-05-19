
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
import AddProductContainer from '../../PopupComponent/addProductContainer/AddProductContainer';
import ProductAvailableColor from '../../PopupComponent/ProductAvailableColor/ProductAvailableColor';

const ProductToolbar = () => {
  const [changeProductPopup, setChangeProductPopup] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [addProduct, setAddProduct] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });
  const [colorChangeTarget, setColorChangeTarget] = useState({ productIndex: null, colorIndex: null });

  const openChangeProductPopup = (isAdd = false, index = null) => {
    setIsAddingProduct(isAdd);
    setEditingProductIndex(index);
    setChangeProductPopup(true);
  };

  const addProductPopup = () => {
    setIsAddingProduct(true);
    setEditingProductIndex(null);
    setAddProduct(true);
  };

  const handleProductSelect = (product, selectedColor = null) => {
    console.log("product changee", product)
    const updatedProduct = {
      ...product,
      selectedColor: selectedColor || product.selectedColor || product.colors?.[0],
      imgurl: product?.selectedImage || selectedColor?.img || product.imgurl || product.selectedColor?.img,
    };

    if (isAddingProduct) {
      setSelectedProducts((prev) => [...prev, updatedProduct]);
    } else if (editingProductIndex !== null) {
      setSelectedProducts((prev) => {
        const updated = [...prev];
        updated[editingProductIndex] = updatedProduct;
        return updated;
      });
    }

    // Reset state
    setChangeProductPopup(false);
    setEditingProductIndex(null);
    setIsAddingProduct(false);
    setAddProduct(false);
  };

  const handleDeleteProduct = (indexToDelete) => {
    setSelectedProducts((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };
  const normalizeColorsFromShopify = (product) => {
    if (!product?.variants?.edges) return [];

    const colorMap = new Map();

    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
      if (colorOption && !colorMap.has(colorOption.value)) {
        colorMap.set(colorOption.value, {
          name: colorOption.value,
          img: node.image?.originalSrc || '',
        });
      }
    });

    return Array.from(colorMap.values());
  };

  const getAvailableColorsForProduct = (product) => {
    if (!product) return [];

    // Step 1: get full color list from either product.colors or Shopify variants
    const allColors = product.colors?.length
      ? product.colors
      : normalizeColorsFromShopify(product);

    if (!allColors.length) return [];

    // Step 2: build a set of already selected or added color names
    const selectedColorNames = new Set([
      product.selectedColor?.name,
      ...(product.addedColors?.map(c => c.name) || []),
    ]);

    // Step 3: return only colors that are not yet selected/added
    return allColors.filter(color => !selectedColorNames.has(color.name));
  };





  const handleDeleteColorThumbnail = (productIndex, colorIndex) => {
    const product = selectedProducts[productIndex];
    const totalThumbnails = 1 + (product.addedColors?.length || 0);

    // If there's only one thumbnail, delete the whole product
    if (totalThumbnails === 1) {
      handleDeleteProduct(productIndex);
      return;
    }

    // Prevent deletion of main image (optional)
    if (colorIndex === 0) return;

    setSelectedProducts((prev) => {
      const updated = [...prev];
      const currentProduct = { ...updated[productIndex] };

      const newAddedColors = currentProduct.addedColors?.filter((_, i) => i !== colorIndex - 1) || [];
      currentProduct.addedColors = newAddedColors;

      updated[productIndex] = currentProduct;
      return updated;
    });

    setActiveThumbnail({ productIndex: null, colorIndex: null });
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
              <div className="toolbar-product-title-head">
                <h4>{product?.name || product?.title}</h4>
              </div>

              <div className="product-toolbar-image-with-btn">
                {[
                  {
                    img: product?.imgurl || product?.selectedImage,
                    name: product?.selectedColor?.name || product?.name,
                  },
                  ...(product?.addedColors || []),
                ].map((color, i) => (
                  <div
                    key={i}
                    className="mini-prod-img-container"
                    onClick={() =>
                      setActiveThumbnail((prev) =>
                        prev.productIndex === index && prev.colorIndex === i
                          ? { productIndex: null, colorIndex: null }
                          : { productIndex: index, colorIndex: i }
                      )
                    }
                  >
                    {activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i && (
                      <div className="thumbnail-actions">
                        <span
                          className="crossProdIConofSingleProduct"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteColorThumbnail(index, i);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <CrossIcon />
                        </span>

                        <button
                          className="toolbar-span"
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorChangeTarget({ productIndex: index, colorIndex: i });
                          }}
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <div className='img-thumbnaill-container'>
                      <img
                        src={color.img}
                        className="product-mini-img"
                        alt={color.name}
                        title={color.name}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* <span
                className="crossProdICon"
                onClick={() => handleDeleteProduct(index)}
                style={{ cursor: 'pointer' }}
              >
                <CrossIcon />
              </span> */}

              <div className="toolbar-middle-button">
                <button className="black-button" onClick={() => openChangeProductPopup(false, index)}>
                  Change Product
                </button>

                <div className="add-color-btn-main-container">
                  <div
                    className="addCart-button"
                    onClick={() => setColorChangeTarget({ productIndex: index, colorIndex: -1 })}
                  >
                    <img src={colorwheel} alt="color wheel" className="color-img" />
                    <p>Add Color</p>
                  </div>

                  {colorChangeTarget.productIndex === index && (
                    <ProductAvailableColor
                      product={selectedProducts[index]}
                      availableColors={getAvailableColorsForProduct(selectedProducts[index])}
                      onClose={() => setColorChangeTarget({ productIndex: null, colorIndex: null })}
                      onAddColor={(product, color) => {
                        const { productIndex, colorIndex } = colorChangeTarget;

                        setSelectedProducts((prev) => {
                          const updated = [...prev];
                          const current = { ...updated[productIndex] };

                          const newColor = {
                            name: color.name,
                            img: color.img,
                          };

                          if (colorIndex === 0) {
                            current.selectedColor = newColor;
                            current.imgurl = newColor.img;
                          } else if (colorIndex > 0) {
                            const newAddedColors = [...(current.addedColors || [])];
                            newAddedColors[colorIndex - 1] = newColor;
                            current.addedColors = newAddedColors;
                          } else {
                            const alreadyExists = current.addedColors?.some(c => c.name === newColor.name);
                            if (!alreadyExists) {
                              current.addedColors = [...(current.addedColors || []), newColor];
                            }
                          }

                          updated[productIndex] = current;
                          return updated;
                        });

                        setColorChangeTarget({ productIndex: null, colorIndex: null });
                      }}
                    />
                  )}

                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="add-product-btn" onClick={() => addProductPopup()}>
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

      {addProduct && (
        <AddProductContainer
          isOpen={addProduct}
          onClose={() => setAddProduct(false)}
          onProductSelect={handleProductSelect}
        />
      )}
    </div>
  );
};

export default ProductToolbar;
