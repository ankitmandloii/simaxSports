// // neww
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { getHexFromName } from './../../utils/colorUtils';
// import { toast } from 'react-toastify';
// import style from './CollectionProductPopup.module.css';
// import { useSelector } from 'react-redux';
// import { CrossIcon } from '../../iconsSvg/CustomIcon';
// import ColorWheel from '../../images/color-wheel1.png';
// import ColorSwatchPlaceholder from '../../CommonComponent/ColorSwatchPlaceholder.jsx/ColorSwatchPlaceholder';
// import ProductCard from '../../CommonComponent/ProductComponent/ProductCard';

// const CollectionProductPopup = ({ collectionId, onProductSelect, onClose, setLoading: setParentLoading, setCollectionLoading }) => {
//   // console.log("=----collectionId", collectionId)
//   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   const popupRef = useRef(null);
//   const selectedProducts = useSelector((state) => state?.selectedProducts?.selectedProducts);
//   const collections = useSelector((state) => state.collections.collections) || [];
//   const [products, setProducts] = useState([]);
//   const [selectedVariantImages, setSelectedVariantImages] = useState({});
//   const [selectedColorByProduct, setSelectedColorByProduct] = useState({});
//   const [hoverImage, setHoverImage] = useState({});
//   const [imageLoaded, setImageLoaded] = useState({});
//   const [selectedProductColors, setSelectedProductColors] = useState(null);
//   const [cursor, setCursor] = useState('');
//   const [hasNextPage, setHasNextPage] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [swatchLoaded, setSwatchLoaded] = useState(true);

//   // console.log("------------loadingggg", loading)


//   // const collectionId = 'gid://shopify/Collection/289328496774';
//   // console.log("-------------collections", collections)
//   const defaultCollectionId = collections.length > 0 ? collections[0].id : null;
//   // console.log("-------------defaultCollectionId", defaultCollectionId)

//   const effectiveCollectionId = collectionId || defaultCollectionId;
//   const numericId = effectiveCollectionId?.split('/').pop();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (popupRef.current && !popupRef.current.contains(e.target)) {
//         setSelectedProductColors(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // useEffect(() => {
//   //   resetState();
//   //   fetchProducts();
//   // }, [collectionId,numericId]);
//   useEffect(() => {
//     resetState(); // Clear immediately
//     setLoading(true);
//     setCollectionLoading(true)
//     // Trigger loader immediately
//     fetchProducts(false);
//   }, [collectionId, numericId]);
//   useEffect(() => {
//     if (setParentLoading) {
//       setParentLoading(loading);
//     }
//   }, [loading, setParentLoading]);


//   const resetState = () => {
//     setProducts([]);
//     setCursor('');
//     setHasNextPage(false);
//     setSelectedProductColors(null);
//     setSelectedVariantImages({});
//     setSelectedColorByProduct({});
//     setHoverImage({});
//     setImageLoaded({});
//   };

//   const fetchProducts = useCallback(async (isLoadMore = false) => {
//     setLoading(true)
//     // console.log("---numericId", numericId)
//     if (!effectiveCollectionId) return;
//     // setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}products/collection/${numericId}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ limit: 20, cursor: isLoadMore ? cursor : '' }),
//       });

//       const data = await res.json();
//       setLoading(false);
//       console.log("-----CollectionData", data)
//       const edges = data?.result?.node?.products?.edges || [];
//       const pageInfo = data?.result?.node?.products?.pageInfo;

//       const newProducts = edges.map(({ node }) => {
//         const variants = node.variants.edges.map((v) => v.node);
//         const productID = node.id;
//         const productImages = node.images.edges.map((imgEdge) => imgEdge.node.originalSrc);
//         const handle = node?.handle;
//         const colorMap = {};
//         variants.forEach((variant) => {
//           const color = variant.selectedOptions?.find((opt) => opt.name === 'Color')?.value;

//           const metafield = variant.metafields?.edges?.find(
//             (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
//           );

