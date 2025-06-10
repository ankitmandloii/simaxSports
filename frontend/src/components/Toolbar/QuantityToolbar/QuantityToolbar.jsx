import React, { useState } from 'react';
import miniProd from '../../images/mini-prod.png';
import style from './QuantityToolbar.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const QuantityToolbar = () => {
  const [quantities, setQuantities] = useState({});
  const [licenses, setLicenses] = useState({
    collegiate: false,
    greek: false,
  });

  const [isExpanded, setIsExpanded] = useState(true); // Toggle state

  const handleQuantityChange = (category, size, value) => {
    const key = `${category}-${size}`;
    setQuantities(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>

      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Quantity And Sizes</h5>
        <h2>How Many Do You Need?</h2>
        <p>Enter quantities to calculate the price. Save money by increasing quantity and reducing ink colors in your design.</p>
      </div>

      <div className={style.toolbarBox}>
        <div className="main-top-container">
          <div className="toolbar-box-top-content">
            <div className={style.quantityToolbarHead} onClick={toggleSection} style={{ cursor: 'pointer' }}>
              <div className={style.downArrow}>
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              <div className={style.miniProdImgContainer}>
                <img src={miniProd} className={style.productMiniImg} alt='product' />
              </div>
              <div>
                <h4>Essential Red T-Shirt for Men & Women</h4>
                <p className={style.toolbarSpan}>Red</p>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className={style.sizeSection}>
              <div className={style.sizeGroup}>
                <h5>Adult Sizes</h5>
                <div className={style.sizeInputs}>
                  {adultSizes.map(size => (
                    <div className={style.sizeBox} key={`adult-${size}`}>
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

              <div className={style.sizeGroup}>
                <h5>Womens Sizes</h5>
                <div className={style.sizeInputs}>
                  {womenSizes.map(size => (
                    <div className={style.sizeBox} key={`women-${size}`}>
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
          )}
        </div>

        <div className={style.licenseOptions}>
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

        <button className={style.calculateBtn}>CALCULATE PRICING</button>
      </div>
    </div>
  );
};

export default QuantityToolbar;
