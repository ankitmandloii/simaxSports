// import React, { useEffect, useState } from 'react';
// import miniProd from '../../images/mini-prod.png';
// import style from './QuantityToolbar.module.css';
// import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { useSelector } from 'react-redux';

// const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
// const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

// const QuantityToolbar = () => {

//   const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
//   const [products, setAllProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [expandedProducts, setExpandedProducts] = useState({});
//   const [licenses, setLicenses] = useState({
//     collegiate: false,
//     greek: false,
//   });

//   const handleQuantityChange = (category, size, value) => {
//     const key = `${category}-${size}`;
//     setQuantities(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const toggleProductExpansion = (productId) => {
//     setExpandedProducts(prev => ({
//       ...prev,
//       [productId]: !prev[productId]
//     }));
//   };

//   useEffect(() => {
//     if (!selectedProducts || selectedProducts.length === 0) return;

//     const newAllProducts = [];

//     selectedProducts.forEach((product) => {
//       const addedColors = product.addedColors || [];
//       const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

//       const extraProducts = addedColors.map((variantProduct) => ({
//         id: variantProduct?.variant?.id?.split("/")?.reverse()[0],
//         imgurl: variantProduct?.img,
//         color: variantProduct?.name,
//         size: variantProduct?.variant?.selectedOptions[1]?.value,
//         sizes: variantProduct?.sizes,
//         name: product?.name,
//         title: consistentTitle,
//         selections: [],
//       }));

//       const mainProduct = {
//         name: product.name || product.title,
//         id: product.id.split("/").reverse()[0],
//         imgurl: product?.imgurl,
//         color: product?.selectedColor?.name,
//         size: product.selectedColor?.variant?.selectedOptions[1]?.value,
//         sizes: getSizeOptions(product),
//         title: consistentTitle,
//         selections: [],
//       };

//       newAllProducts.push(mainProduct, ...extraProducts);
//     });

//     setAllProducts(newAllProducts);

//   }, [selectedProducts]);

//   const getSizeOptions = (product) => {
//     if (product?.allVariants?.length) {
//       const sizeVariantPairs = product.allVariants.flatMap((variant) => {
//         const sizeOption = variant.selectedOptions.find((opt) => opt.name === 'Size');
//         return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
//       });
//       return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
//     }

//     if (product?.variants?.edges?.length) {
//       const sizeVariantPairs = product.variants.edges.flatMap(({ node }) => {
//         const sizeOption = node.selectedOptions.find((opt) => opt.name === 'Size');
//         return sizeOption ? [{ size: sizeOption.value, variantId: node.id }] : [];
//       });
//       return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
//     }

//     return [];
//   };

//   const getAvailableSizes = (product) => {
//     console.log("product is quantity", product)
//     if (product.sizes && product.sizes.length > 0) {
//       return product.sizes.map(item => item.size);
//     }
//     return product.name?.toLowerCase().includes('women') ? womenSizes : adultSizes;
//   };

//   // New helper function to sum quantities per product
//   const getTotalQuantityForProduct = (product) => {
//     const sizes = getAvailableSizes(product);
//     return sizes.reduce((total, size) => {
//       const key = `${product.id}-${size}`;
//       const quantity = parseInt(quantities[key]) || 0;
//       return total + quantity;
//     }, 0);
//   };

//   return (
//     <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>

//       <div className='toolbar-main-heading'>
//         <h5 className='Toolbar-badge'>Quantity And Sizes</h5>
//         <h2>How Many Do You Need?</h2>
//         <p>Enter quantities to calculate the price. Save money by increasing quantity and reducing ink colors in your design.</p>
//       </div>

//       <div className={style.toolbarBox}>

//         {products.map((product) => (
//           <div key={product.id} className="main-top-container">
//             <div className="toolbar-box-top-content">
//               <div
//                 className={style.quantityToolbarHead}
//                 onClick={() => toggleProductExpansion(product.id)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <div className={style.downArrow}>
//                   {expandedProducts[product.id] ? <FaChevronDown /> : <FaChevronRight />}
//                 </div>
//                 <div className={style.miniProdImgContainer}>
//                   <img
//                     src={product.imgurl || miniProd}
//                     className={style.productMiniImg}
//                     alt='product'
//                   />
//                 </div>
//                 <div className={style.rightProductQtyTitle}>
//                   <h4>{product.title}</h4>
//                   <div className={style.rightProductTitleQty}>
//                     {product.color && <p className={style.toolbarSpan}>{product.color}</p>}
//                     <p className={style.totalQtyitems}>{getTotalQuantityForProduct(product)} items</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {expandedProducts[product.id] && (
//               <div className={style.sizeSection}>
//                 <div className={style.sizeGroup}>
//                   <h5>Available Sizes</h5>
//                   <div className={style.sizeInputs}>
//                     {getAvailableSizes(product).map(size => (
//                       <div className={style.sizeBox} key={`${product.id}-${size}`}>
//                         <label>{size}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={quantities[`${product.id}-${size}`] || ''}
//                           onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//             {/* {expandedProducts[product.id] && (
//               <div className={style.sizeSection}>
//                 <div className={style.sizeGroup}>
//                   <h5>Available Sizes</h5>
//                   <div className={style.sizeInputs}>
//                     {getAvailableSizes(product).map(size => (
//                       <div className={style.sizeBox} key={`${product.id}-${size}`}>
//                         <label>{size}</label>
//                         <input
//                           type="number"
//                           min="0"
//                           value={quantities[`${product.id}-${size}`] || ''}
//                           onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )} */}
//           </div>
//         ))}
//         <div className={style.licenseOptions}>
//           <label>
//             <input
//               type="checkbox"
//               style={{ marginRight: "5px" }}
//               checked={licenses.collegiate}
//               onChange={() => setLicenses(prev => ({ ...prev, collegiate: !prev.collegiate }))}
//             />
//             Collegiate License (Has college name in design)
//           </label>
//           {/* <label>
//             <input
//               type="checkbox"
//               style={{ marginRight: "5px" }}
//               checked={licenses.greek}
//               onChange={() => setLicenses(prev => ({ ...prev, greek: !prev.greek }))}
//             />
//             Greek License (Has greek organization in design)
//           </label> */}
//         </div>
//         <button className={style.calculateBtn}>CALCULATE PRICING</button>
//       </div>
//     </div>
//   );
// };

