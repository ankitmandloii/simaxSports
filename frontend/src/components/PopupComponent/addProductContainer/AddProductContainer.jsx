import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import styles from './AddProductContainer.module.css';
import { getHexFromName } from "../../utils/colorUtils";
import colorwheel1 from "../../images/color-wheel1.png";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCloudyNight } from "react-icons/io5";

const AddProductContainer = ({ isOpen, onClose, onProductSelect, openChangeProductPopup }) => {
  const { list: rawProducts, loading, error } = useSelector((state) => state.products);
  const selectedProduct = useSelector((state) => state.selectedProducts.selectedProducts);

  const [products, setProducts] = useState([]);
  const [productStates, setProductStates] = useState({});
  const [imageLoadStates, setImageLoadStates] = useState({});
  console.log("-----------------prodd", products);
  useEffect(() => {
    if (rawProducts.length > 0) {
      const productsWithKeys = rawProducts.map((product) => ({
        ...product,
        productKey: product.id || uuidv4(),
      }));
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
          img.src = color.img;
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
      // alert("Product already selected");
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
    updateProductState(productKey, { selectedColor: color, hoverImage: color.img });
  };

  const handleAddProduct = (e, product, productKey) => {
    e.stopPropagation();
    const state = productStates[productKey];
    if (!state.selectedColor) return;

    onProductSelect({ ...product, selectedColor: state.selectedColor });

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
            const displayImage = state.hoverImage || imgurl;
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
                            return (
                              <span
                                key={`${productKey}-${color.name}`}
                                title={color.name}
                                className={`color-swatch ${isSelected ? "selected" : ""}`}
                                style={{
                                  backgroundColor: getHexFromName(color.name),
                                  cursor: "pointer",
                                  padding: 10,
                                  margin: 5,
                                  borderRadius: "20%",
                                  display: "inline-block",
                                  border: isSelected ? "2px solid black" : "1px solid gray",
                                }}
                                onMouseEnter={() => updateProductState(productKey, { hoverImage: color.img })}
                                onMouseLeave={() => updateProductState(productKey, { hoverImage: null })}
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
