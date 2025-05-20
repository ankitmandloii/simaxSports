import React, { useEffect, useState, useRef } from 'react';
import './CollectionProductPopup.css';
import ColorWheel from '../../images/color-wheel1.png';
import { CrossIcon } from '../../iconsSvg/CustomIcon';

const CollectionProductPopup = ({ collectionId, onProductSelect, onClose }) => {
  console.log("collectionId", collectionId)
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [products, setProducts] = useState([]);
  const [selectedVariantImage, setSelectedVariantImage] = useState({});
  const [selectedColorByProduct, setSelectedColorByProduct] = useState({});

  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductColors, setSelectedProductColors] = useState(null);
  const [hoverImage, setHoverImage] = useState({});
  const popupRef = useRef(null);

  // const numericId = collectionId?.split('/').pop();
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

  const fetchProducts = async (isLoadMore = false) => {
    if (!effectiveCollectionId) return;
    setLoading(true);
    try {
      const res = await fetch(
        ` ${BASE_URL}products/collection/${numericId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: 10,
            cursor: isLoadMore ? cursor : '',
          }),
        }
      );
      const data = await res.json();
      if (data?.status && data?.result?.node?.products?.edges) {
        const newProducts = data.result.node.products.edges.map(edge => edge.node);
        const pageInfo = data.result.node.products.pageInfo;

        setProducts(prev => isLoadMore ? [...prev, ...newProducts] : newProducts);
        setCursor(pageInfo.endCursor);
        setHasNextPage(pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setCursor('');
    setHasNextPage(false);
    fetchProducts(false);
  }, [collectionId]);

  const getFirstVariantImage = (product) =>
    product?.variants?.edges?.[0]?.node?.image?.originalSrc || '';

  const getUniqueColors = (product) => {
    const colorSet = new Set();
    product?.variants?.edges?.forEach(variant => {
      const colorOption = variant.node.selectedOptions.find(opt => opt.name === 'Color');
      if (colorOption) colorSet.add(colorOption.value);
    });
    return [...colorSet];
  };

  return (
    <div className="product-panel">
      {!effectiveCollectionId ? (
        <p className='default-collection-para'>Select a collection to view products.</p>
      ) : loading && products.length === 0 ? (
        <div className="loader" />
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="product-list-collection">
            {products?.map((product) => (
              <div key={product.id} className="modal-product" onClick={() =>
                setSelectedProductColors(
                  selectedProductColors === product.id ? null : product.id
                )
              }>
                <div className="img-pro-container">
                  <img
                    src={hoverImage[product.id] || getFirstVariantImage(product)}
                    alt={product.title}
                    className="modal-productimg"
                  />
                </div>

                <p>{product.title}</p>
                <br />
                <div className="modal-productcolor-container">
                  <img
                    src={ColorWheel}
                    alt="colors"
                    className="modal-productcolor-img"
                    // onClick={() =>
                    //   setSelectedProductColors(
                    //     selectedProductColors === product.id ? null : product.id
                    //   )
                    // }
                    style={{ cursor: 'pointer' }}
                  />
                  <p>{getUniqueColors(product).length} Colors</p>

                  {selectedProductColors === product.id && (
                    <div className="color-popup" ref={popupRef}>
                      <div className="color-popup-header">
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

                      <div className="color-swatch-list">
                        {getUniqueColors(product).map((color, index) => {
                          const variant = product.variants.edges.find(v =>
                            v.node.selectedOptions.some(
                              o => o.name === 'Color' && o.value === color
                            )
                          );
                          const image = variant?.node?.image?.originalSrc;
                          return (
                            <span
                              key={index}
                              className={`color-swatch ${selectedColorByProduct[product.id] === color ? 'selected' : ''}`}
                              style={{ backgroundColor: color }}
                              title={color}
                              onMouseEnter={() =>
                                setHoverImage(prev => ({ ...prev, [product.id]: image }))
                              }
                              onMouseLeave={() =>
                                setHoverImage(prev => ({ ...prev, [product.id]: '' }))
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColorByProduct(prev => ({ ...prev, [product.id]: color }));
                                setSelectedVariantImage(prev => ({ ...prev, [product.id]: image }));
                              }}
                            />

                          );
                        })}
                      </div>

                      <div className="popup-actions">
                        <button
                          className="add-product-btn-popup"
                          onClick={(e) => {
                            e.stopPropagation();
                            const selectedColor = selectedColorByProduct[product.id];
                            const selectedImage = selectedVariantImage[product.id];

                            onProductSelect({
                              ...product,
                              selectedColor,
                              selectedImage
                            });
                            onClose();
                          }}
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
              className="load-more"
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
