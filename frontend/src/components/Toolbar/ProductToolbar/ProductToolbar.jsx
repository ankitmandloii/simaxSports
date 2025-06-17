import React, { useState } from 'react';
import style from './ProductToolbar.module.css';
import { getHexFromName } from '../../utils/colorUtils';
import { IoAdd } from 'react-icons/io5';
import colorwheel from '../../images/color-wheel.png';
import ChangePopup from '../../PopupComponent/ChangeProductPopup/ChangePopup';
import AddProductContainer from '../../PopupComponent/addProductContainer/AddProductContainer';
import ProductAvailableColor from '../../PopupComponent/ProductAvailableColor/ProductAvailableColor';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  setSelectedProducts as setSelectedProductsAction,
} from '../../../redux/ProductSlice/SelectedProductSlice';
// import { useSearchParams } from 'react-router-dom';
import { removeNameAndNumberProduct, setRendering } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
// import ContinueEditPopup from '../../PopupComponent/ContinueEditPopup/ContinueEditPopup';
// import { setInitialPopupShown } from '../../../redux/ContinueDesign/ContinueDesignSlice';
// import { fetchProducts } from '../../../redux/ProductSlice/ProductSlice';
import { setActiveProduct } from '../../../redux/ProductSlice/SelectedProductSlice';
// import io from 'socket.io-client';
// import { updateAdminSettingsFromSocket } from '../../../redux/SettingsSlice/SettingsSlice';
// const socket = io(process.env.REACT_APP_BASE_URL, {
//   transports: ["websocket"], // ensure real WebSocket connection
// });


const ProductToolbar = () => {
  const dispatch = useDispatch();

  
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  // const { setActiveProduct } = useOutletContext();


  const [changeProductPopup, setChangeProductPopup] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });
  const [colorChangeTarget, setColorChangeTarget] = useState({ productIndex: null, colorIndex: null, actionType: null });
  const [hoveredThumbnail, setHoveredThumbnail] = useState({ productIndex: null, colorIndex: null, color: null });
  // Clone color safely with fallback for image
  const safeCloneColor = (color, fallbackImg = '') => {
    if (!color || typeof color !== 'object' || Array.isArray(color)) {
      return { name: String(color), img: fallbackImg };
    }
    return { ...color };
  };
  // Open popup for changing/adding product
  const openChangeProductPopup = (isAdd = false, index = null) => {
    setIsAddingProduct(isAdd);
    setEditingProductIndex(index);
    setChangeProductPopup(true);
  };
  // Open popup for adding new product
  const addProductPopup = () => {
    setIsAddingProduct(true);
    setEditingProductIndex(null);
    setAddProduct(true);
  };
  // Handle product selection and update/add it to Redux store
  const handleProductSelect = (product, selectedColor = null) => {
    const fallbackImg = product?.img || product?.imgurl || product?.selectedImage || '';
    const clonedColor = selectedColor
      ? safeCloneColor(selectedColor, fallbackImg)
      : product.selectedColor
        ? safeCloneColor(product.selectedColor, fallbackImg)
        : product.colors?.[0]
          ? safeCloneColor(product.colors[0], fallbackImg)
          : null;

    const updatedProduct = {
      ...product,
      selectedColor: clonedColor,
      imgurl: clonedColor?.img || fallbackImg,
    };

    if (isAddingProduct) {
      dispatch(addProductAction(updatedProduct));
    } else if (editingProductIndex !== null) {
      dispatch(updateProductAction({ index: editingProductIndex, product: updatedProduct }));
    }
    // Reset all modal states
    setChangeProductPopup(false);
    setEditingProductIndex(null);
    setIsAddingProduct(false);
    setAddProduct(false);
  };

  const handleDeleteProduct = (indexToDelete) => {
    // Remove product at index
    const updated = [...selectedProducts];
    updated.splice(indexToDelete, 1);

    // Dispatch updated product list
    dispatch(deleteProductAction(indexToDelete));
    dispatch(setSelectedProductsAction(updated));

    // Determine and set next active product
    const newActiveProduct = getNextActiveProduct(updated, indexToDelete);

    if (newActiveProduct) {
      dispatch(setActiveProduct(newActiveProduct));
    } else {
      dispatch(setActiveProduct(null));
    }
  };


  const normalizeVariants = (product) => {
    if (product?.allVariants?.length) return product.allVariants;
    if (product?.variants?.edges?.length) return product.variants.edges.map(edge => edge.node);
    return [];
  };
  // Extract unique color options from Shopify product structure
  const normalizeColorsFromShopify = (product) => {
    if (!product?.variants?.edges) return [];
    const colorMap = new Map();
    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color');
      if (colorOption && !colorMap.has(colorOption.value)) {
        colorMap.set(colorOption.value, {
          name: colorOption.value,
          img: node.image?.originalSrc || '',
        });
      }
    });
    return Array.from(colorMap.values());
  };
  // Get list of colors not already used by the product
  const getAvailableColorsForProduct = (product) => {
    const allColors = product.colors?.length ? product.colors : normalizeColorsFromShopify(product);
    if (!allColors.length) return [];

    const selectedColorNames = new Set([
      product.selectedColor?.name,
      ...(product.addedColors?.map((c) => c.name) || []),
    ]);

    return allColors.filter((color) => !selectedColorNames.has(color.name));
  };


  // const getNextActiveProduct = (products, targetIndex) => {
  //   console.log("getNextActiveProduct",products.length)
  //   console.log("getNextActiveProducttargetIndex",targetIndex)
  //   if (products.length === 0) {
  //     return null;
  //   }

  //   // Try to use the product at targetIndex, fallback to last product
  //   const current = products[targetIndex] || products[products.length - 1];
  //   const addedColors = current.addedColors || [];

  //   let nextColor = null;

  //   if (addedColors.length > 0) {
  //     nextColor = addedColors[0]; // Pick the first added color
  //   } else {
  //     nextColor = current.selectedColor; // Fallback to main product color
  //   }

  //   return {
  //     ...current,
  //     selectedColor: safeCloneColor(nextColor, current.imgurl),
  //     imgurl: nextColor?.img || current.imgurl,
  //   };
  // };


  const getNextActiveProduct = (products, targetIndex) => {
    if (products.length === 0) return null;

    const safeIndex = Math.min(targetIndex, products.length - 1);
    const current = products[safeIndex];

    const addedColors = current.addedColors || [];
    const nextColor = addedColors.length > 0
      ? addedColors[0]
      : current.selectedColor;

    return {
      ...current,
      selectedColor: safeCloneColor(nextColor, current.imgurl),
      imgurl: nextColor?.img || current.imgurl,
    };
  };


  const handleDeleteColorThumbnail = (productIndex, colorIndex) => {
    const updated = [...selectedProducts];
    const originalProduct = selectedProducts[productIndex];
    const product = {
      ...originalProduct,
      addedColors: [...(originalProduct.addedColors || [])],
      selectedColor: { ...originalProduct.selectedColor },
    };

    // Remove the color from addedColors
    if (colorIndex === 0) {
      // Deleting main color
      if (product.addedColors.length > 0) {
        const [firstColor, ...rest] = product.addedColors;
        product.selectedColor = safeCloneColor(firstColor, product.imgurl);
        product.imgurl = firstColor.img;
        product.addedColors = rest;
      } else {
        // No added colors left — remove the product
        updated.splice(productIndex, 1);
      }
    } else {
      // Remove added color
      product.addedColors.splice(colorIndex - 1, 1);
      updated[productIndex] = product;
    }

    // Update the product list in Redux
    dispatch(setSelectedProductsAction(updated));

    // Determine new active product



    const newActiveProduct = getNextActiveProduct(updated, productIndex);

    // Set the new active product
    if (newActiveProduct) {
      dispatch(setActiveProduct(newActiveProduct));
    } else {
      // If no products left
      dispatch(setActiveProduct(null));
    }

    setActiveThumbnail({ productIndex: null, colorIndex: null });
  };


  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  // const [searchParams] = useSearchParams();
  // Fetch all products once on mount (Commented )
  // useEffect(() => {
  //   dispatch(fetchProducts());
  // }, []);
  // ----

  // useEffect(() => {
  //   console.log("-----running");
  //   console.log("Socket connected:", socket.connected);

  //   socket.on("connect", () => {
  //     console.log("Socket connected to server, ID:", socket.id);
  //   });

  //   socket.on("adminSettingUpdate", (newSettings) => {
  //     console.log("Received AdminSettingChanged event with data:", newSettings);
  //     dispatch(updateAdminSettingsFromSocket(newSettings));
  //   });

  //   return () => {
  //     socket.off("adminSettingUpdate");
  //   };
  // }, [dispatch]);

  // useEffect(() => {
  //   const productId = searchParams.get("productId"); // "8847707537647"
  //   const title = searchParams.get("title");         // "Dusty Rose / S"
  //   console.log("productId", productId);
  //   console.log(rawProducts, "productId")
  //   const initialProduct = rawProducts.filter((p) => p.id == `gid://shopify/Product/${productId}`);
  //   console.log("initiale Product", initialProduct);
  //   dispatch(setSelectedProducts(initialProduct))
  // }, [rawProducts])


  return (
    <div className={style.toolbarMainContainer}>
      <div className={style.productToolbar}>

        <div className="toolbar-main-heading">
          <h5 className="Toolbar-badge">Product</h5>
          <h2>Manage Your Products</h2>
          <p>You can select multiple products and colors</p>
        </div>

        <div className={style.toolbarBox}>
          {selectedProducts.map((product, index) => (
            <div className={style.toolbarProductHead} key={index}>
              <div className={style.toolbarHead}>
                <div className={style.toolbarProductTitleHead}>
                  <h4>{product?.name || product?.title}</h4>
                  {(
                    selectedProducts.length > 1
                  ) && (

                      <span
                        className={style.crossProdICon}
                        onClick={() => handleDeleteProduct(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CrossIcon />
                      </span>
                    )}

                </div>

                <div className={style.productToolbarImageWithBtn}>
                  {[
                    {
                      img: product?.imgurl || product?.selectedImage,
                      name: product?.selectedColor?.name || product?.name,
                    },
                    ...(product?.addedColors || []),
                  ].map((color, i) => {
                    const isHovered = hoveredThumbnail.productIndex === index && hoveredThumbnail.colorIndex === i;
                    const imgSrc = isHovered ? hoveredThumbnail.color.img : color.img;

                    return (
                      <div
                        key={i}
                        className="mini-prod-img-container"
                        onClick={() => {
                          const clickedColor = i === 0 ? product.selectedColor : product.addedColors?.[i - 1];
                          const updatedActiveProduct = {
                            ...product,
                            selectedColor: safeCloneColor(clickedColor, product.imgurl),
                            imgurl: clickedColor?.img || product.imgurl,
                          };
                          dispatch(setActiveProduct(updatedActiveProduct));
                          setTimeout(() => dispatch(setRendering()), 10);
                          setActiveThumbnail((prev) =>
                            prev.productIndex === index && prev.colorIndex === i
                              ? { productIndex: null, colorIndex: null }
                              : { productIndex: index, colorIndex: i }
                          );
                        }}
                      >
                        {activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i && (
                          <div className="style.thumbnail-actions">


                            {!(
                              selectedProducts.length === 1 &&
                              (1 + (selectedProducts[index]?.addedColors?.length || 0)) === 1
                            ) && (<span
                              className={style.crossProdIConofSingleProduct}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteColorThumbnail(index, i);
                              }}
                            >
                              <CrossIcon />
                            </span>
                              )}
                            <button
                              className={style.toolbarSpan}
                              style={{ '--indicator-color': getHexFromName(color?.name) }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setColorChangeTarget({ productIndex: index, colorIndex: i, actionType: 'change' });
                              }}
                            >
                              Change
                            </button>

                          </div>

                        )}
                        {
                          colorChangeTarget.productIndex === index && colorChangeTarget.actionType === 'change' && colorChangeTarget.colorIndex === i && (
                            <ProductAvailableColor
                              actionType={colorChangeTarget.actionType}
                              product={product}
                              availableColors={getAvailableColorsForProduct(product)}
                              onClose={() => setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null })}
                              onAddColor={(productData, color) => {
                                const updated = [...selectedProducts];
                                const current = { ...updated[index] };
                                const newColor = safeCloneColor(color);

                                const allVariants = normalizeVariants(productData);
                                const colorName = color.name.toLowerCase().trim();
                                const sizeVariantPairs = allVariants
                                  .filter(variant => {
                                    const colorOpt = variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
                                    return colorOpt?.value.toLowerCase().trim() === colorName;
                                  })
                                  .map(variant => {
                                    const sizeOpt = variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'size');
                                    return sizeOpt?.value ? { size: sizeOpt.value, variantId: variant.id } : null;
                                  })
                                  .filter(Boolean);

                                newColor.sizes = sizeVariantPairs;

                                if (colorChangeTarget.colorIndex === 0) {
                                  current.selectedColor = newColor;
                                  current.imgurl = newColor.img;
                                } else if (colorChangeTarget.colorIndex > 0) {
                                  const newAddedColors = [...(current.addedColors || [])];
                                  current.addedColors = [
                                    ...newAddedColors.slice(0, colorChangeTarget.colorIndex - 1),
                                    newColor,
                                    ...newAddedColors.slice(colorChangeTarget.colorIndex),
                                  ];
                                } else {
                                  const alreadyExists = current.addedColors?.some((c) => c.name === newColor.name);
                                  if (!alreadyExists) {
                                    current.addedColors = [...(current.addedColors || []), newColor];
                                  }
                                }

                                updated[index] = current;
                                dispatch(setSelectedProductsAction(updated));
                                setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null });
                              }}
                              onHoverColor={(color) =>
                                setHoveredThumbnail({ productIndex: index, colorIndex: colorChangeTarget.colorIndex, color })
                              }
                              onLeaveColor={() =>
                                setHoveredThumbnail({ productIndex: null, colorIndex: null, color: null })
                              }
                            />
                          )
                        }
                        <div className={style.imgThumbnaillContainer}>
                          <img src={imgSrc} className="product-mini-img" alt={color.name} title={color.name} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={style.toolbarMiddleButton}>
                  <button className="black-button" onClick={() => openChangeProductPopup(false, index)}>
                    Change Product
                  </button>

                  <div className={style.addColorBtnMainContainer}>
                    <div
                      className={style.addCartButton}
                      onClick={() => setColorChangeTarget({ productIndex: index, colorIndex: -1, actionType: 'addColor' })}
                    >
                      <img src={colorwheel} alt="color wheel" className={style.colorImg} />
                      <p>Add Color</p>
                    </div>


                    {
                      colorChangeTarget.productIndex === index && colorChangeTarget.actionType === 'addColor' && (
                        <ProductAvailableColor
                          actionType={colorChangeTarget.actionType}
                          product={product}
                          availableColors={getAvailableColorsForProduct(product)}
                          onClose={() => setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null })}
                          onAddColor={(productData, color) => {
                            const updated = [...selectedProducts];
                            const current = { ...updated[index] };
                            const newColor = safeCloneColor(color);

                            const allVariants = normalizeVariants(productData);
                            const colorName = color.name.toLowerCase().trim();
                            const sizeVariantPairs = allVariants
                              .filter(variant => {
                                const colorOpt = variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'color');
                                return colorOpt?.value.toLowerCase().trim() === colorName;
                              })
                              .map(variant => {
                                const sizeOpt = variant.selectedOptions.find(opt => opt.name.toLowerCase() === 'size');
                                return sizeOpt?.value ? { size: sizeOpt.value, variantId: variant.id } : null;
                              })
                              .filter(Boolean);

                            newColor.sizes = sizeVariantPairs;

                            if (colorChangeTarget.colorIndex === 0) {
                              current.selectedColor = newColor;
                              current.imgurl = newColor.img;
                            } else if (colorChangeTarget.colorIndex > 0) {
                              const newAddedColors = [...(current.addedColors || [])];
                              current.addedColors = [
                                ...newAddedColors.slice(0, colorChangeTarget.colorIndex - 1),
                                newColor,
                                ...newAddedColors.slice(colorChangeTarget.colorIndex),
                              ];
                            } else {
                              const alreadyExists = current.addedColors?.some((c) => c.name === newColor.name);
                              if (!alreadyExists) {
                                current.addedColors = [...(current.addedColors || []), newColor];
                              }
                            }

                            updated[index] = current;
                            dispatch(setSelectedProductsAction(updated));
                            setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null });
                          }}
                          onHoverColor={(color) =>
                            setHoveredThumbnail({ productIndex: index, colorIndex: colorChangeTarget.colorIndex, color })
                          }
                          onLeaveColor={() =>
                            setHoveredThumbnail({ productIndex: null, colorIndex: null, color: null })
                          }
                        />
                      )
                    }


                  </div>
                </div>
              </div>
            </div>

          ))}

          <button className={style.addProductBtn} onClick={addProductPopup}>
            <IoAdd /> Add Products
          </button>

          <p className="center">Customize Method Example</p>
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
            openChangeProductPopup={openChangeProductPopup}
          />
        )}
      </div>
    </div>
  );
};

export default ProductToolbar;
