import React, { useState, useEffect } from 'react';
import style from './ProductToolbar.module.css';
import { getHexFromName } from '../../utils/colorUtils';
import { IoAdd } from 'react-icons/io5';
import colorwheel from '../../images/colourwheel.png';
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
import { removeProduct } from '../../../redux/productSelectionSlice/productSelectionSlice';
import { CgLayoutGrid } from 'react-icons/cg';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';
import { openAddProduct, openChangeProduct } from '../../../redux/Productpopupslice.js';

const ProductToolbar = ({ isOpen = false, setIsOpen = () => { } } = {}) => {
  const dispatch = useDispatch();

  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  console.log("-------selectedproducts", selectedProducts)
  const activeProduct = useSelector((state) => state.selectedProducts.activeProduct);

  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });
  const [colorChangeTarget, setColorChangeTarget] = useState({ productIndex: null, colorIndex: null, actionType: null });
  const [hoveredThumbnail, setHoveredThumbnail] = useState({ productIndex: null, colorIndex: null, color: null });

  // Clone color safely with fallback for image and variants
  const safeCloneColor = (color, fallbackImg = '', allVariants = []) => {
    if (!color || typeof color !== 'object' || Array.isArray(color)) {
      return { name: String(color), img: fallbackImg, swatchImg: fallbackImg, allVariants: allVariants || [] };
    }

    const colorName = color.name?.toLowerCase().trim();
    const variant = allVariants?.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase().trim() === colorName
      )
    );
    const swatchImg =
      variant?.metafields?.edges?.find(
        (mf) => mf.node.key === 'swatch_image' && mf.node.namespace === 'custom'
      )?.node.value || color.swatchImg || color.img || fallbackImg;

    return {
      ...color,
      swatchImg,
      img: color.img || fallbackImg,
      allVariants: allVariants || color.allVariants || [],
    };
  };

  // Open popup for changing product - now using Redux actions
  const openChangeProductPopup = (isAdd = false, index = null) => {
    dispatch(openChangeProduct({ isAdd, index }));
  };

  // Open popup for adding new product - now using Redux actions
  const addProductPopup = () => {
    dispatch(openAddProduct());
  };

  useEffect(() => {
    // console.log('Active Product from useSelector (after render):', activeProduct);
    // console.log('Active Product Color:', activeProduct?.selectedColor?.name);
  }, [activeProduct]);

  // Product deletion
  const handleDeleteProduct = (indexToDelete, id) => {
    let Productid = id.split("/");
    dispatch(removeProduct(Productid[Productid.length - 1]));
    const updated = [...selectedProducts];
    updated.splice(indexToDelete, 1);

    dispatch(deleteProductAction(indexToDelete));
    dispatch(setSelectedProductsAction(updated));

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

  const normalizeColorsFromShopify = (product) => {
    if (!product?.variants?.edges) return [];
    const colorMap = new Map();
    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color');
      if (colorOption && !colorMap.has(colorOption.value)) {
        const swatchImg = node.metafields?.edges?.find(
          (mf) => mf.node.key === 'swatch_image' && mf.node.namespace === 'custom'
        )?.node.value || node.image?.originalSrc || '';
        colorMap.set(colorOption.value, {
          name: colorOption.value,
          img: node.image?.originalSrc || '',
          swatchImg,
          allVariants: normalizeVariants(product),
        });
      }
    });
    return Array.from(colorMap.values());
  };

  const getAvailableColorsForProduct = (product) => {
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

    const safeIndex = Math.min(targetIndex, products.length - 1);
    const colorIndexSafe = colorIndex ?? 0;
    const current = products[safeIndex];

    const addedColors = current.addedColors || [];
    const nextColor = addedColors.length > 0
      ? addedColors[0]
      : current.selectedColor;

    const clickedColor = colorIndexSafe === 0
      ? current.selectedColor
      : addedColors[colorIndexSafe - 2] || addedColors[colorIndexSafe] || null;

    return {
      ...current,
      selectedColor: safeCloneColor(clickedColor, current.imgurl, current.allVariants),
      imgurl: clickedColor?.img || current.imgurl,
      allVariants: current.allVariants || [],
    };
  };

  const handleDeleteColorThumbnail = (productIndex, colorIndex) => {
    const updated = [...selectedProducts];
    const originalProduct = selectedProducts[productIndex];
    const product = {
      ...originalProduct,
      addedColors: [...(originalProduct.addedColors || [])],
      selectedColor: safeCloneColor(originalProduct.selectedColor, originalProduct.imgurl, originalProduct.allVariants),
      allVariants: originalProduct.allVariants || [],
    };

    if (colorIndex === 0) {
      if (product.addedColors.length > 0) {
        const [firstColor, ...rest] = product.addedColors;
        product.selectedColor = safeCloneColor(firstColor, firstColor.img, product.allVariants);
        product.imgurl = firstColor.img;
        product.addedColors = rest;
        updated[productIndex] = product;

        const newActiveProduct = {
          ...product,
          selectedColor: safeCloneColor(firstColor, firstColor.img, product.allVariants),
          imgurl: firstColor.img,
          allVariants: product.allVariants,
        };

        dispatch(setActiveProduct(newActiveProduct));
      } else {
        updated.splice(productIndex, 1);

        const newIndex = Math.min(productIndex, updated.length - 1);
        const newActiveProduct = updated[newIndex]
          ? {
            ...updated[newIndex],
            selectedColor: safeCloneColor(updated[newIndex].selectedColor, updated[newIndex].imgurl, updated[newIndex].allVariants),
            imgurl: updated[newIndex].imgurl,
            allVariants: updated[newIndex].allVariants || [],
          }
          : null;

        dispatch(setActiveProduct(newActiveProduct));
      }
    } else {
      product.addedColors.splice(colorIndex - 1, 1);
      updated[productIndex] = product;
    }

    dispatch(setSelectedProductsAction(updated));

    const newActiveProduct = getNextActiveProduct(updated, productIndex, colorIndex);

    if (newActiveProduct) {
      dispatch(setActiveProduct(newActiveProduct));
    } else {
      dispatch(setActiveProduct(null));
    }

    setActiveThumbnail({ productIndex: null, colorIndex: null });
  };

  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // console.log("Active Product Updated:", activeProduct);
  }, [activeProduct]);

  const tritriggerRef = React.useRef(null);

  return (
    <div className='toolbar-main-container'>
      <div className={style.productToolbar}>
        <div className="toolbar-main-heading">
          <h5 className="Toolbar-badge">Products</h5>
          <h2>Manage Your Products</h2>
          <p>You can select multiple products and colors</p>
        </div>
        <div className={style.toolbarBox}>
          {selectedProducts.map((product, index) => (
            <div className={style.toolbarProductHead} key={index}>
              <div className={style.toolbarHead}>
                <div className={style.toolbarProductTitleHead}>
                  <h5>{product?.name || product?.title}</h5>
                  {selectedProducts.length > 1 && (
                    <span
                      className={`${style.closeBtn} `}
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
                      swatchImg: product?.selectedColor?.swatchImg || product?.selectedImage,
                      name: product?.selectedColor?.name || product?.name,
                      allVariants: product?.allVariants || [],
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
                        onClick={(e) => {
                          e.stopPropagation();
                          if (colorChangeTarget?.actionType === 'change') return
                          const clickedColor = i === 0 ? product.selectedColor : product.addedColors?.[i - 1];
                          const updatedActiveProduct = {
                            ...product,
                            selectedColor: safeCloneColor(clickedColor, product.imgurl, product.allVariants),
                            imgurl: clickedColor?.img || product.imgurl,
                            allVariants: product.allVariants || [],
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
                              onClick={(e) => {
                                tritriggerRef.current = e.currentTarget;
                                e.stopPropagation();
                                setColorChangeTarget({ productIndex: index, colorIndex: i, actionType: 'change' });
                              }}
                            >
                              <img
                                src={color.swatchImg || color.img}
                                alt={color.name}
                                className={style.swatchImage}
                              />
                              Change
                            </button>
                          </div>
                        ) : null}

                        {colorChangeTarget.productIndex === index &&
                          colorChangeTarget.actionType === 'change' &&
                          colorChangeTarget.colorIndex === i && (
                            <ProductAvailableColor
                              triggerRef={tritriggerRef}
                              actionType={colorChangeTarget.actionType}
                              product={product}
                              availableColors={getAvailableColorsForProduct(product)}
                              onClose={() =>
                                setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null })
                              }
                              onAddColor={(productData, color) => {
                                const updated = selectedProducts.map((p, idx) =>
                                  idx === index ? { ...p } : p
                                );

                                const current = { ...updated[index] };
                                const newColor = {
                                  ...color,
                                  sizes: [],
                                  allVariants: productData.allVariants || []
                                };

                                const allVariants = normalizeVariants(productData);
                                const colorName = color.name.toLowerCase().trim();
                                newColor.sizes = allVariants
                                  .filter((variant) => {
                                    const colorOpt = variant.selectedOptions?.find(
                                      (opt) => opt.name.toLowerCase() === 'color'
                                    );
                                    return colorOpt?.value?.toLowerCase().trim() === colorName;
                                  })
                                  .map((variant) => {
                                    const sizeOpt = variant.selectedOptions?.find(
                                      (opt) => opt.name.toLowerCase() === 'size'
                                    );
                                    return sizeOpt?.value ? { size: sizeOpt.value, variantId: variant.id } : null;
                                  })
                                  .filter(Boolean);

                                if (colorChangeTarget.colorIndex === 0) {
                                  current.selectedColor = newColor;
                                  current.imgurl = newColor.img || current.imgurl;
                                } else {
                                  current.addedColors = [...(current.addedColors || [])];
                                  current.addedColors[colorChangeTarget.colorIndex - 1] = newColor;
                                }

                                updated[index] = current;

                                const newActiveProduct = {
                                  ...current,
                                  selectedColor: newColor,
                                  imgurl: newColor.img || current.imgurl
                                };

                                dispatch(setSelectedProductsAction(updated));
                                dispatch(setActiveProduct(newActiveProduct));
                                dispatch(setRendering());

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
                  <button className="black-button" onClick={() => { openChangeProductPopup(false, index); setIsOpen(false) }}>
                    Change Product
                  </button>

                  <div className={style.addColorBtnMainContainer} >
                    <div
                      key={`add-color-${index}`}
                      className={style.addCartButton}
                      onClick={(e) => {
                        tritriggerRef.current = e.currentTarget;
                        e.stopPropagation();
                        setColorChangeTarget({ productIndex: index, colorIndex: -1, actionType: 'addColor' })
                      }}
                    >
                      <img src={colorwheel} alt="color wheel" className={style.colorImg} />
                      <p>Add Color</p>
                    </div>

                    {colorChangeTarget.productIndex === index && colorChangeTarget.actionType === 'addColor' && (
                      <ProductAvailableColor
                        triggerRef={tritriggerRef}
                        actionType={colorChangeTarget.actionType}
                        product={product}
                        availableColors={getAvailableColorsForProduct(product)}
                        onClose={() => setColorChangeTarget({ productIndex: null, colorIndex: null, actionType: null })}
                        onAddColor={(productData, color) => {
                          const updated = [...selectedProducts];
                          const current = { ...updated[index] };
                          const newColor = safeCloneColor(color, null, productData.allVariants);

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

                          const updatedProduct = {
                            ...JSON.parse(JSON.stringify(current)),
                            addedColors: [...(current.addedColors || []), newColor],
                            allVariants: current.allVariants || [],
                          };

                          updated[index] = updatedProduct;

                          batch(() => {
                            dispatch(setSelectedProductsAction(updated));
                            dispatch(setActiveProduct({
                              ...updatedProduct,
                              selectedColor: newColor,
                              imgurl: newColor.img,
                              allVariants: updatedProduct.allVariants || [],
                            }));
                          });

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
          <button className={style.addProductBtn} onClick={() => {
            setIsOpen(false);
            addProductPopup();   // <-- call it
          }}>
            <span><IoAdd /></span>  Add Products
          </button>
        </div>
      </div>
    </div >
  );
};

export default ProductToolbar;