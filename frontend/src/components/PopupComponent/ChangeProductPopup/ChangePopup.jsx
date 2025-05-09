import React, { useState, useEffect } from 'react';
import './ChangePopup.css';

const categories = [
  "beauty", "fragrances", "groceries", "home-decoration",
  "furniture", "tops", "womens-dresses", "mens-shirts"
];

const PRODUCTS_PER_PAGE = 10;

const ChangePopup = ({ onClose, onProductSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("beauty");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (category, skipCount = 0, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${category}?limit=${PRODUCTS_PER_PAGE}&skip=${skipCount}`);
      const data = await res.json();
      if (append) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products || []);
      }
      setHasMore(data.products.length === PRODUCTS_PER_PAGE);
    } catch (err) {
      //console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSkip(0);
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    const newSkip = skip + PRODUCTS_PER_PAGE;
    fetchProducts(selectedCategory, newSkip, true);
    setSkip(newSkip);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Change Your Products</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-content changProduct-popup">
          <div className="sidebar">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`sidebar-item ${cat === selectedCategory ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSkip(0);
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="product-grid">
            <div className="product-card-container">
              {loading && products.length === 0 ? (
                <p>Loading...</p>
              ) : products.length === 0 ? (
                <div className="no-products">No products found</div>
              ) : (
                products.map(product => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => onProductSelect(product)}
                  >
                    <img src={product.thumbnail} alt={product.title} />
                    <p>{product.title}</p>
                  </div>
                ))
              )}
            </div>
            {!loading && hasMore && (
              <button className="load-more" onClick={handleLoadMore}>LOAD MORE</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePopup;