//           let customImage = '';
//           let swatchImage = '';
//           if (metafield) {
//             try {
//               const parsed = JSON.parse(metafield.node.value);
//               if (Array.isArray(parsed) && parsed[0]?.src) {
//                 customImage = parsed[0].src;
//               }
//               if (Array.isArray(parsed)) {
//                 const colorNameLower = color?.toLowerCase().replace(/\s+/g, '');
//                 swatchImage = parsed.find(img =>
//                   img.includes('_fm') ||
//                   img.toLowerCase().includes(colorNameLower)
//                 ) || parsed[3] || parsed[0] || '';
//               }
//             } catch (e) {
//               console.warn('Failed to parse variant_images metafield:', e);
//             }
//           }

//           if (color && !colorMap[color]) {
//             colorMap[color] = {
//               name: color,
//               swatchImg: swatchImage || variant.image?.originalSrc || '',
//               img: customImage || variant.image?.originalSrc || '',
//               variant, handle: handle
//             };
//           }
//         });

//         return {
//           name: node.title,
//           imgurl: variants[0]?.image?.originalSrc || productImages[0] || '',
//           images: productImages,
//           colors: Object.values(colorMap),
//           allVariants: variants,
//           id: productID,
//           productKey: productID,
//           vendor: node?.vendor,
//           handle: handle


//         };
//       });

//       setProducts((prev) => (isLoadMore ? [...prev, ...newProducts] : newProducts));
//       setCursor(pageInfo?.endCursor || '');
//       setHasNextPage(pageInfo?.hasNextPage || false);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     } finally {
//       setLoading(false);
//       setCollectionLoading(false)
//     }
//   }, [BASE_URL, cursor, effectiveCollectionId, numericId]);

//   const getFirstVariantImage = (product) => product.imgurl || product.images?.[0] || '';

//   const getUniqueColors = (product) => {
//     const colorSet = new Set();
//     product.allVariants.forEach((variant) => {
//       const color = variant.selectedOptions.find((opt) => opt.name === 'Color')?.value;
//       if (color) colorSet.add(color);
//     });
//     return [...colorSet];
//   };

//   const getVariantImageByColor = (product, color) => {
//     const variant = product.allVariants.find((variant) =>
//       variant.selectedOptions.some((opt) => opt.name === 'Color' && opt.value === color)
//     );
//     return variant?.image?.originalSrc || product.images?.[0] || '';
//   };

//   const getColorObjectByName = (product, colorName) => {
//     return product.colors.find((color) => color.name === colorName);
//   };

//   const handleColorClick = (e, product, color) => {
//     e.stopPropagation();
//     const colorObj = getColorObjectByName(product, color);
//     const image = colorObj?.img || getVariantImageByColor(product, color);
//     setSelectedColorByProduct((prev) => ({ ...prev, [product.id]: colorObj }));
//     setSelectedVariantImages((prev) => ({ ...prev, [product.id]: image }));
//   };

