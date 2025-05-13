import React, { useState } from 'react'
import './QuantityToolbar.css'
import { IoAdd } from "react-icons/io5"
import { RxCross1 } from "react-icons/rx"
import miniProd from '../../images/mini-prod.png'

const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const QuantityToolbar = () => {
  const [quantities, setQuantities] = useState({});
  const [licenses, setLicenses] = useState({
    collegiate: false,
    greek: false,
  });

  const handleQuantityChange = (category, size, value) => {
    const key = `${category}-${size}`;
    setQuantities(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="toolbar-main-container quantity-toolbar">
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Quantity And Sizes</h5>
        <h2>How Many Do You Need?</h2>
        <p>Enter quantities to calculate the price. Save money by increasing quantity and reducing ink colors in your design.</p>
      </div>

      <div className="toolbar-box">
        <div className="main-top-container">
          <div className="toolbar-box-top-content">
            <div className="toolbar-head">
              <div className="mini-prod-img-container">
                <img src={miniProd} className='product-mini-img' />
              </div>
              <div>
                <h4>Essential Red T-Shirt for Men & Women</h4>
                <p className='toolbar-span'>Red</p>
              </div>
            </div>
          </div>

          <div className="size-section">
            <div className="size-group">
              <h5>Adult Sizes</h5>
              <div className="size-inputs">
                {adultSizes.map(size => (
                  <div className="size-box" key={`adult-${size}`}>
                    <label>{size}</label>
                    <input
                      type="text"
                      min="0"
                      value={quantities[`adult-${size}`] || ''}
                      onChange={(e) => handleQuantityChange('adult', size, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="size-group">
              <h5>Womens Sizes</h5>
              <div className="size-inputs">
                {womenSizes.map(size => (
                  <div className="size-box" key={`women-${size}`}>
                    <label>{size}</label>
                    <input
                      type="text"
                      min="0"
                      value={quantities[`women-${size}`] || ''}
                      onChange={(e) => handleQuantityChange('women', size, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="license-options">
          <label>
            <input
              type="checkbox"
              style={{ marginRight: "5px" }}
              checked={licenses.collegiate}
              onChange={() => setLicenses(prev => ({ ...prev, collegiate: !prev.collegiate }))}
            />
            Collegiate License (Has college name in design)
          </label>
          <label>
            <input
              type="checkbox"
              style={{ marginRight: "5px" }}
              checked={licenses.greek}
              onChange={() => setLicenses(prev => ({ ...prev, greek: !prev.greek }))}
            />
            Greek License (Has greek organization in design)
          </label>
        </div>

        <button className="calculate-btn">CALCULATE PRICING</button>
      </div>
    </div>
  );
};

export default QuantityToolbar;
