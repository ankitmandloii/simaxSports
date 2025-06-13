import React, { useEffect, useState, useRef, useCallback } from 'react';
import ColorWheel from '../../images/color-wheel1.png';
import { getHexFromName } from '../../utils/colorUtils';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { toast } from 'react-toastify';
import style from './CollectionProductPopup.module.css';

const CollectionProductPopup = ({ collectionId, onProductSelect, onClose }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const popupRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [selectedVariantImage, setSelectedVariantImage] = useState({});
  const [selectedColorByProduct, setSelectedColorByProduct] = useState({});
  const [hoverImage, setHoverImage] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const [selectedProductColors, setSelectedProductColors] = useState(null);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultCollectionId = 'gid://shopify/Collection/450005106927';
  const effectiveCollectionId = collectionId || defaultCollectionId;
  const numericId = effectiveCollectionId.split('/').pop();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedProductColors(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    resetState();
    fetchProducts();
  }, [collectionId]);

  const resetState = () => {
    setProducts([]);
    setCursor('');
    setHasNextPage(false);
    setSelectedProductColors(null);
    setSelectedVariantImage({});
    setSelectedColorByProduct({});
    setHoverImage({});
    setImageLoaded({});
  };

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    if (!effectiveCollectionId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}products/collection/${numericId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50, cursor: isLoadMore ? cursor : '' }),
      });

      const data = await res.json();
      const edges = data?.result?.node?.products?.edges || [];
      const pageInfo = data?.result?.node?.products?.pageInfo;

      const newProducts = edges.map(edge => edge.node);
      setProducts(prev => isLoadMore ? [...prev, ...newProducts] : newProducts);
      setCursor(pageInfo?.endCursor || '');
      setHasNextPage(pageInfo?.hasNextPage || false);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, cursor, effectiveCollectionId, numericId]);

  const getFirstVariantImage = (product) =>
    product?.variants?.edges?.[0]?.node?.image?.originalSrc || '';

  const getUniqueColors = (product) => {
    const colorSet = new Set();
    product?.variants?.edges?.forEach(({ node }) => {
      const color = node.selectedOptions.find(opt => opt.name === 'Color')?.value;
      if (color) colorSet.add(color);
    });
    return [...colorSet];
  };

  const getVariantImageByColor = (product, color) => {
    const variant = product.variants.edges.find(({ node }) =>
      node.selectedOptions.some(opt => opt.name === 'Color' && opt.value === color)
    );
    return variant?.node?.image?.originalSrc || '';
  };

  const handleColorClick = (e, product, color) => {
    e.stopPropagation();
    const image = getVariantImageByColor(product, color);
    setSelectedColorByProduct(prev => ({ ...prev, [product.id]: color }));
    setSelectedVariantImage(prev => ({ ...prev, [product.id]: image }));
  };

  const handleImageLoad = (productId) => {
    setImageLoaded(prev => ({ ...prev, [productId]: true }));
  };

  const renderColorSwatches = (product) =>
    getUniqueColors(product).map((color, idx) => {
      const image = getVariantImageByColor(product, color);
      const isSelected = selectedColorByProduct[product.id] === color;

      return (
        <span
          key={idx}
          className={`color-swatch ${isSelected ? 'selected' : ''}`}
          style={{ backgroundColor: getHexFromName(color) }}
          title={color}
          onMouseEnter={() => setHoverImage(prev => ({ ...prev, [product.id]: image }))}
          onMouseLeave={() => setHoverImage(prev => ({ ...prev, [product.id]: '' }))}
          onClick={(e) => handleColorClick(e, product, color)}
        />
      );
    });

  const handleAddProduct = (e, product) => {
    e.stopPropagation();
    const selectedColor = selectedColorByProduct[product.id];
    const selectedImage = selectedVariantImage[product.id];

    if (!selectedColor) {
      toast.error("Please select a color before adding the product.");
      return;
    }

    onProductSelect?.({ ...product, selectedColor, selectedImage });
    onClose?.();
  };

  return (
    <div className={style.productPanel}>
      {!effectiveCollectionId ? (
        <p className={style.defaultCollectionPara}>Select a collection to view products.</p>
      ) : loading && products.length === 0 ? (
        <div className="loader" />
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className={style.productListCollection}>
            {products.map((product) => (
              <div
                key={product.id}
                className={style.modalProduct}
                onClick={() =>
                  setSelectedProductColors(
                    selectedProductColors === product.id ? null : product.id
                  )
                }
              >
                <div className={style.imgProContainer}>
                  <div className={style.imageWrapper}>
                    {!imageLoaded[product.id] && (
                      <div className={style.imagePlaceholder}>Loading...</div>
                    )}
                    <img
                      src={hoverImage[product.id] || getFirstVariantImage(product)}
                      alt={product.title}
                      className={`${style.modalProductcolorImg} ${imageLoaded[product.id] ? style.visible : style.hidden
                        }`}
                      onLoad={() => handleImageLoad(product.id)}
                    />
                  </div>
                </div>
                <p>{product.title}</p>
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
                          disabled={!selectedColorByProduct[product.id]}
                        >
                          Add Product
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
