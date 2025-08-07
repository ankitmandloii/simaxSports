// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import styles from './AddProductContainer.module.css';
// import colorwheel1 from "../../images/color-wheel1.png";
// import { CrossIcon } from "../../iconsSvg/CustomIcon";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddProductContainer = ({ isOpen, onClose, onProductSelect, openChangeProductPopup }) => {
//   const { list: rawProducts, loading, error } = useSelector((state) => state.products);
//   const selectedProduct = useSelector((state) => state.selectedProducts.selectedProducts);

//   const [products, setProducts] = useState([]);
//   const [productStates, setProductStates] = useState({});
//   const [imageLoadStates, setImageLoadStates] = useState({});

//   useEffect(() => {
//     if (rawProducts.length > 0) {
//       const productsWithKeys = rawProducts.map((product) => ({
//         ...product,
//         productKey: product.id || uuidv4(),
//       }));
//       setProducts(productsWithKeys);

//       const initialStates = Object.fromEntries(
//         productsWithKeys.map((p) => [
//           p.productKey,
//           { isPopupOpen: false, selectedColor: null, hoverImage: null },
//         ])
//       );
//       setProductStates(initialStates);
//     }
//   }, [rawProducts]);

//   useEffect(() => {
//     Object.entries(productStates).forEach(([productKey, state]) => {
//       const product = products.find((p) => p.productKey === productKey);
//       if (state.isPopupOpen && product?.colors?.length > 0) {
//         product.colors.slice(0, 3).forEach((color) => {
//           const img = new Image();
//           img.src = color.img;
//         });
//       }
//     });
//   }, [productStates, products]);

//   const updateProductState = (productKey, newState) => {
//     setProductStates((prev) => ({
//       ...prev,
//       [productKey]: {
//         ...prev[productKey],
//         ...newState,
//       },
//     }));
//   };

//   const handleImageLoad = (productKey) => {
//     setImageLoadStates((prev) => ({
//       ...prev,
//       [productKey]: true,
//     }));
//   };

//   const toggleColorPopup = (e, productKey, product) => {
//     e.stopPropagation();
//     const isAlreadySelected = selectedProduct.some(p => p.id === product.id);
//     if (isAlreadySelected) {
//       toast.error("Product already selected");
//       return;
//     }

//     setProductStates((prev) =>
//       Object.fromEntries(
//         Object.entries(prev).map(([key, state]) => [
//           key,
//           {
//             ...state,
//             isPopupOpen: key === productKey ? !state.isPopupOpen : false,
//             hoverImage: null,
//           },
//         ])
//       )
//     );
//   };

//   const handleColorSelect = (e, productKey, color) => {
//     e.stopPropagation();
//     updateProductState(productKey, { selectedColor: color, hoverImage: color.img });
//   };

//   const handleAddProduct = (e, product, productKey) => {
//     e.stopPropagation();
//     const state = productStates[productKey];
//     if (!state.selectedColor) return;

//     onProductSelect({ ...product, selectedColor: state.selectedColor });

//     updateProductState(productKey, {
//       isPopupOpen: false,
//       hoverImage: null,
//       selectedColor: null,
//     });

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <div className={styles.modalHeader}>
//           <h3>Add Product</h3>
//           <button onClick={onClose} className={styles.modalClose}>&times;</button>
//         </div>
//         <hr />
//         <p>Select From Our Most Popular Products</p>

//         {loading && products.length === 0 && <div className="loader" />}
//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <ul className={styles.productList}>
//           {products.map((product) => {
//             const { productKey, name, colors = [], imgurl } = product;
//             const state = productStates[productKey] || {};
//             const displayImage = state.selectedColor?.img || state.hoverImage || imgurl;
//             const imageLoaded = imageLoadStates[productKey];
//             const isAlreadySelected = selectedProduct.some((p) => p.id === product.id);

//             return (
//               <li key={productKey} className={styles.modalProduct}>
//                 <div className={styles.productMain} onClick={(e) => toggleColorPopup(e, productKey, product)}>
//                   <div className={styles.imageWrapper}>
//                     {!imageLoaded && <div className={styles.imagePlaceholder}></div>}
//                     <img
//                       src={displayImage}
//                       alt={name}
//                       loading="lazy"
//                       className={`${styles.modalProductImg} ${imageLoaded ? styles.visible : styles.hidden}`}
//                       onLoad={() => handleImageLoad(productKey)}
//                     />
//                   </div>
//                   <p className={styles.addProductPara}>{name}</p>
//                 </div>

//                 {colors.length > 0 && (
//                   <div
//                     className={styles.modalProductColorContainer}
//                     onClick={(e) => toggleColorPopup(e, productKey, product)}
//                   >
//                     <img src={colorwheel1} alt="colors" className={styles.modalProductColorImg} />
//                     <p>{colors.length} Colors</p>

//                     {state.isPopupOpen && (
//                       <div className={styles.colorPopup}>
//                         <div className={styles.colorPopupHeader}>
//                           <button
//                             className={styles.closePopupBtn}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateProductState(productKey, { isPopupOpen: false, hoverImage: null });
//                             }}
//                           >
//                             <CrossIcon />
//                           </button>
//                         </div>