//   const handleImageLoad = (productId) => {
//     setImageLoaded((prev) => ({ ...prev, [productId]: true }));
//   };
//   // ---
//   const getSwatchImage = (product, color) => {
//     const variant = product.allVariants.find((variant) =>
//       variant.selectedOptions.some((opt) => opt.name === 'Color' && opt.value === color)
//     );
//     const metafield = variant?.metafields?.edges?.find(
//       (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
//     );
//     let swatchImage = getVariantImageByColor(product, color);
//     if (metafield) {
//       try {
//         const parsed = JSON.parse(metafield.node.value);
//         console.log("---------parseddffffffffffff", parsed);
//         if (Array.isArray(parsed)) {
//           const colorNameLower = color.toLowerCase().replace(/\s+/g, '');
//           swatchImage = parsed.find(img =>
//             img.includes('_fm') ||
//             img.toLowerCase().includes(colorNameLower)
//           ) || parsed[3] || parsed[0] || swatchImage;
//         }
//       } catch (e) {
//         console.warn('Failed to parse variant_images metafield:', e);
//       }
//     }
//     return swatchImage;
//   };
//   // --
//   const renderColorSwatches = (product) =>
//     getUniqueColors(product).map((color, idx) => {
//       const colorObj = getColorObjectByName(product, color);
//       //  const variantImage = colorObj?.variantImg || getVariantImageByColor(product, color);
//       const image = colorObj?.img || getVariantImageByColor(product, color);
//       const isSelected = selectedColorByProduct[product.id]?.name === color;
//       const swatchImage = colorObj?.swatchImg || getSwatchImage(product, color);
//       return (
//         <>
//           {!swatchLoaded ? <ColorSwatchPlaceholder size={30} /> : <img
//             key={`${product.id}-${color}-${idx}`}
//             src={swatchImage}
//             alt={color}
//             title={color}
//             className={`color-swatch ${isSelected ? 'selected' : ''}`}
//             // style={{
//             //   width: 25,
//             //   height: 25,

//             // }}
//             // style={{
//             //   width: 30,
//             //   height: 30,
//             //   borderRadius: '20%',
//             //   cursor: 'pointer',
//             //   margin: 3,
//             //   display: 'inline-block',
//             //   border: isSelected ? '2px solid black' : '1px solid gray',
//             //   objectFit: 'cover'
//             // }}
//             onMouseEnter={() => {
//               if (!selectedColorByProduct[product.id]?.name) {
//                 setHoverImage((prev) => ({ ...prev, [product.id]: image }));
//               }
//             }}
//             onMouseLeave={() => {
//               if (!selectedColorByProduct[product.id]?.name) {
//                 setHoverImage((prev) => ({ ...prev, [product.id]: '' }));
//               }
//             }}
//             onClick={(e) => handleColorClick(e, product, color)}
//             onLoad={() => setSwatchLoaded(true)}
//           />
//           } </>

//       );
//     });

//   const handleAddProduct = (e, product) => {
//     // e.stopPropagation();
//     const selectedColorObj = selectedColorByProduct[product.id];

//     if (!selectedColorObj) {
//       toast.error('Please select a color before adding the product.');
//       return;
//     }

//     const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
//     if (isAlreadySelected) {
//       toast.error('Product already selected.');
//       return;
//     }

//     onProductSelect?.({
//       ...product,
//       selectedColor: selectedColorObj, // Pass the full color object { name, img, variant }
//       productKey: product.id,
//     });
//     onClose?.();
//   };

//   return (
//     <div className={style.productPanel}>
//       {!effectiveCollectionId ? (
//         <div className={style.loaderWrapper}>
//           <div className="loader" />
//           <p>Loading products....</p>
//         </div>
//       ) : loading && products.length === 0 ? (
//         <div className={style.loaderWrapper}>
//           <div className="loader" />
//           <p>Loading products....</p>
//         </div>
//       ) : products.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <>
//           <div className={style.productListCollection}>
//             {products.map((product) => {
//               // Check if the product is already selected
//               const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);

//               return (
//                 <ProductCard
//                   key={product.id} // Use product.id for unique key
//                   product={product}
//                   isExpanded={selectedProductColors === product.id} // Check if the product is expanded
//                   onToggleExpand={() => {
//                     if (isAlreadySelected) {
//                       toast.error('Product already selected.');
//                       return;
//                     }
//                     setSelectedProductColors(selectedProductColors === product.id ? null : product.id);
//                   }}
//                   onAdd={handleAddProduct} // Use your handleAddProduct function
//                   isAlreadySelected={isAlreadySelected}
//                 />
//               );
//             })}


//             {/* {products.map((product) => {

//               const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
//               const displayImage =
//                 selectedVariantImages[product.id] || hoverImage[product.id] || getFirstVariantImage(product);

