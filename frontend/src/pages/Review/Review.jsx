// import React, { useEffect, useState } from 'react';
// // import miniProd from '../../images/mini-prod.png';
// import { FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { FaArrowRightLong } from "react-icons/fa6";
// import { useSelector } from 'react-redux';
// import style from './Review.module.css';
// const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
// const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
// const Review = () => {

//   const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
//   const [products, setAllProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [expandedProducts, setExpandedProducts] = useState({});
//   const [licenses, setLicenses] = useState({
//     collegiate: false,
//     greek: false,
//   });

//   const [isExpanded, setIsExpanded] = useState(true); // Toggle state

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

//   // restore all selected products locally in product array state
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
//         sizes: getSizeOptions(product), // assume this is a valid function in scope
//         title: consistentTitle,
//         selections: [],
//       };
//       // Add main product and its variants
//       newAllProducts.push(mainProduct, ...extraProducts);
//     });

//     setAllProducts(newAllProducts);


//   }, [selectedProducts]);


//   // Function to get all  sizes of product
//   const getSizeOptions = (product) => {
//     // Case 1: Custom-structured product
//     if (product?.allVariants?.length) {
//       const sizeVariantPairs = product.allVariants.flatMap((variant) => {
//         const sizeOption = variant.selectedOptions.find((opt) => opt.name === 'Size');
//         return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
//       });
//       return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
//     }

//     // Case 2: Shopify-style structure
//     if (product?.variants?.edges?.length) {
//       const sizeVariantPairs = product.variants.edges.flatMap(({ node }) => {
//         const sizeOption = node.selectedOptions.find((opt) => opt.name === 'Size');
//         return sizeOption ? [{ size: sizeOption.value, variantId: node.id }] : [];
//       });
//       return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
//     }

//     return [];
//   };

//   // Function to get all available  sizes of product
//   const getAvailableSizes = (product) => {
//     if (product.sizes && product.sizes.length > 0) {
//       return product.sizes.map(item => item.size);
//     }
//     return product.name?.toLowerCase().includes('women') ? womenSizes : adultSizes;
//   };
//   return (
//     <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>

//       <div className='toolbar-main-heading'>
//         <h5 className='Toolbar-badge'>Review Your Order</h5>
//         <h2>Your Product And Pricing <FaArrowRightLong /> </h2>
//         <h3 className={style.reviewPriceheading}>$30.36 <span className={style.reviewPriceheadingSpan}>$24.56 each</span></h3>
//       </div>

//       <div className={style.toolbarBox}>
//         <p>Summary (10 items)</p>
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
//                     src={product.imgurl}
//                     className={style.productMiniImg}
//                     alt='product'
//                   />
//                 </div>
//                 <div>
//                   <h4>{product.title}</h4>
//                   <div className={style.sizeBoxFlex}>
//                     <p className={style.sizeTagSmallbox}>S-2</p>
//                     <p className={style.sizeTagSmallbox}>M-2</p>
//                     <p className={style.sizeTagSmallbox}>L-4</p>
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
//             {expandedProducts[product.id] && (
//               <div className={style.sizeSection}>
//                 <div className={style.sizeGroup}>
//                   <h5>Women Sizes</h5>
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
//           </div>
//         ))}

//         <button className={style.calculateBtn}>ADD TO CART <FaArrowRightLong /></button>
//         <div className={style.reviewBox}>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Review


import React, { useState, useEffect } from "react";
import styles from "./Review.module.css";
import { LuArrowLeft } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { FaTshirt } from "react-icons/fa";
import { BiTargetLock } from "react-icons/bi";
import { IoIosColorPalette } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuArrowRight } from "react-icons/lu";
const dummyItems = [
  { name: "Jerzees NuBlend® Fleece Sweatshirt", color: "Royal", sizes: { S: 8, YS: 9 }, image: "https://simaxdesigns.imgix.net/uploads/1753094331891_front-design.png" },
  { name: "Jerzees NuBlend® Fleece Sweatshirt", color: "Royal", sizes: { S: 8, YS: 9 }, image: "https://simaxdesigns.imgix.net/uploads/1753094331891_front-design.png" },
  { name: "Jerzees NuBlend® Fleece Sweatshirt", color: "Royal", sizes: { S: 8, YS: 9 }, image: "https://simaxdesigns.imgix.net/uploads/1753094331891_front-design.png" },
];

const randomDiscount = () => Math.floor(Math.random() * 21) + 15; // 15% to 35%