//                         <div className="color-swatch-list">
//                           {colors.map((color) => {
//                             const isSelected = state.selectedColor?.name === color.name;
//                             // Parse the variant_images from metafields
//                             const variantImages = color.variant?.metafields?.edges?.find(
//                               edge => edge.node.key === "variant_images"
//                             )?.node.value;
//                             const swatchImage = variantImages ? JSON.parse(variantImages)[3] : color.img;

//                             return (
//                               <img
//                                 key={`${productKey}-${color.name}`}
//                                 src={swatchImage}
//                                 alt={color.name}
//                                 title={color.name}
//                                 className={`color-swatch ${isSelected ? "selected" : ""}`}
//                                 style={{
//                                   width: 30, // Match the size of the original span
//                                   height: 30,
//                                   borderRadius: "20%",
//                                   cursor: "pointer",
//                                   margin: 5,
//                                   display: "inline-block",
//                                   border: isSelected ? "2px solid black" : "1px solid gray",
//                                   objectFit: "cover"
//                                 }}
//                                 onMouseEnter={() => {
//                                   if (!state.selectedColor) {
//                                     updateProductState(productKey, { hoverImage: color.img });
//                                   }
//                                 }}
//                                 onMouseLeave={() => {
//                                   if (!state.selectedColor) {
//                                     updateProductState(productKey, { hoverImage: null });
//                                   }
//                                 }}
//                                 onClick={(e) => handleColorSelect(e, productKey, color)}
//                               />
//                             );
//                           })}
//                         </div>

//                         <div className={styles.popupActions}>
//                           <button
//                             className={styles.addProductBtnPopup}
//                             onClick={(e) => handleAddProduct(e, product, productKey)}
//                             disabled={!state.selectedColor || isAlreadySelected}
//                           >
//                             {isAlreadySelected ? "Product Already Selected" : "Add Product"}
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </li>
//             );
//           })}
//         </ul>