//               return (
//                 <div
//                   key={product.id}
//                   className={style.modalProduct}
//                   onClick={() => {
//                     if (isAlreadySelected) {
//                       toast.error('Product already selected.');
//                       return;
//                     }
//                     setSelectedProductColors(
//                       selectedProductColors === product.id ? null : product.id
//                     );
//                   }}
//                 >
//                   <div className={style.imgProContainer}>
//                     <div className={style.imageWrapper}>
//                       {!imageLoaded[product.id] && (
//                         <div className={style.imagePlaceholder}>Loading...</div>
//                       )}
//                       <img
//                         src={displayImage}
//                         alt={product.name}
//                         className={`${style.modalProductcolorImg} ${imageLoaded[product.id] ? style.visible : style.hidden}`}
//                         onLoad={() => handleImageLoad(product.id)}
//                       />
//                     </div>
//                   </div>
//                   <p className={style.vendorspan}>{product?.vendor}</p>
//                   <p className={style.collectionProductPara}>{product.name}</p>
//                   <div className={style.modalProductcolorContainer}>
//                     <img
//                       src={ColorWheel}
//                       alt="colors"
//                       className={style.modalProductcolorImg}
//                       style={{ cursor: 'pointer' }}
//                     />
//                     <p>{getUniqueColors(product).length} Colors</p>

//                     {selectedProductColors === product.id && (
//                       <div className={style.colorPopup} ref={popupRef}>
//                         <div className={style.colorPopupHeader}>
//                           <button
//                             className="close-popup-btn"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedProductColors(null);
//                             }}
//                           >
//                             <CrossIcon />
//                           </button>
//                         </div>
//                         <div className="color-swatch-list">{renderColorSwatches(product)}</div>
//                         <div className={style.popupActions}>
//                           <button
//                             className={style.addProductBtnPopup}
//                             onClick={(e) => handleAddProduct(e, product)}
//                             disabled={!selectedColorByProduct[product.id]?.name || isAlreadySelected}
//                           >
//                             {isAlreadySelected ? 'Product Already Added' : 'Add Product'}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })} */}
//           </div>

//           {hasNextPage && (
//             <button
//               className={style.loadMore}
//               onClick={() => fetchProducts(true)}
//               disabled={loading}
//             >
//               {loading ? 'Loading...' : 'Load More'}
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };


// export default CollectionProductPopup;


// ProductCard.jsx remains unchanged as it already passes the prepared product object to the `onAdd` prop from the parent.
// The reusability is achieved by the parent providing an `onAdd` handler that receives the prepared `selectedData`.

// AddProductContainer.jsx remains unchanged as its `handleProductAdd` already matches the expected signature.

// Updated CollectionProductPopup.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getHexFromName } from './../../utils/colorUtils';
import { toast } from 'react-toastify';
import style from './CollectionProductPopup.module.css';
import { useSelector } from 'react-redux';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import ColorWheel from '../../images/color-wheel1.png';
import ColorSwatchPlaceholder from '../../CommonComponent/ColorSwatchPlaceholder.jsx/ColorSwatchPlaceholder';
import ProductCard from '../../CommonComponent/ProductComponent/ProductCard';
import NoProductFound from '../../CommonComponent/NoProductFound/NoProductFound';

