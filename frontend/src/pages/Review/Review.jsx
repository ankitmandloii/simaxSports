import React, { useEffect, useState } from 'react';
// import miniProd from '../../images/mini-prod.png';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import style from './Review.module.css';
const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const Review = () => {

  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const [products, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [expandedProducts, setExpandedProducts] = useState({});
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
  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // restore all selected products locally in product array state
  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const newAllProducts = [];

    selectedProducts.forEach((product) => {
      const addedColors = product.addedColors || [];
      const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

      const extraProducts = addedColors.map((variantProduct) => ({
        id: variantProduct?.variant?.id?.split("/")?.reverse()[0],
        imgurl: variantProduct?.img,
        color: variantProduct?.name,
        size: variantProduct?.variant?.selectedOptions[1]?.value,
        sizes: variantProduct?.sizes,
        name: product?.name,
        title: consistentTitle,
        selections: [],
      }));

      const mainProduct = {
        name: product.name || product.title,
        id: product.id.split("/").reverse()[0],
        imgurl: product?.imgurl,
        color: product?.selectedColor?.name,
        size: product.selectedColor?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(product), // assume this is a valid function in scope
        title: consistentTitle,
        selections: [],
      };
      // Add main product and its variants
      newAllProducts.push(mainProduct, ...extraProducts);
    });

    setAllProducts(newAllProducts);


  }, [selectedProducts]);


  // Function to get all  sizes of product
  const getSizeOptions = (product) => {
    // Case 1: Custom-structured product
    if (product?.allVariants?.length) {
      const sizeVariantPairs = product.allVariants.flatMap((variant) => {
        const sizeOption = variant.selectedOptions.find((opt) => opt.name === 'Size');
        return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
      });
      return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
    }

    // Case 2: Shopify-style structure
    if (product?.variants?.edges?.length) {
      const sizeVariantPairs = product.variants.edges.flatMap(({ node }) => {
        const sizeOption = node.selectedOptions.find((opt) => opt.name === 'Size');
        return sizeOption ? [{ size: sizeOption.value, variantId: node.id }] : [];
      });
      return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
    }

    return [];
  };

  // Function to get all available  sizes of product
  const getAvailableSizes = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.map(item => item.size);
    }
    return product.name?.toLowerCase().includes('women') ? womenSizes : adultSizes;
  };
  return (
    <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>

      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Review Your Order</h5>
        <h2>Your Product And Pricing <FaArrowRightLong /> </h2>
        <h3 className={style.reviewPriceheading}>$30.36 <span className={style.reviewPriceheadingSpan}>$24.56 each</span></h3>
      </div>

      <div className={style.toolbarBox}>
        <p>Summary (10 items)</p>
        {products.map((product) => (
          <div key={product.id} className="main-top-container">
            <div className="toolbar-box-top-content">
              <div
                className={style.quantityToolbarHead}
                onClick={() => toggleProductExpansion(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={style.downArrow}>
                  {expandedProducts[product.id] ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                <div className={style.miniProdImgContainer}>
                  <img
                    src={product.imgurl}
                    className={style.productMiniImg}
                    alt='product'
                  />
                </div>
                <div>
                  <h4>{product.title}</h4>
                  <div className={style.sizeBoxFlex}>
                    <p className={style.sizeTagSmallbox}>S-2</p>
                    <p className={style.sizeTagSmallbox}>M-2</p>
                    <p className={style.sizeTagSmallbox}>L-4</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedProducts[product.id] && (
              <div className={style.sizeSection}>
                <div className={style.sizeGroup}>
                  <h5>Available Sizes</h5>
                  <div className={style.sizeInputs}>
                    {getAvailableSizes(product).map(size => (
                      <div className={style.sizeBox} key={`${product.id}-${size}`}>
                        <label>{size}</label>
                        <input
                          type="number"
                          min="0"
                          value={quantities[`${product.id}-${size}`] || ''}
                          onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
            {expandedProducts[product.id] && (
              <div className={style.sizeSection}>
                <div className={style.sizeGroup}>
                  <h5>Women Sizes</h5>
                  <div className={style.sizeInputs}>
                    {getAvailableSizes(product).map(size => (
                      <div className={style.sizeBox} key={`${product.id}-${size}`}>
                        <label>{size}</label>
                        <input
                          type="number"
                          min="0"
                          value={quantities[`${product.id}-${size}`] || ''}
                          onChange={(e) => handleQuantityChange(product.id, size, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}

        <button className={style.calculateBtn}>ADD TO CART <FaArrowRightLong /></button>
        <div className={style.reviewBox}>

        </div>
      </div>
    </div>
  )
}

export default Review