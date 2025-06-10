import React, { useEffect, useState } from 'react';
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
  setSelectedProducts,
  setActiveProduct,
} from '../../../redux/ProductSlice/SelectedProductSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addProductDesignState, removeNameAndNumberProduct, setCurrentProductId, setRendering } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
// import ContinueEditPopup from '../../PopupComponent/ContinueEditPopup/ContinueEditPopup';
// import { setInitialPopupShown } from '../../../redux/ContinueDesign/ContinueDesignSlice';
import { fetchProducts } from '../../../redux/ProductSlice/ProductSlice';
const ProductToolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  // const { setActiveProduct } = useOutletContext();


  const currentProductId = useSelector((state) => state.TextFrontendDesignSlice.currentProductId);
  const [changeProductPopup, setChangeProductPopup] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });
  const [colorChangeTarget, setColorChangeTarget] = useState({ productIndex: null, colorIndex: null, actionType: null });
  const [hoveredThumbnail, setHoveredThumbnail] = useState({ productIndex: null, colorIndex: null, color: null });
  const [isHovered, setIsHovered] = useState(false);

  const safeCloneColor = (color, fallbackImg = '') => {
    if (!color || typeof color !== 'object' || Array.isArray(color)) {
      return { name: String(color), img: fallbackImg };
    }
    return { ...color };
  };

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
    console.log("product id", product.id)
    console.log("product ", product)
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

      dispatch(addProductDesignState({ productId: product?.id }))
      dispatch(addProductAction(updatedProduct));
      setTimeout(() => dispatch(setRendering()), 100)
      // dispatch(setCurrentProductId(product?.id));
    } else if (editingProductIndex !== null) {
      dispatch(updateProductAction({ index: editingProductIndex, product: updatedProduct }));
    }

    setChangeProductPopup(false);
    setEditingProductIndex(null);
    setIsAddingProduct(false);
    setAddProduct(false);
  };

  const handleDeleteProduct = (indexToDelete) => {
    dispatch(deleteProductAction(indexToDelete));
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
      console.log("color option", colorOption)
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
    const allColors = product.colors?.length ? product.colors : normalizeColorsFromShopify(product);
    if (!allColors.length) return [];

    const selectedColorNames = new Set([
      product.selectedColor?.name,
      ...(product.addedColors?.map((c) => c.name) || []),
    ]);

    return allColors.filter((color) => !selectedColorNames.has(color.name));
  };

  const handleDeleteColorThumbnail = (productIndex, colorIndex) => {
    const updated = [...selectedProducts];
    const originalProduct = selectedProducts[productIndex];
    const product = {
      ...originalProduct,
      addedColors: [...(originalProduct.addedColors || [])],
      selectedColor: { ...originalProduct.selectedColor },
    };

    const totalThumbnails = 1 + (product.addedColors?.length || 0);
    // if (selectedProducts.length === 1 && totalThumbnails === 1) {
    //   toast.error("Cannot delete the last product.");
    //   return;
    // }

    const addedColors = product.addedColors;

    const isMainColor = colorIndex === 0;
    console.log("color index", colorIndex);
    const clickedColor = isMainColor
      ? addedColors[0]
      : addedColors[colorIndex - 2] || addedColors[colorIndex] || null;

    const updatedActiveProduct = {
      ...product,
      selectedColor: safeCloneColor(clickedColor, product.imgurl),
      imgurl: clickedColor?.img || product.imgurl,
    };
    dispatch(setActiveProduct(updatedActiveProduct));
    // setActiveProduct(updatedActiveProduct);
    // dispatch()

    console.log(clickedColor, "clickedColor");
    console.log(updatedActiveProduct, "updatedActiveProduct");
    if (clickedColor) {
      if (isMainColor) {
        dispatch(setCurrentProductId(product?.id));
      } else {
        dispatch(setCurrentProductId(clickedColor?.variant?.id));
      }
    }
    else {
      dispatch(setCurrentProductId(updatedActiveProduct?.id));
    }

    if (product.id) {
      dispatch(removeNameAndNumberProduct(product.id));
    }

    if (isMainColor) {
      if (addedColors.length > 0) {
        const [firstColor, ...rest] = addedColors;
        product.selectedColor = safeCloneColor(firstColor, product.imgurl);
        product.imgurl = firstColor.img;
        product.addedColors = rest;
      } else {
        handleDeleteProduct(productIndex);
        return;
      }
    } else {
      product.addedColors = addedColors.filter((_, i) => i !== colorIndex - 1);
    }

    updated[productIndex] = product;
    dispatch(setSelectedProductsAction(updated));
    setActiveThumbnail({ productIndex: null, colorIndex: null });
  };




  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
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
    <div className="toolbar-main-container">
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
                  {!(
                    selectedProducts.length === 1 &&
                    (1 + (selectedProducts[index]?.addedColors?.length || 0)) === 1
                  ) && (

                      <span
                        className={style.crossProdICon}
                        onClick={() => handleDeleteProduct(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <CrossIcon />
                      </span>
                    )}

                  {/* <span className={style.crossProdICon} onClick={() => handleDeleteProduct(index)} style={{ cursor: 'pointer' }}>
                    <CrossIcon />
                  </span> */}
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
                        className={`mini-prod-img-container ${(activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i) ? "active" : ""}`}

                        onClick={() => {
                          const clickedColor = i === 0 ? product.selectedColor : product.addedColors?.[i - 1];
                          console.log("clickedColor", clickedColor)
                          console.log("product", product)
                          const updatedActiveProduct = {
                            ...product,
                            selectedColor: safeCloneColor(clickedColor, product.imgurl),
                            imgurl: clickedColor?.img || product.imgurl,
                          };
                          // dispatch(setCurrentProductId(clickedColor.variant.id));
                          // console.log("id which want to add",clickedColor.variant.id)
                          // console.log("variant id ",currentProductId)
                          dispatch(setActiveProduct(updatedActiveProduct))
                          // setActiveProduct(updatedActiveProduct);
                          if (i == 0) {
                            dispatch(setCurrentProductId(product?.id));
                          }
                          else {
                            dispatch(setCurrentProductId(clickedColor?.variant?.id));
                          }
                          // setTimeout(() => dispatch(setRendering()), 20);
                          setActiveThumbnail((prev) =>
                            prev.productIndex === index && prev.colorIndex === i
                              ? { productIndex: null, colorIndex: null }
                              : { productIndex: index, colorIndex: i }
                          );
                        }}
                      >
                        {activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i && (
                          <div className="thumbnail-actions">
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

                            {/* <span
                              className={style.crossProdIConofSingleProduct}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteColorThumbnail(index, i);
                              }}
                            >
                              <CrossIcon />
                            </span> */}

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
