import React, { useEffect, useState } from 'react';
import miniProd from '../../images/mini-prod.png';
import style from './QuantityToolbar.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct,
  updateSizeQuantity
} from '../../../redux/productSelectionSlice/productSelectionSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const QuantityToolbar = () => {
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  const productState = useSelector((state) => state.productSelection.products);
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.present["back"].nameAndNumberProductList);
  console.log("nameAndNumberProductList", nameAndNumberProductList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setAllProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [licenses, setLicenses] = useState({
    collegiate: false,
    greek: false,
  });

  const handleQuantityChange = (productId, size, value) => {
    dispatch(updateSizeQuantity({
      productId,
      size,
      quantity: parseInt(value) || 0
    }));
  };

  const toggleProductExpansion = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  useEffect(() => {
    //update when product state change
  }, [productState])

  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const newAllProducts = [];
    function getVariantImagesFromMetafields(metafieldss) {
      console.log("metafieldss.....", metafieldss)
      // const defaultImage = activeProduct?.imgurl || '';

      let front = null;
      let back = null;
      let sleeve = null;

      try {
        const metafields = metafieldss?.edges || [];
        const variantImagesField = metafields.find(
          (edge) => edge?.node?.key === 'variant_images'
        )?.node?.value;

        if (variantImagesField) {
          const parsedImages = JSON.parse(variantImagesField);
          console.log(parsedImages, "parsedImages");

          front = parsedImages.find((img) => img.includes('_f_fl')) || null;
          back = parsedImages.find((img) => img.includes('_b_fl')) || null;
          sleeve = parsedImages.find((img) => img.includes('_d_fl')) || null;
        }
      } catch (error) {
        console.error('Error parsing variant_images metafield:', error);
      }

      return [front, back, sleeve];
    }


    function getSizeCountFromNameNumberState(id) {
      // selections[size] = quantity;
      const sizeCount = nameAndNumberProductList.find((product) => product.id == id).sizeCount;
      return sizeCount;
    }

    selectedProducts.forEach((product) => {
      console.log("product.............", product)
      const addedColors = product.addedColors || [];
      const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

      const extraProducts = addedColors.map((variantProduct) => {
        console.log("variants......", variantProduct);
        const prod = {
          id: variantProduct?.variant?.id?.split("/").reverse()[0],
          imgurl: variantProduct?.img,
          color: variantProduct?.name,
          size: variantProduct?.variant?.selectedOptions[1]?.value,
          sizes: variantProduct?.sizes,
          name: product?.name,
          title: consistentTitle,
          sku: variantProduct?.variant?.sku,
          variantId: variantProduct?.variant?.id,
          allImages: getVariantImagesFromMetafields(variantProduct?.variant?.metafields),
          selections: [],
          price: variantProduct?.variant?.price,
          allVariants: variantProduct?.allVariants,
          inventory_quantity: variantProduct?.variant?.inventoryItem?.inventoryLevels?.edges?.[0]?.node?.quantities?.[0]?.quantity
        };
        console.log("prod", prod)
        dispatch(addProduct(prod));
        return prod;
      });
      const id = product.id.split("/").reverse()[0];
      const sizes = getSizeOptions(product)
      const mainProduct = {
        name: product.name || product.title,
        id: id,
        imgurl: product?.imgurl,
        color: product?.selectedColor?.name,
        size: product.selectedColor?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(product),
        title: consistentTitle,
        selections: [],
        allImages: getVariantImagesFromMetafields(product?.selectedColor?.variant?.metafields),
        allVariants: product?.allVariants,
      };
      console.log("mainProduct..", mainProduct);


      dispatch(addProduct(mainProduct));
      newAllProducts.push(mainProduct, ...extraProducts);
    });

    setAllProducts(newAllProducts);
    nameAndNumberProductList.forEach((product) => {
      const availableSizes = product.sizeCount || {};
      const allSizes = product.sizes || [];

      if (Object.keys(availableSizes).length > 0) {
        console.log(" // Step 1: Update available sizes with actual values")
        for (let [size, value] of Object.entries(availableSizes)) {
          handleQuantityChange(product.id, size, value);
        }

        console.log("// Step 2: Set remaining sizes to 0");
        allSizes.forEach(size => {
          if (!(size.size in availableSizes)) {
            console.log("size is set to zero ", size);
            handleQuantityChange(product.id, size.size, 0);
          }
        });
      } else {
        console.log(" // No sizeCount data — set all sizes to 0");

        allSizes.forEach(size => {
          handleQuantityChange(product.id, size.size, 0);
        });
      }
    });

  }, [selectedProducts, nameAndNumberProductList]);

  // const getSizeOptions = (product) => {
  //   if (product?.allVariants?.length) {
  //     const sizeVariantPairs = product?.allVariants.flatMap((variant) => {
  //       const sizeOption = variant?.selectedOptions.find((opt) => opt.name === 'Size');
  //       return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
  //     });
  //     return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
  //   }

  //   if (product?.variants?.edges?.length) {
  //     const sizeVariantPairs = product?.variants.edges.flatMap(({ node }) => {
  //       const sizeOption = node?.selectedOptions.find((opt) => opt.name === 'Size');
  //       return sizeOption ? [{ size: sizeOption.value, variantId: node.id }] : [];
  //     });
  //     return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
  //   }

  //   return [];
  // };
  const getSizeOptions = (product) => {
    console.log("product under getSize optinns  ", product)
    const extractAvailableSizeVariants = (variants, accessor = (v) => v) => {
      const sizeVariantPairs = variants.flatMap((variantWrapper) => {
        const variant = accessor(variantWrapper);
        const sizeOption = variant?.selectedOptions?.find((opt) => opt.name === 'Size');

        const inventoryQty = variant?.inventoryItem?.inventoryLevels?.edges?.[0]?.node?.quantities?.[0]?.quantity || 0;
        console.log("inventoryQty", inventoryQty)

        if (sizeOption && inventoryQty > 0) {
          return [{
            size: sizeOption.value,
            variantId: variant.id,
            quantity: inventoryQty
          }];
        }

        return [];
      });

      // Remove duplicate sizes (only keep the first available one)
      return Array.from(new Map(sizeVariantPairs.map(item => [item.size, item])).values());
    };

    if (product?.allVariants?.length) {
      return extractAvailableSizeVariants(product.allVariants);
    }


    return [];
  };

  const getAvailableSizesAndQuantity = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.map(item => item);
    }
    return product.name?.toLowerCase().includes('women') ? womenSizes : adultSizes;
  };

  const getTotalQuantityForProduct = (product) => {
    if (!productState[product.id]) return 0;
    return Object.values(productState[product.id].selections).reduce((sum, qty) => sum + qty, 0);
  };


  function calculatePrice() {
    const shouldRedirectToReview = (productState) => {
      return Object.values(productState).some((product) => {
        return Object.values(product.selections || {}).some(quantity => quantity >= 1);
      });
    };
    if (shouldRedirectToReview(productState)) {
      // Redirect to Review page
      navigate("/review");
    }
    else {
      toast.warn("A minimum quantity of 1 is required.");
    }


  }
  return (
    <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>
      <div className='toolbar-main-heading'>
        <h5 className='Toolbar-badge'>Quantity And Sizes</h5>
        <h2>How Many Do You Need?</h2>
        <p>Enter quantities to calculate the price. Save money by increasing quantity and reducing ink colors in your design.</p>
      </div>

      <div className={style.toolbarBox}>
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
                    src={product.imgurl || miniProd}
                    className={style.productMiniImg}
                    alt='product'
                  />
                </div>
                <div className={style.rightProductQtyTitle}>
                  <h4>{product.title}</h4>
                  <div className={style.rightProductTitleQty}>
                    {product.color && <p className={style.toolbarSpan}>{product.color}</p>}
                    <p className={style.totalQtyitems}>{getTotalQuantityForProduct(product)} items</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedProducts[product.id] && (
              <div className={style.sizeSection}>
                <div className={style.sizeGroup}>
                  <h5>Available Sizes</h5>
                  <div className={style.sizeInputs}>
                    {getAvailableSizesAndQuantity(product).map(item => (
                      <div className={style.sizeBox} key={`${product.id}-${item.size}`}>
                        <label>{item.size}</label>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={productState[product.id]?.selections?.[item.size] || ''}
                          onChange={(e) => {
                            if (e.target.value > item.quantity) return;
                            handleQuantityChange(product.id, item.size, e.target.value)
                          }
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

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
        </div>

        <button className={style.calculateBtn} onClick={() => calculatePrice()}>CALCULATE PRICING</button>
      </div>
    </div>
  );
};

export default QuantityToolbar;
