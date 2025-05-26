import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "./AddProductContainer.css";
import colorwheel1 from "../../images/color-wheel1.png";
import { fetchProducts } from "../../../redux/ProductSlice/ProductSlice";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
const AddProductContainer = ({ isOpen, onClose, onProductSelect, openChangeProductPopup }) => {
  const dispatch = useDispatch();
  const { list: rawProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const [products, setProducts] = useState([]);
  const [productStates, setProductStates] = useState({});

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProducts());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (rawProducts.length > 0) {
      const productsWithKeys = rawProducts.map((product) => ({
        ...product,
        productKey: product.id || product.id || uuidv4(),
      }));
      setProducts(productsWithKeys);

      const states = {};
      productsWithKeys.forEach((product) => {
        states[product.productKey] = {
          isPopupOpen: false,
          selectedColor: null,  // will hold full color object now
          hoverImage: null,
        };
      });
      setProductStates(states);
    }
  }, [rawProducts]);

  if (!isOpen) return null;

  const updateProductState = (productKey, newState) => {
    setProductStates((prev) => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        ...newState,
      },
    }));
  };

  const handleColorWheelClick = (e, productKey) => {
    e.stopPropagation();
    const updatedStates = {};
    Object.keys(productStates).forEach((key) => {
      updatedStates[key] = {
        ...productStates[key],
        isPopupOpen: key === productKey ? !productStates[key].isPopupOpen : false,
        hoverImage: null,
      };
    });
    setProductStates(updatedStates);
  };

  const handleColorSelect = (e, productKey, color) => {
    e.stopPropagation();
    updateProductState(productKey, {
      selectedColor: color, // store full color object now
      hoverImage: color.img,
    });
  };

  return (
    <div className="addProduct-popup-mainContainer">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Add Product</h3>
            <button onClick={onClose} className="modal-close">
              &times;
            </button>
          </div>
          <hr />
          <p>Select From Our Most Popular Products</p>

          {loading && products.length === 0 && <div className="loader" />}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <ul className="product-list">
            {products.map((product) => {
              const productKey = product.productKey;
              const state = productStates[productKey] || {};
              const hasColors = product.colors?.length > 0;
              const displayImage = state.hoverImage || product.imgurl;

              return (
                <li key={productKey} className="modal-product">
                  <div className="product-main">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="modal-productimg"
                    />
                    <p>{product.name}</p>
                  </div>

                  {hasColors && (
                    <div className="modal-productcolor-container">
                      <img
                        src={colorwheel1}
                        alt="colors"
                        className="modal-productcolor-img"
                        onClick={(e) => handleColorWheelClick(e, productKey)}
                      />
                      <p>{product.colors.length} Colors</p>

                      {state.isPopupOpen && (
                        <div className="color-popup">
                          <div className="color-popup-header">
                            <button
                              className="close-popup-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateProductState(productKey, {
                                  isPopupOpen: false,
                                  hoverImage: null,
                                });
                              }}
                            >
                              <CrossIcon />
                            </button>
                          </div>

                          <div className="color-swatch-list">
                            {product.colors.map((color) => (
                              <span
                                key={`${productKey}-${color.name}`}
                                title={color.name}
                                className={`color-swatch ${state.selectedColor?.name === color.name
                                  ? "selected"
                                  : ""
                                  }`}
                                style={{
                                  backgroundColor: color.name,
                                  cursor: "pointer",
                                  padding: "10px",
                                  margin: "5px",
                                  borderRadius: "50%",
                                  display: "inline-block",
                                  border:
                                    state.selectedColor?.name === color.name
                                      ? "2px solid black"
                                      : "1px solid gray",
                                }}
                                onMouseEnter={() =>
                                  updateProductState(productKey, {
                                    hoverImage: color.img,
                                  })
                                }
                                onMouseLeave={() =>
                                  updateProductState(productKey, {
                                    hoverImage: null,
                                  })
                                }
                                onClick={(e) =>
                                  handleColorSelect(e, productKey, color)
                                }
                              />
                            ))}
                          </div>

                          <div className="popup-actions">
                            <button
                              className="add-product-btn-popup"
                              onClick={(e) => {
                                e.stopPropagation();

                                if (!state.selectedColor) return;

                                // Pass entire product with full colors & variants + selectedColor object
                                onProductSelect({
                                  ...product,
                                  selectedColor: state.selectedColor,
                                });

                                updateProductState(productKey, {
                                  isPopupOpen: false,
                                  hoverImage: null,
                                  selectedColor: null,
                                });
                                onClose();
                              }}
                              disabled={!state.selectedColor}
                            >
                              Add Product
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

          <div className="modal-allproductButtonContainer">
            <button
              className="modal-AllproductButton"
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
    </div>
  );
};

export default AddProductContainer;