// export default QuantityToolbar;
import React, { useEffect, useState } from 'react';
import miniProd from '../../images/mini-prod.png';
import style from './QuantityToolbar.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct,
  updateSizeQuantity
} from '../../../redux/productSelectionSlice/productSelectionSlice.js';
import { useNavigate } from 'react-router-dom';

const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const QuantityToolbar = () => {
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const productState = useSelector((state) => state.productSelection.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setAllProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [licenses, setLicenses] = useState({
    collegiate: false,
    greek: false,
  });

  const handleQuantityChange = (productId, size, value) => {
    dispatch(updateSizeQuantity({
      productId,
      size,
      quantity: parseInt(value) || 0
    }));
  };

  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const newAllProducts = [];

    selectedProducts.forEach((product) => {
      const addedColors = product.addedColors || [];
      const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

      const extraProducts = addedColors.map((variantProduct) => {
        const prod = {
          id: variantProduct?.variant?.id?.split("/").reverse()[0],
          imgurl: variantProduct?.img,
          color: variantProduct?.name,
          size: variantProduct?.variant?.selectedOptions[1]?.value,
          sizes: variantProduct?.sizes,
          name: product?.name,
          title: consistentTitle,
          selections: [],
        };
        dispatch(addProduct(prod));
        return prod;
      });

      const mainProduct = {
        name: product.name || product.title,
        id: product.id.split("/").reverse()[0],
        imgurl: product?.imgurl,
        color: product?.selectedColor?.name,
        size: product.selectedColor?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(product),
        title: consistentTitle,
        selections: [],
      };

      dispatch(addProduct(mainProduct));
      newAllProducts.push(mainProduct, ...extraProducts);
    });

    setAllProducts(newAllProducts);
  }, [selectedProducts]);

  const getSizeOptions = (product) => {
    if (product?.allVariants?.length) {
      const sizeVariantPairs = product.allVariants.flatMap((variant) => {
        const sizeOption = variant.selectedOptions.find((opt) => opt.name === 'Size');
        return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
      });
      return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
    }

    if (product?.variants?.edges?.length) {
      const sizeVariantPairs = product.variants.edges.flatMap(({ node }) => {
        const sizeOption = node.selectedOptions.find((opt) => opt.name === 'Size');
        return sizeOption ? [{ size: sizeOption.value, variantId: node.id }] : [];
      });
      return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
    }

    return [];
  };

  const getAvailableSizes = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.map(item => item.size);
    }
    return product.name?.toLowerCase().includes('women') ? womenSizes : adultSizes;
  };

  const getTotalQuantityForProduct = (product) => {
    if (!productState[product.id]) return 0;
    return Object.values(productState[product.id].selections).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Quantity And Sizes</h5>
        <h2>How Many Do You Need?</h2>
        <p>Enter quantities to calculate the price. Save money by increasing quantity and reducing ink colors in your design.</p>
      </div>

      <div className={style.toolbarBox}>
        {products.map((product) => (
          <div key={product.id} className="main-top-container">
            <div className="toolbar-box-top-content">
              <div
                className={style.quantityToolbarHead}
                onClick={() => toggleProductExpansion(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={style.downArrow}>
                  {expandedProducts[product.id] ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                <div className={style.miniProdImgContainer}>
                  <img
                    src={product.imgurl || miniProd}
                    className={style.productMiniImg}
                    alt='product'
                  />
                </div>
                <div className={style.rightProductQtyTitle}>
                  <h4>{product.title}</h4>
                  <div className={style.rightProductTitleQty}>
                    {product.color && <p className={style.toolbarSpan}>{product.color}</p>}
                    <p className={style.totalQtyitems}>{getTotalQuantityForProduct(product)} items</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedProducts[product.id] && (
              <div className={style.sizeSection}>
                <div className={style.sizeGroup}>
                  <h5>Available Sizes</h5>
                  <div className={style.sizeInputs}>
                    {getAvailableSizes(product).map(size => (
                      <div className={style.sizeBox} key={`${product.id}-${size}`}>
                        <label>{size}</label>
                        <input
                          type="number"
                          min="0"
                          value={productState[product.id]?.selections?.[size] || ''}
                          onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className={style.licenseOptions}>
          <label>
            <input
              type="checkbox"
              style={{ marginRight: "5px" }}
              checked={licenses.collegiate}
              onChange={() => setLicenses(prev => ({ ...prev, collegiate: !prev.collegiate }))}
            />
            Collegiate License (Has college name in design)
          </label>
        </div>

        <button className={style.calculateBtn} onClick={() => navigate("/review")}>CALCULATE PRICING</button>
      </div>
    </div>
  );
};

export default QuantityToolbar;
