import React, { useState } from 'react';
import './ChangePopup.css';
import products from '../../product.js'; 

const categories = [
  "Soccer Apparel", "Basketball Apparel", "Volleyball Apparel",
  "Hockey Apparel", "Lacrosse Apparel", "Field Hockey",
  "Swimming Apparel"
];

const ChangePopup = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("Soccer Apparel");

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory
  );

  return (
    <div className="popup-overlay ">
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
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="product-grid">
            <div className="product-card-container">
            {filteredProducts.length === 0 ? (
    <div className="no-products">No products found</div>
  ) : (
    <>
      {filteredProducts.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.title} />
          <p>{product.title}</p>
        </div>
      ))}
     
    </>
    
  )}
            </div>

  <button className="load-more">LOAD MORE</button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ChangePopup;