const Review = () => {
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const productState = useSelector((state) => state.productSelection.products);
  console.log("productState.....", productState)

  const reviewItems = Object.entries(productState).map(([id, product]) => {
    const sizes = Object.entries(product.selections).reduce((acc, [size, qty]) => {
      if (qty > 0) acc[size] = qty;
      return acc;
    }, {});

    return {
      name: product.name,
      color: product.color,
      sizes, // { S: 2, M: 3, ... }
      image: product.imgurl
    };
  });

  useEffect(() => {
    setDiscount(randomDiscount());
  }, []);

  const totalItems = reviewItems.reduce((acc, item) => acc + Object.values(item.sizes).reduce((a, b) => a + b, 0), 0);
  const originalPrice = 30.36;
  const discountedPrice = (originalPrice * (1 - discount / 100)).toFixed(2);
  const totalPrice = (totalItems * discountedPrice).toFixed(2);
  const printAreaCount = useSelector((state) => {
    const present = state.TextFrontendDesignSlice.present;

    const areas = ["front", "back", "leftSleeve", "rightSleeve"];

    return areas.reduce((count, area) => {
      const hasContent = present[area].texts.length + present[area].images.length;
      return hasContent + count;
    }, 0);
  });

  const goBack = () => {
    navigate("/quantity")
  }


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <span className={styles.reviewOrder}>REVIEW YOUR ORDER</span>
        <h5 className='Toolbar-badge'>Review Your Order</h5> */}
        <div className='toolbar-main-heading'>
          <h5 className='Toolbar-badge'>Review Your Order</h5>
        </div>
        <div className={styles.titleRow}>
          <div className={styles.arrow} onClick={goBack}><LuArrowLeft /></div>
          <h3>Your Products & Pricing</h3>
          <div className={styles.close} onClick={() => navigate("/design/product")}><RxCross2></RxCross2></div >
        </div>
        <hr />
      </div>
      {/* <h3>Your Products & Pricing</h3> */}
      <div className={styles.priceInfo}>
        <p>
          <span className={styles.strike}>${originalPrice}</span>
          <span className={styles.discounted}> ${discountedPrice} each</span>
        </p>
        <p>
          <span className={styles.strikeSmall}>${(originalPrice * totalItems).toFixed(2)}</span>
          <span className={`${styles.total}`}> <span className={styles.dollarText}>${totalPrice}</span> total with {discount}% off Bulk Discount</span>


        </p>
        <div className={styles.metaInfo}>
          <div><FaTshirt /> {totalItems} items</div>
          <div><BiTargetLock /> {printAreaCount} print area</div>
          <div><IoIosColorPalette /> 1 color</div>
          {/* <div>✅ 100% Satisfaction Guarantee</div> */}
        </div></div>

      <p className={styles.bulkDeal}>
        <b>Buy More & Save:</b> 21 items for<span className={styles.dollarText}>$17.95</span>  ea. <span>|</span> 25 items for <span className={styles.dollarText}>$16.983</span> ea.
      </p>

      <div className={styles.summaryBlock}>
        <p className={styles.summaryTitle}>Summary <span>({totalItems} items)</span></p>
        {reviewItems.map((item, idx) => (
          <div key={idx} className={styles.summaryItem}>
            <img src={item.image} alt={item.name} />
            <div className={styles.itemDetails}>
              <div className={styles.itemHeader}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>${discountedPrice} <span>each</span></p>
              </div>
              <p className={styles.itemSubtitle}>{item.color} | {totalItems} Items</p>
              <div className={styles.sizes}>
                {Object.entries(item.sizes).map(([size, count]) => (
                  <button key={size}>{size}-{count}</button>
                ))}
                <span className={styles.edit} onClick={goBack}>Edit sizes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.extraFees}>
        <p>Collegiate License <span>$39.44</span></p>
      </div>

      <button className={styles.addToCart}>ADD TO CART <LuArrowRight></LuArrowRight></button>
      {/* <p className={styles.payment}>or 4 interest free payments of ~${(totalPrice / 4).toFixed(2)} with</p>
      <div className={styles.paymentIcons}>
        <span>afterpay</span><span>Kl arna.</span><span>sezzle</span><span>affirm</span>
      </div> */}

      <div className={styles.review}>
        <img src="https://www.ninjaprinthouse.com/design/images/chelsea.png" alt="Reviewer" />
        <div>
          <blockquote>
            "This company is amazing! Shipping is super fast and they are competitively priced. We will absolutely use them again."
          </blockquote>
          <p><strong>Chelsea E.</strong> Ordered 35 pieces</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