const CollectionProductPopup = ({ collectionId, onProductSelect, onClose, setLoading: setParentLoading, setCollectionLoading }) => {
  // console.log("=----collectionId", collectionId)
  console.log("-------onProductSlelect", onProductSelect)
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const popupRef = useRef(null);
  const selectedProducts = useSelector((state) => state?.selectedProducts?.selectedProducts);
  const collections = useSelector((state) => state.collections.collections) || [];
  const [products, setProducts] = useState([]);
  const [selectedVariantImages, setSelectedVariantImages] = useState({});
  const [selectedColorByProduct, setSelectedColorByProduct] = useState({});
  const [hoverImage, setHoverImage] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const [selectedProductColors, setSelectedProductColors] = useState(null);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swatchLoaded, setSwatchLoaded] = useState(true);

  // console.log("------------loadingggg", loading)


  // const collectionId = 'gid://shopify/Collection/289328496774';
  // console.log("-------------collections", collections)
  const defaultCollectionId = collections.length > 0 ? collections[0].id : null;
  // console.log("-------------defaultCollectionId", defaultCollectionId)

  const effectiveCollectionId = collectionId || defaultCollectionId;
  const numericId = effectiveCollectionId?.split('/').pop();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedProductColors(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // useEffect(() => {
  //   resetState();
  //   fetchProducts();
  // }, [collectionId,numericId]);
  useEffect(() => {
    resetState(); // Clear immediately
    setLoading(true);
    setCollectionLoading(true)
    // Trigger loader immediately
    fetchProducts(false);
  }, [collectionId, numericId]);
  useEffect(() => {
    if (setParentLoading) {
      setParentLoading(loading);
    }
  }, [loading, setParentLoading]);


  const resetState = () => {
    setProducts([]);
    setCursor('');
    setHasNextPage(false);
    setSelectedProductColors(null);
    setSelectedVariantImages({});
    setSelectedColorByProduct({});
    setHoverImage({});
    setImageLoaded({});
  };

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    setLoading(true)
    // console.log("---numericId", numericId)
    if (!effectiveCollectionId) return;
    // setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}products/collection/${numericId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 10, cursor: isLoadMore ? cursor : '' }),
      });

      const data = await res.json();
      setLoading(false);
      console.log("-----CollectionData", data)
      const edges = data?.result?.node?.products?.edges || [];
      const pageInfo = data?.result?.node?.products?.pageInfo;

      const newProducts = edges.map(({ node }) => {
        const variants = node.variants.edges.map((v) => v.node);
        const productID = node.id;
        const productImages = node.images.edges.map((imgEdge) => imgEdge.node.originalSrc);
        const handle = node?.handle;
        const colorMap = {};
        variants.forEach((variant) => {
          const color = variant.selectedOptions?.find((opt) => opt.name === 'Color')?.value;

          const metafield = variant.metafields?.edges?.find(
            (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
          );

          let customImage = '';
          let swatchImage = '';
          if (metafield) {
            try {
              const parsed = JSON.parse(metafield.node.value);
              if (Array.isArray(parsed) && parsed[0]?.src) {
                customImage = parsed[0].src;
              }
              if (Array.isArray(parsed)) {
                const colorNameLower = color?.toLowerCase().replace(/\s+/g, '');
                swatchImage = parsed.find(img =>
                  img.includes('_fm') ||
                  img.toLowerCase().includes(colorNameLower)
                ) || parsed[3] || parsed[0] || '';
              }
            } catch (e) {
              console.warn('Failed to parse variant_images metafield:', e);
            }
          }

          if (color && !colorMap[color]) {
            colorMap[color] = {
              name: color,
              swatchImg: swatchImage || variant.image?.originalSrc || '',
              img: customImage || variant.image?.originalSrc || '',
              variant, handle: handle
            };
          }
        });

        return {
          name: node.title,
          imgurl: variants[0]?.image?.originalSrc || productImages[0] || '',
          images: productImages,
          colors: Object.values(colorMap),
          allVariants: variants,
          id: productID,
          productKey: productID,
          vendor: node?.vendor,
          handle: handle


        };
      });
      const filteredProducts = newProducts.filter(product =>
        !selectedProducts.some(selected => selected.id === product.id)
      );

      setProducts((prev) => (isLoadMore ? [...prev, ...filteredProducts] : filteredProducts));

      // setProducts((prev) => (isLoadMore ? [...prev, ...newProducts] : newProducts));
      setCursor(pageInfo?.endCursor || '');
      setHasNextPage(pageInfo?.hasNextPage || false);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setCollectionLoading(false)
    }
  }, [BASE_URL, cursor, effectiveCollectionId, numericId]);

  const getFirstVariantImage = (product) => product.imgurl || product.images?.[0] || '';

  const getUniqueColors = (product) => {
    const colorSet = new Set();
    product.allVariants.forEach((variant) => {
      const color = variant.selectedOptions.find((opt) => opt.name === 'Color')?.value;
      if (color) colorSet.add(color);
    });
    return [...colorSet];
  };

  const getVariantImageByColor = (product, color) => {
    const variant = product.allVariants.find((variant) =>
      variant.selectedOptions.some((opt) => opt.name === 'Color' && opt.value === color)
    );
    return variant?.image?.originalSrc || product.images?.[0] || '';
  };

  const getColorObjectByName = (product, colorName) => {
    return product.colors.find((color) => color.name === colorName);
  };

  const handleColorClick = (e, product, color) => {
    e.stopPropagation();
    const colorObj = getColorObjectByName(product, color);
    const image = colorObj?.img || getVariantImageByColor(product, color);
    setSelectedColorByProduct((prev) => ({ ...prev, [product.id]: colorObj }));
    setSelectedVariantImages((prev) => ({ ...prev, [product.id]: image }));
  };

  const handleImageLoad = (productId) => {
    setImageLoaded((prev) => ({ ...prev, [productId]: true }));
  };
  // ---
  const getSwatchImage = (product, color) => {
    const variant = product.allVariants.find((variant) =>
      variant.selectedOptions.some((opt) => opt.name === 'Color' && opt.value === color)
    );
    const metafield = variant?.metafields?.edges?.find(
      (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
    );
    let swatchImage = getVariantImageByColor(product, color);
    if (metafield) {
      try {
        const parsed = JSON.parse(metafield.node.value);
        console.log("---------parseddffffffffffff", parsed);
        if (Array.isArray(parsed)) {
          const colorNameLower = color.toLowerCase().replace(/\s+/g, '');
          swatchImage = parsed.find(img =>
            img.includes('_fm') ||
            img.toLowerCase().includes(colorNameLower)
          ) || parsed[3] || parsed[0] || swatchImage;
        }
      } catch (e) {
        console.warn('Failed to parse variant_images metafield:', e);
      }
    }
    return swatchImage;
  };
  // --
  const renderColorSwatches = (product) =>
    getUniqueColors(product).map((color, idx) => {
      const colorObj = getColorObjectByName(product, color);
      //  const variantImage = colorObj?.variantImg || getVariantImageByColor(product, color);
      const image = colorObj?.img || getVariantImageByColor(product, color);
      const isSelected = selectedColorByProduct[product.id]?.name === color;
      const swatchImage = colorObj?.swatchImg || getSwatchImage(product, color);
      return (
        <>
          {!swatchLoaded ? <ColorSwatchPlaceholder size={30} /> : <img
            key={`${product.id}-${color}-${idx}`}
            src={swatchImage}
            alt={color}
            title={color}
            className={`color-swatch ${isSelected ? 'selected' : ''}`}
            // style={{
            //   width: 25,
            //   height: 25,

            // }}
            // style={{
            //   width: 30,
            //   height: 30,
            //   borderRadius: '20%',
            //   cursor: 'pointer',
            //   margin: 3,
            //   display: 'inline-block',
            //   border: isSelected ? '2px solid black' : '1px solid gray',
            //   objectFit: 'cover'
            // }}
            onMouseEnter={() => {
              if (!selectedColorByProduct[product.id]?.name) {
                setHoverImage((prev) => ({ ...prev, [product.id]: image }));
              }
            }}
            onMouseLeave={() => {
              if (!selectedColorByProduct[product.id]?.name) {
                setHoverImage((prev) => ({ ...prev, [product.id]: '' }));
              }
            }}
            onClick={(e) => handleColorClick(e, product, color)}
            onLoad={() => setSwatchLoaded(true)}
          />
          } </>

      );
    });

  // Updated handler to match the signature expected by ProductCard's onAdd prop
  // It receives the prepared `selectedData` object (which includes product and selectedColor details)
  // All validation (selectedColor, isAlreadySelected) is handled in ProductCard, so no redundant checks here
  const handleProductAdd = (selectedData) => {
    // Optional: Additional parent-level logic can be added here if needed
    // For example, if (!selectedData.selectedColor) { toast.error('Please select a color before adding the product.'); return; }
    // But since ProductCard disables the button and skips the call, it's unnecessary

    onProductSelect?.(selectedData);
    onClose?.();
  };

  // Updated toggle handler: Remove redundant isAlreadySelected check (handled in ProductCard)
  const handleToggleExpand = (productKey) => {
    setSelectedProductColors(prev => prev === productKey ? null : productKey);
  };

  return (
    <div className={style.productPanel}>
      {!effectiveCollectionId ? (
        <div className={style.loaderWrapper}>
          <div className="loader" />
          <p>Loading products....</p>
        </div>
      ) : loading && products.length === 0 ? (
        <div className={style.loaderWrapper}>
          <div className="loader" />
          <p>Loading products....</p>
        </div>
      ) : products.length === 0 ? (
        // <p>No products found.</p>
        <NoProductFound />
      ) : (
        <>
          <div className={style.productListCollection}>
            {products.map((product) => {
              // Check if the product is already selected
              const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);

              return (
                <ProductCard
                  key={product.id} // Use product.id for unique key
                  product={product}
                  isExpanded={selectedProductColors === product.id} // Check if the product is expanded
                  onToggleExpand={handleToggleExpand}
                  onAdd={handleProductAdd}
                  isAlreadySelected={isAlreadySelected}
                />
              );
            })}


            {/* {products.map((product) => {

              const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
              const displayImage =
                selectedVariantImages[product.id] || hoverImage[product.id] || getFirstVariantImage(product);

              return (
                <div
                  key={product.id}
                  className={style.modalProduct}
                  onClick={() => {
                    if (isAlreadySelected) {
                      toast.error('Product already selected.');
                      return;
                    }
                    setSelectedProductColors(
                      selectedProductColors === product.id ? null : product.id
                    );
                  }}
                >
                  <div className={style.imgProContainer}>
                    <div className={style.imageWrapper}>
                      {!imageLoaded[product.id] && (
                        <div className={style.imagePlaceholder}>Loading...</div>
                      )}
                      <img
                        src={displayImage}
                        alt={product.name}
                        className={`${style.modalProductcolorImg} ${imageLoaded[product.id] ? style.visible : style.hidden}`}
                        onLoad={() => handleImageLoad(product.id)}
                      />
                    </div>
                  </div>
                  <p className={style.vendorspan}>{product?.vendor}</p>
                  <p className={style.collectionProductPara}>{product.name}</p>
                  <div className={style.modalProductcolorContainer}>
                    <img
                      src={ColorWheel}
                      alt="colors"
                      className={style.modalProductcolorImg}
                      style={{ cursor: 'pointer' }}
                    />
                    <p>{getUniqueColors(product).length} Colors</p>

                    {selectedProductColors === product.id && (
                      <div className={style.colorPopup} ref={popupRef}>
                        <div className={style.colorPopupHeader}>
                          <button
                            className="close-popup-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductColors(null);
                            }}
                          >
                            <CrossIcon />
                          </button>
                        </div>
                        <div className="color-swatch-list">{renderColorSwatches(product)}</div>
                        <div className={style.popupActions}>
                          <button
                            className={style.addProductBtnPopup}
                            onClick={(e) => handleAddProduct(e, product)}
                            disabled={!selectedColorByProduct[product.id]?.name || isAlreadySelected}
                          >
                            {isAlreadySelected ? 'Product Already Added' : 'Add Product'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })} */}
          </div>

          {hasNextPage && (
            <button
              className={style.loadMore}
              onClick={() => fetchProducts(true)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </>
      )}
    </div>
  );
};


export default CollectionProductPopup;