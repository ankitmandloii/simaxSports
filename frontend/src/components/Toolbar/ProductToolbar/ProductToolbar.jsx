import React, { useEffect, useState } from 'react';
import './ProductToolbar.css';
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
import { useNavigate, useOutletContext } from 'react-router-dom';
import { removeNameAndNumberProduct, setRendering } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import ContinueEditPopup from '../../PopupComponent/ContinueEditPopup/ContinueEditPopup';
import { setInitialPopupShown } from '../../../redux/ContinueDesign/ContinueDesignSlice';

const ProductToolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const { setActiveProduct } = useOutletContext();

  const [changeProductPopup, setChangeProductPopup] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [activeThumbnail, setActiveThumbnail] = useState({ productIndex: null, colorIndex: null });
  const [colorChangeTarget, setColorChangeTarget] = useState({ productIndex: null, colorIndex: null });
  const [hoveredThumbnail, setHoveredThumbnail] = useState({ productIndex: null, colorIndex: null, color: null });

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
    const product = selectedProducts[productIndex];
    const productid = product.id;
    if (productid) {
      dispatch(removeNameAndNumberProduct(productid));
    }
    const totalThumbnails = 1 + (product.addedColors?.length || 0);
    if (totalThumbnails === 1) {
      handleDeleteProduct(productIndex);
      return;
    }

    if (colorIndex === 0) {
      const updated = [...selectedProducts];
      const current = { ...updated[productIndex] };
      const remainingColors = current.addedColors || [];

      if (remainingColors.length > 0) {
        const [firstColor, ...rest] = remainingColors;
        current.selectedColor = safeCloneColor(firstColor, product.imgurl);
        current.imgurl = firstColor.img;
        current.addedColors = rest;
        updated[productIndex] = current;
        dispatch(setSelectedProductsAction(updated));
      } else {
        handleDeleteProduct(productIndex);
      }

      setActiveThumbnail({ productIndex: null, colorIndex: null });
      return;
    }

    const updated = [...selectedProducts];
    const currentProduct = { ...updated[productIndex] };
    currentProduct.addedColors = currentProduct.addedColors?.filter((_, i) => i !== colorIndex - 1) || [];
    updated[productIndex] = currentProduct;
    dispatch(setSelectedProductsAction(updated));
    setActiveThumbnail({ productIndex: null, colorIndex: null });
  };

  return (
    <div className="toolbar-main-container">
      <div className="product-toolbar">
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
                  <span className="crossProdICon" onClick={() => handleDeleteProduct(index)} style={{ cursor: 'pointer' }}>
                    <CrossIcon />
                  </span>
                </div>

                <div className="product-toolbar-image-with-btn">
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
                          setActiveProduct(updatedActiveProduct);
                          setTimeout(() => dispatch(setRendering()), 10);
                          setActiveThumbnail((prev) =>
                            prev.productIndex === index && prev.colorIndex === i
                              ? { productIndex: null, colorIndex: null }
                              : { productIndex: index, colorIndex: i }
                          );
                        }}
                      >
                        {activeThumbnail.productIndex === index && activeThumbnail.colorIndex === i && (
                          <div className="thumbnail-actions">
                            <span
                              className="crossProdIConofSingleProduct"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteColorThumbnail(index, i);
                              }}
                            >
                              <CrossIcon />
                            </span>

                            <button
                              className="toolbar-span"
                              style={{ '--indicator-color': getHexFromName(color?.name) }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setColorChangeTarget({ productIndex: index, colorIndex: i });
                              }}
                            >
                              Change
                            </button>
                          </div>
                        )}
                        <div className="img-thumbnaill-container">
                          <img src={imgSrc} className="product-mini-img" alt={color.name} title={color.name} />
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                              return sizeOpt?.value
                                ? { size: sizeOpt.value, variantId: variant.id }
                                : null;
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
                          setColorChangeTarget({ productIndex: null, colorIndex: null });
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

          <button className="add-product-btn" onClick={addProductPopup}>
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