//         <div className={styles.modalAllProductButtonContainer}>
//           <button
//             className={styles.modalAllProductButton}
//             onClick={() => {
//               openChangeProductPopup(true, null);
//               onClose();
//             }}
//           >
//             BROWSE ALL PRODUCTS
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductContainer;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import styles from './AddProductContainer.module.css';
import colorwheel1 from "../../images/color-wheel1.png";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProductContainer = ({ isOpen, onClose, onProductSelect, openChangeProductPopup }) => {
  const { list: rawProducts, loading, error } = useSelector((state) => state.products);
  const selectedProduct = useSelector((state) => state.selectedProducts.selectedProducts);

  const [products, setProducts] = useState([]);
  const [productStates, setProductStates] = useState({});
  const [imageLoadStates, setImageLoadStates] = useState({});

  useEffect(() => {
    if (rawProducts.length > 0) {
      const productsWithKeys = rawProducts.map((product) => {
        const variants = product.variants?.edges?.map((v) => v.node) || [];
        const productImages = product.images?.edges?.map((imgEdge) => imgEdge.node.originalSrc) || [];

        const colors = (product.colors || []).map((color) => {
          const variant = color.variant;
          const variantImages = variant?.metafields?.edges?.find(
            edge => edge.node.key === "variant_images"
          )?.node.value;
          let swatchImage = '';
          if (variantImages) {
            try {
              const parsed = JSON.parse(variantImages);
              if (Array.isArray(parsed)) {
                const colorNameLower = color.name.toLowerCase().replace(/\s+/g, '');
                swatchImage = parsed.find(img => 
                  img.includes('38307_fm') || 
                  img.toLowerCase().includes(colorNameLower)
                ) || parsed[3] || parsed[0] || '';
              }
            } catch (e) {
              console.warn('Failed to parse variant_images metafield:', e);
            }
          }

          return {
            name: color.name,
            swatchImg: swatchImage || color.img || variant?.image?.originalSrc || productImages[0] || '',
            variantImg: color.img || variant?.image?.originalSrc || productImages[0] || '',
            variant: color.variant,
          };
        });

        return {
          ...product,
          productKey: product.id || uuidv4(),
          colors,
        };
      });

      setProducts(productsWithKeys);

      const initialStates = Object.fromEntries(
        productsWithKeys.map((p) => [
          p.productKey,
          { isPopupOpen: false, selectedColor: null, hoverImage: null },
        ])
      );
      setProductStates(initialStates);
    }
  }, [rawProducts]);

  useEffect(() => {
    Object.entries(productStates).forEach(([productKey, state]) => {
      const product = products.find((p) => p.productKey === productKey);
      if (state.isPopupOpen && product?.colors?.length > 0) {
        product.colors.slice(0, 3).forEach((color) => {
          const img = new Image();
          img.src = color.variantImg;
        });
      }
    });
  }, [productStates, products]);

  const updateProductState = (productKey, newState) => {
    setProductStates((prev) => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        ...newState,
      },
    }));
  };

  const handleImageLoad = (productKey) => {
    setImageLoadStates((prev) => ({
      ...prev,
      [productKey]: true,
    }));
  };

  const toggleColorPopup = (e, productKey, product) => {
    e.stopPropagation();
    const isAlreadySelected = selectedProduct.some(p => p.id === product.id);
    if (isAlreadySelected) {
      toast.error("Product already selected");
      return;
    }

    setProductStates((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, state]) => [
          key,
          {
            ...state,
            isPopupOpen: key === productKey ? !state.isPopupOpen : false,
            hoverImage: null,
          },
        ])
      )
    );
  };

  const handleColorSelect = (e, productKey, color) => {
    e.stopPropagation();
    updateProductState(productKey, { selectedColor: color, hoverImage: color.variantImg });
  };

  const handleAddProduct = (e, product, productKey) => {
    e.stopPropagation();
    const state = productStates[productKey];
    if (!state.selectedColor) return;

    onProductSelect({
      ...product,
      selectedColor: {
        name: state.selectedColor.name,
        swatchImg: state.selectedColor.swatchImg,
        variantImg: state.selectedColor.variantImg,
        variant: state.selectedColor.variant,
      },
      selectedImage: state.selectedColor.variantImg,
      imgurl: state.selectedColor.variantImg,
    });

    updateProductState(productKey, {
      isPopupOpen: false,
      hoverImage: null,
      selectedColor: null,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Add Product</h3>
          <button onClick={onClose} className={styles.modalClose}>&times;</button>
        </div>
        <hr />
        <p>Select From Our Most Popular Products</p>

        {loading && products.length === 0 && <div className="loader" />}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul className={styles.productList}>
          {products.map((product) => {
            const { productKey, name, colors = [], imgurl } = product;
            const state = productStates[productKey] || {};
            const displayImage = state.selectedColor?.variantImg || state.hoverImage || imgurl;
            const imageLoaded = imageLoadStates[productKey];
            const isAlreadySelected = selectedProduct.some((p) => p.id === product.id);

            return (
              <li key={productKey} className={styles.modalProduct}>
                <div className={styles.productMain} onClick={(e) => toggleColorPopup(e, productKey, product)}>
                  <div className={styles.imageWrapper}>
                    {!imageLoaded && <div className={styles.imagePlaceholder}></div>}
                    <img
                      src={displayImage}
                      alt={name}
                      loading="lazy"
                      className={`${styles.modalProductImg} ${imageLoaded ? styles.visible : styles.hidden}`}
                      onLoad={() => handleImageLoad(productKey)}
                    />
                  </div>
                  <p className={styles.addProductPara}>{name}</p>
                </div>

                {colors.length > 0 && (
                  <div
                    className={styles.modalProductColorContainer}
                    onClick={(e) => toggleColorPopup(e, productKey, product)}
                  >
                    <img src={colorwheel1} alt="colors" className={styles.modalProductColorImg} />
                    <p>{colors.length} Colors</p>

                    {state.isPopupOpen && (
                      <div className={styles.colorPopup}>
                        <div className={styles.colorPopupHeader}>
                          <button
                            className={styles.closePopupBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateProductState(productKey, { isPopupOpen: false, hoverImage: null });
                            }}
                          >
                            <CrossIcon />
                          </button>
                        </div>

                        <div className="color-swatch-list">
                          {colors.map((color) => {
                            const isSelected = state.selectedColor?.name === color.name;
                            // Parse the variant_images from metafields
                            const variantImages = color.variant?.metafields?.edges?.find(
                              edge => edge.node.key === "variant_images"
                            )?.node.value;
                            const swatchImage = variantImages ? JSON.parse(variantImages)[3] : color.swatchImg;

                            return (
                              <img
                                key={`${productKey}-${color.name}`}
                                src={swatchImage}
                                alt={color.name}
                                title={color.name}
                                className={`color-swatch ${isSelected ? "selected" : ""}`}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: "20%",
                                  cursor: "pointer",
                                  margin: 5,
                                  display: "inline-block",
                                  border: isSelected ? "2px solid black" : "1px solid gray",
                                  objectFit: "cover",
                                }}
                                onMouseEnter={() => {
                                  if (!state.selectedColor) {
                                    updateProductState(productKey, { hoverImage: color.variantImg });
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (!state.selectedColor) {
                                    updateProductState(productKey, { hoverImage: null });
                                  }
                                }}
                                onClick={(e) => handleColorSelect(e, productKey, color)}
                              />
                            );
                          })}
                        </div>

                        <div className={styles.popupActions}>
                          <button
                            className={styles.addProductBtnPopup}
                            onClick={(e) => handleAddProduct(e, product, productKey)}
                            disabled={!state.selectedColor || isAlreadySelected}
                          >
                            {isAlreadySelected ? "Product Already Selected" : "Add Product"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className={styles.modalAllProductButtonContainer}>
          <button
            className={styles.modalAllProductButton}
            onClick={() => {
              openChangeProductPopup(true, null);
              onClose();
            }}
          >
            BROWSE ALL PRODUCTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductContainer;