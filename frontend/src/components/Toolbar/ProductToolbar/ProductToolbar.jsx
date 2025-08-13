import React, { useState, useEffect } from 'react';
import style from './ProductToolbar.module.css';
import { getHexFromName } from '../../utils/colorUtils';
import { IoAdd } from 'react-icons/io5';
import colorwheel from '../../images/colourwheel.png';
import ChangePopup from '../../PopupComponent/ChangeProductPopup/ChangePopup';
import AddProductContainer from '../../PopupComponent/addProductContainer/AddProductContainer';
import ProductAvailableColor from '../../PopupComponent/ProductAvailableColor/ProductAvailableColor';
import { AddColorSvgIcon, CrossIcon } from '../../iconsSvg/CustomIcon';
import { useSelector, useDispatch } from 'react-redux';
import { batch } from 'react-redux';
import {
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
  setSelectedProducts as setSelectedProductsAction,
} from '../../../redux/ProductSlice/SelectedProductSlice';
import { removeNameAndNumberProduct, setRendering } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { setActiveProduct } from '../../../redux/ProductSlice/SelectedProductSlice';
import AddColorBtn from '../../CommonComponent/AddColorBtn/AddColorBtn';
import { removeProduct } from '../../../redux/productSelectionSlice/productSelectionSlice';

const ProductToolbar = () => {
  const dispatch = useDispatch();

  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  // console.log("---selectedsProduct", selectedProducts);

  const activeProduct = useSelector((state) => state.selectedProducts.activeProduct);
  // console.log("---activeProduct", activeProduct);
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
      // Set the newly added product as active and its first thumbnail as active
      const newIndex = selectedProducts.length; // Index of the new product
      dispatch(setActiveProduct(updatedProduct));
      setActiveThumbnail({ productIndex: newIndex, colorIndex: 0 });
    } else if (editingProductIndex !== null) {
      dispatch(updateProductAction({ index: editingProductIndex, product: updatedProduct }));
      // Set the updated product as active and its first thumbnail as active
      dispatch(setActiveProduct(updatedProduct));
      setActiveThumbnail({ productIndex: editingProductIndex, colorIndex: 0 });
    }

    // Reset all modal states
    setChangeProductPopup(false);
    setEditingProductIndex(null);
    setIsAddingProduct(false);
    setAddProduct(false);
  };

  const handleDeleteProduct = (indexToDelete, id) => {


    // Remove product at index

    console.log("id.................", id);
    let Productid = id.split("/");
    dispatch(removeProduct(Productid[Productid.length - 1]));
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
    console.log("===============availableeeprodddd", product)
    const allColors = product.colors?.length ? product.colors : normalizeColorsFromShopify(product);
    if (!allColors.length) return [];

    const selectedColorNames = new Set([
      product.selectedColor?.name,
      ...(product.addedColors?.map((c) => c.name) || []),
    ]);

    return allColors.filter((color) => !selectedColorNames.has(color.name));
  };

  const getNextActiveProduct = (products, targetIndex, colorIndex) => {
    if (products.length === 0) return null;

    console.log("data.............", products, targetIndex, colorIndex);
    const safeIndex = Math.min(targetIndex, products.length - 1);
    const colorIndexSafe = colorIndex ?? 0;
    const current = products[safeIndex];

    const addedColors = current.addedColors || [];
    const nextColor = addedColors.length > 0
      ? addedColors[0]
      : current.selectedColor;

    console.log("color index", colorIndex);

    const clickedColor = colorIndexSafe === 0
      ? current.selectedColor
      : addedColors[colorIndexSafe - 2] || addedColors[colorIndexSafe] || null;

    return {
      ...current,
      selectedColor: safeCloneColor(clickedColor, current.imgurl),
      imgurl: clickedColor?.img || current.imgurl,
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

    if (colorIndex === 0) {
      // Deleting main color
      if (product.addedColors.length > 0) {
        // Promote the first added color to be the new main color
        const [firstColor, ...rest] = product.addedColors;
        product.selectedColor = safeCloneColor(firstColor, firstColor.img);
        product.imgurl = firstColor.img;
        product.addedColors = rest;
        updated[productIndex] = product;

        // Set the new active product to this updated product
        const newActiveProduct = {
          ...product,
          selectedColor: safeCloneColor(firstColor, firstColor.img),
          imgurl: firstColor.img,
        };

        dispatch(setActiveProduct(newActiveProduct));
      } else {
        // No added colors left - delete the entire product
        updated.splice(productIndex, 1);

        // Find the nearest product to activate
        const newIndex = Math.min(productIndex, updated.length - 1);
        const newActiveProduct = updated[newIndex]
          ? {
            ...updated[newIndex],
            selectedColor: safeCloneColor(updated[newIndex].selectedColor, updated[newIndex].imgurl),
            imgurl: updated[newIndex].imgurl,
          }
          : null;

        dispatch(setActiveProduct(newActiveProduct));
      }
    } else {
      // Remove added color
      product.addedColors.splice(colorIndex - 1, 1);
      updated[productIndex] = product;
    }

    // Update the product list in Redux
    dispatch(setSelectedProductsAction(updated));

    // Determine new active product
    const newActiveProduct = getNextActiveProduct(updated, productIndex, colorIndex);

    // Set the new active product
    if (newActiveProduct) {
      dispatch(setActiveProduct(newActiveProduct));
    } else {
      // If no products left
      dispatch(setActiveProduct(null));
    }

    setActiveThumbnail({ productIndex: null, colorIndex: null });
    console.log("---selectedProduct", selectedProducts);
  };

  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  // Debug effect to track active product changes
  useEffect(() => {
    console.log("Active Product Updated:", activeProduct);
  }, [activeProduct]);

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
                  {selectedProducts.length > 1 && (
                    <span
                      className={style.crossProdICon}
                      onClick={() => handleDeleteProduct(index, product.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CrossIcon />
                    </span>
                  )}
                </div>

                <div className={style.productToolbarImageWithBtn}>
                  {[
                    {
                      img: product?.selectedColor?.img || product?.selectedImage,
                      name: product?.selectedColor?.name || product?.name,
                    },
                    ...(product?.addedColors || []),
                  ].map((color, i) => {
                    const isHovered = hoveredThumbnail.productIndex === index && hoveredThumbnail.colorIndex === i;
                    const imgSrc = isHovered ? hoveredThumbnail.color.img : color.img;

                    return (
                      <div
                        key={i}
                        className={`mini-prod-img-container ${activeProduct?.id === product?.id &&
                          (
                            (i === 0 &&
                              (
                                activeProduct?.selectedColor?.name === product?.selectedColor?.name ||
                                !activeProduct?.selectedColor ||
                                activeProduct?.selectedColor?.name === 'null'
                              )
                            ) ||
                            (i > 0 &&
                              activeProduct?.selectedColor?.name === product?.addedColors?.[i - 1]?.name
                            )
                          ) || activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i
                          ? style.activeThumbnail
                          : ''
                          }`}

                        // onClick={(e) => {
                        //   const clickedColor = i === 0 ? product.selectedColor : product.addedColors?.[i - 1];
                        //   const clickedColorName = clickedColor?.name;
                        //   const currentActiveName = activeProduct?.selectedColor?.name;

                        //   if (clickedColorName && clickedColorName !== currentActiveName) {
                        //     const updatedActiveProduct = {
                        //       ...product,
                        //       selectedColor: safeCloneColor(clickedColor),
                        //       imgurl: clickedColor?.img || product.imgurl,
                        //     };
                        //     dispatch(setActiveProduct(updatedActiveProduct));
                        //   }
                        //   setActiveThumbnail({ productIndex: index, colorIndex: i });
                        // }}
                        onClick={(e) => {
                          const clickedColor = i === 0 ? product.selectedColor : product.addedColors?.[i - 1];
                          const updatedActiveProduct = {
                            ...product,
                            selectedColor: safeCloneColor(clickedColor, product.imgurl),
                            imgurl: clickedColor?.img || product.imgurl,
                          };
                          dispatch(setActiveProduct(updatedActiveProduct));
                          setActiveThumbnail({ productIndex: index, colorIndex: i });
                        }}
                      >

                        {(activeProduct?.id === product?.id &&
                          (
                            (i === 0 &&
                              (
                                activeProduct?.selectedColor?.name === product?.selectedColor?.name ||
                                !activeProduct?.selectedColor ||
                                activeProduct?.selectedColor?.name === 'null'
                              )
                            ) ||
                            (i > 0 &&
                              activeProduct?.selectedColor?.name === product?.addedColors?.[i - 1]?.name
                            )
                          )) ||
                          (activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i) ||
                          (colorChangeTarget.productIndex === index &&
                            colorChangeTarget.colorIndex === i &&
                            colorChangeTarget.actionType === 'change') ? (
                          <div className={style.thumbnailActions}>
                            {!(
                              selectedProducts.length === 1 &&
                              (1 + (selectedProducts[index]?.addedColors?.length || 0)) === 1
                            ) && (
                                <span
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
                        ) : null}

                        {colorChangeTarget.productIndex === index &&
                          colorChangeTarget.actionType === 'change' &&
                          colorChangeTarget.colorIndex === i && (
                            <ProductAvailableColor
                              actionType={colorChangeTarget.actionType}
                              product={product}
                              availableColors={getAvailableColorsForProduct(product)}
                              onClose={() =>
                                setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null })
                              }

                              // In the ProductAvailableColor's onAddColor handler:
                              onAddColor={(productData, color) => {
                                const updated = JSON.parse(JSON.stringify(selectedProducts));
                                const current = { ...updated[index] };
                                const newColor = { ...color };

                                // Process variants data
                                const allVariants = normalizeVariants(productData);
                                const colorName = color.name.toLowerCase().trim();
                                const sizeVariantPairs = allVariants
                                  .filter((variant) => {
                                    const colorOpt = variant.selectedOptions.find(
                                      (opt) => opt.name.toLowerCase() === 'color'
                                    );
                                    return colorOpt?.value.toLowerCase().trim() === colorName;
                                  })
                                  .map((variant) => {
                                    const sizeOpt = variant.selectedOptions.find(
                                      (opt) => opt.name.toLowerCase() === 'size'
                                    );
                                    return sizeOpt?.value ? { size: sizeOpt.value, variantId: variant.id } : null;
                                  })
                                  .filter(Boolean);

                                newColor.sizes = sizeVariantPairs;

                                // Update the targeted color
                                if (colorChangeTarget.colorIndex === 0) {
                                  // Changing main color
                                  current.selectedColor = newColor;
                                  current.imgurl = newColor.img;
                                } else {
                                  // Changing a variant color
                                  if (!current.addedColors) current.addedColors = [];
                                  const variantIndex = colorChangeTarget.colorIndex - 1;
                                  current.addedColors[variantIndex] = newColor;
                                }

                                updated[index] = current;

                                // Create the new active product - always use the changed color
                                const newActiveProduct = {
                                  ...current,
                                  selectedColor: newColor,
                                  imgurl: newColor.img
                                };

                                // Dispatch updates in batch
                                batch(() => {
                                  dispatch(setSelectedProductsAction(updated));
                                  dispatch(setActiveProduct(newActiveProduct));
                                  dispatch(setRendering());
                                });

                                // Update UI states
                                setActiveThumbnail({
                                  productIndex: index,
                                  colorIndex: colorChangeTarget.colorIndex
                                });
                                setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null });
                              }}
                              onHoverColor={(color) =>
                                setHoveredThumbnail({
                                  productIndex: index,
                                  colorIndex: colorChangeTarget.colorIndex,
                                  color,
                                })
                              }
                              onLeaveColor={() =>
                                setHoveredThumbnail({ productIndex: null, colorIndex: null, color: null })
                              }
                            />
                          )}
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

                    {colorChangeTarget.productIndex === index && colorChangeTarget.actionType === 'addColor' && (
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
                            .filter((variant) => {
                              const colorOpt = variant.selectedOptions.find(
                                (opt) => opt.name.toLowerCase() === 'color'
                              );
                              return colorOpt?.value.toLowerCase().trim() === colorName;
                            })
                            .map((variant) => {
                              const sizeOpt = variant.selectedOptions.find(
                                (opt) => opt.name.toLowerCase() === 'size'
                              );
                              return sizeOpt?.value ? { size: sizeOpt.value, variantId: variant.id } : null;
                            })
                            .filter(Boolean);

                          newColor.sizes = sizeVariantPairs;

                          // Create a completely new product reference
                          const updatedProduct = {
                            ...JSON.parse(JSON.stringify(current)), // Deep clone
                            addedColors: [...(current.addedColors || []), newColor]
                          };

                          updated[index] = updatedProduct;

                          // Dispatch both updates together
                          batch(() => {
                            dispatch(setSelectedProductsAction(updated));
                            dispatch(setActiveProduct({
                              ...updatedProduct,
                              selectedColor: newColor,
                              imgurl: newColor.img
                            }));
                          });

                          // Set the thumbnail of the new color as active
                          const newColorIndex = updatedProduct.addedColors.length;
                          setActiveThumbnail({ productIndex: index, colorIndex: newColorIndex });

                          setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null });
                        }}
                        onHoverColor={(color) =>
                          setHoveredThumbnail({ productIndex: index, colorIndex: colorChangeTarget.colorIndex, color })
                        }
                        onLeaveColor={() =>
                          setHoveredThumbnail({ productIndex: null, colorIndex: null, color: null })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className={style.addProductBtn} onClick={addProductPopup}>
            <IoAdd /> Add Products
          </button>
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