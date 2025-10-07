
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import styles from './AddProductContainer.module.css';
import colorwheel1 from "../../images/color-wheel1.png";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ColorSwatchPlaceholder from "../../CommonComponent/ColorSwatchPlaceholder.jsx/ColorSwatchPlaceholder";
import { IoMdSearch } from "react-icons/io";
// import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon';
import CloseButton from "../../CommonComponent/CrossIconCommon/CrossIcon";


const AddProductContainer = ({ isOpen, onClose, onProductSelect, openChangeProductPopup }) => {
  const { list: rawProducts, loading, error } = useSelector((state) => state.products);
  const selectedProduct = useSelector((state) => state.selectedProducts.selectedProducts);

  const [products, setProducts] = useState([]);
  const [productStates, setProductStates] = useState({});
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [swatchLoaded, setSwatchLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [searchError, setSearchError] = useState(null);
  // console.log("waaaaaaaa", rawProducts)

  // Fetch products from API based on search query
  // Fetch products from API based on search query
  // Fetch products from API based on search query
  const fetchProducts = async (query) => {
    if (!query) {
      setProducts(rawProducts);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`${BASE_URL}products/search?query=${encodeURIComponent(query)}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      const items = data?.result?.items || [];
      if (items.length === 0) {
        setProducts([]);
        setSearchError(null); // no error, just empty
        setSearchLoading(false);
        return;
      }

      const productsWithKeys = items.map((product) => {
        const variants = product.variants?.edges?.map((v) => v.node) || [];
        const productImages = product.images?.edges?.map((imgEdge) => imgEdge.node.originalSrc) || [];
        const productID = product.id;

        // Build color → image mapping
        const colorMap = {};
        variants.forEach((variant) => {
          const color = variant.selectedOptions?.find((opt) => opt.name === 'Color')?.value;

          // Extract custom image from metafields (variant_images)
          const metafield = variant.metafields?.edges?.find(
            (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
          );

          let customImage = '';
          let swatchImage = '';
          if (metafield) {
            try {
              const parsed = JSON.parse(metafield.node.value);
              if (Array.isArray(parsed)) {
                // Use first image for general color image
                customImage = parsed[0]?.src || parsed[0] || '';
                // Select swatch image based on filename patterns
                const colorNameLower = color?.toLowerCase().replace(/\s+/g, '') || '';
                swatchImage = parsed.find(img =>
                  img.includes('38307_fm') ||
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
              swatchImg: swatchImage || variant.image?.originalSrc || productImages[0] || '',
              img: customImage || variant.image?.originalSrc || productImages[0] || '',
              variant,
            };
          }
        });

        return {
          name: product?.title,
          vendor: product?.vendor,
          handle: product?.handle,
          imgurl: variants[0]?.image?.originalSrc || productImages[0] || '',
          images: productImages,
          colors: Object.values(colorMap),
          allVariants: variants,
          id: productID,
          productKey: productID || uuidv4(),
        };
      });

      // Update products state
      setProducts(productsWithKeys);

      // Initialize productStates for fetched products
      const initialStates = Object.fromEntries(
        productsWithKeys.map((p) => [
          p.productKey,
          { isPopupOpen: false, selectedColor: null, hoverImage: null },
        ])
      );
      setProductStates(initialStates);

      setSearchError(null);
    } catch (err) {
      setSearchError(err.message);
      toast.error('Failed to search products');
    } finally {
      setSearchLoading(false);
    }
  };

  // Existing useEffect hook (unchanged)
  useEffect(() => {
    if (rawProducts.length > 0 && !searchQuery) {
      const productsWithKeys = rawProducts.map((product) => {
        const variants = product.allVariants || [];
        const productImages = product.images || [];
        const productID = product.id;

        // Build color → image mapping
        const colorMap = {};
        variants.forEach((variant) => {
          const color = variant.selectedOptions?.find((opt) => opt.name === 'Color')?.value;

          // Extract custom image from metafields (variant_images)
          const metafield = variant.metafields?.edges?.find(
            (edge) => edge.node.key === 'variant_images' && edge.node.namespace === 'custom'
          );

          let customImage = '';
          let swatchImage = '';
          if (metafield) {
            try {
              const parsed = JSON.parse(metafield.node.value);
              if (Array.isArray(parsed)) {
                // Use first image for general color image
                customImage = parsed[0]?.src || parsed[0] || '';
                // Select swatch image based on filename patterns
                const colorNameLower = color?.toLowerCase().replace(/\s+/g, '') || '';
                swatchImage = parsed.find(img =>
                  img.includes('38307_fm') ||
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
              swatchImg: swatchImage || variant.image?.originalSrc || productImages[0] || '',
              img: customImage || variant.image?.originalSrc || productImages[0] || '',
              variant,
            };
          }
        });

        return {
          name: product?.name,
          vendor: product?.vendor,
          imgurl: variants[0]?.image?.originalSrc || productImages[0] || '',
          images: productImages,
          colors: Object.values(colorMap),
          allVariants: variants,
          id: productID,
          productKey: productID || uuidv4(),
          handle: product?.handle,
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
  }, [rawProducts, searchQuery]);

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

    onProductSelect({
      ...product,
      selectedColor: {
        name: state.selectedColor.name,
        swatchImg: state.selectedColor.swatchImg,
        img: state.selectedColor.img,
        variant: state.selectedColor.variant,
      },
      selectedImage: state.selectedColor.img,
      imgurl: state.selectedColor.img,
    });

    updateProductState(productKey, {
      isPopupOpen: false,
      hoverImage: null,
      selectedColor: null,
    });

    onClose();
  };

  const handleSearch = () => {
    fetchProducts(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.heading}>Add Product</h3>

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button className={styles.searchIcon} onClick={handleSearch}>
              <IoMdSearch />
            </button>
          </div>

          {/* <button onClick={onClose} className={styles.modalClose}>
            &times;
          </button> */}
          <CloseButton onClose={onClose} />
        </div>
        <div className={styles.modalContentInner}>

          {/* <hr className={styles.hrUnderline} /> */}

          {loading || searchLoading ? (
            <div className={styles.loaderWrapper}>
              <div className="loader" /> {/* Your existing CSS spinner */}
            </div>
          ) : (
            <>
              {/* <p className={styles.paraaa}> Select From Our Most Popular Products</p> */}

              {error || searchError ? (
                <p style={{ color: "red" }}>{error || searchError}</p>
              ) : products.length === 0 && searchQuery ? (
                <p style={{ color: "gray", textAlign: 'center', fontSize: '1rem', marginTop: '3rem', marginBottom: '3rem' }}>No matching products found.</p>
              ) : products.length === 0 && !searchQuery ? (
                <p style={{ color: "gray" }}>No products available.</p>
              ) : (
                <ul className={styles.productList}>
                  {products.map((product) => {
                    const { productKey, name, colors = [], imgurl, vendor } = product;
                    // console.log("-------vendor", product)
                    const state = productStates[productKey] || {};
                    const displayImage =
                      state.selectedColor?.img || state.hoverImage || imgurl;
                    const imageLoaded = imageLoadStates[productKey];
                    const isAlreadySelected = selectedProduct.some(
                      (p) => p.id === product.id
                    );

                    return (
                      <li key={productKey} className={styles.modalProduct}>
                        <div
                          className={styles.productMain}
                          onClick={(e) =>
                            toggleColorPopup(e, productKey, product)
                          }
                        >
                          <div className={styles.imageWrapper}>
                            {!imageLoaded && (
                              <div className={styles.imagePlaceholder}></div>
                            )}
                            <img
                              src={displayImage}
                              alt={name}
                              loading="lazy"
                              className={`${styles.modalProductImg} ${imageLoaded ? styles.visible : styles.hidden
                                }`}
                              onLoad={() => handleImageLoad(productKey)}
                            />
                          </div>
                          <p className={styles.vendorspan}>{vendor}</p>
                          <p className={styles.addProductPara}>{name}</p>
                        </div>

                        {colors.length > 0 && (
                          <div
                            className={styles.modalProductColorContainer}
                            onClick={(e) =>
                              toggleColorPopup(e, productKey, product)
                            }
                          >
                            <img
                              src={colorwheel1}
                              alt="colors"
                              className={styles.modalProductColorImg}
                            />
                            <p>{colors.length} Colors</p>

                            {state.isPopupOpen && (
                              <div className={styles.colorPopup}>
                                <div className={styles.colorPopupHeader}>
                                  <button
                                    className={styles.closePopupBtn}
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
                                  {colors.map((color) => {
                                    const isSelected = state.selectedColor?.name === color.name;
                                    const swatchImage = color.swatchImg;

                                    return (
                                      <React.Fragment key={`${productKey}-${color.name}`}>
                                        {!swatchLoaded && <ColorSwatchPlaceholder size={30} />}
                                        <img
                                          src={swatchImage}
                                          alt={color.name}
                                          title={color.name}
                                          className={`color-swatch ${isSelected ? "selected" : ""}`}
                                          style={{
                                            display: swatchLoaded ? "inline-block" : "none",
                                          }}
                                          onLoad={() => setSwatchLoaded(true)}
                                          onMouseEnter={() => {
                                            if (!state.selectedColor) {
                                              updateProductState(productKey, { hoverImage: color.img });
                                            }
                                          }}
                                          onMouseLeave={() => {
                                            if (!state.selectedColor) {
                                              updateProductState(productKey, { hoverImage: null });
                                            }
                                          }}
                                          onClick={(e) => handleColorSelect(e, productKey, color)}
                                        />
                                      </React.Fragment>
                                    );
                                  })}
                                </div>


                                <div className={styles.popupActions}>
                                  <button
                                    className={styles.addProductBtnPopup}
                                    onClick={(e) =>
                                      handleAddProduct(e, product, productKey)
                                    }
                                    disabled={
                                      !state.selectedColor || isAlreadySelected
                                    }
                                  >
                                    {isAlreadySelected
                                      ? "Product Already Selected"
                                      : "Add Product"}
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
              )}

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
            </>
          )}
        </div>
      </div>
    </div>
  );

};

export default AddProductContainer;