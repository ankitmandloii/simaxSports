import React, { useEffect, useState } from 'react';
import miniProd from '../../images/mini-prod.png';
import style from './QuantityToolbar.module.css';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import {
  addProduct,
  resetProducts,
  setCollegiateLicense,
  updateSizeQuantity
} from '../../../redux/productSelectionSlice/productSelectionSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from "uuid";   // ✅ import uuid
import { LuArrowLeft } from 'react-icons/lu';
import { apiConnecter } from '../../utils/apiConnector.jsx';

const adultSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const womenSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const QuantityToolbar = () => {
  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  // console.log("--------quantitysele", selectedProducts);
  const productState = useSelector((state) => state.productSelection.products);
  // console.log("productState", productState)
  const CollegiateLicense = useSelector((state) => state.productSelection.CollegiateLicense);

  const nameAndNumberProductList = useSelector(
    (state) => state.TextFrontendDesignSlice.present["back"].nameAndNumberProductList
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setAllProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [licenses, setLicenses] = useState({
    collegiate: CollegiateLicense,
  });
  const [loading, setLoading] = useState(true)
  const [sizes, setSizes] = useState([]);
  const [availableSizesQuantity, setAvailableSizesQuantity] = useState([])

  /** 🔑 Every product gets its own random stable key */
  const getProductKey = (product) => product.uniqueKey;

  const handleQuantityChange = (productKey, size, value) => {
    dispatch(
      updateSizeQuantity({
        productId: productKey,
        size,
        quantity: parseInt(value) || 0,
      })
    );
  };

  const toggleProductExpansion = (product) => {
    const key = getProductKey(product);
    setExpandedProducts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!selectedProducts || selectedProducts?.length === 0) return;
    dispatch(resetProducts(selectedProducts))

    const newAllProducts = [];
    const newExpandedProducts = {};

    function getVariantImagesFromMetafields(metafieldss) {
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
          front = parsedImages.find((img) => img.includes('_f_fl')) || null;
          back = parsedImages.find((img) => img.includes('_b_fl')) || null;
          sleeve = parsedImages.find((img) => img.includes('_d_fl')) || null;
        }
      } catch (error) {
        console.error('Error parsing variant_images metafield:', error);
      }
      return [front, back, sleeve];
    }

    selectedProducts?.forEach((product) => {
      const addedColors = product?.addedColors || [];
      const consistentTitle =
        product?.title || product?.name || product?.handle || 'Product';

      // ✅ main product
      const id = product.id.split("/").reverse()[0];
      const mainProduct = {
        uniqueKey: uuidv4(),
        name: product.name || product.title,
        id: id,
        imgurl: product?.imgurl,
        color: product?.selectedColor?.name,
        size: product?.selectedColor?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(product, product?.selectedColor?.name),
        title: consistentTitle,
        selections: [],
        allImages: getVariantImagesFromMetafields(
          product?.selectedColor?.variant?.metafields
        ),
        allVariants: product?.allVariants,
        swatchImg: product?.selectedColor?.swatchImg,
      };
      console.log(mainProduct, "mainProduct");

      dispatch(addProduct(mainProduct));
      newAllProducts.push(mainProduct);
      newExpandedProducts[mainProduct.uniqueKey] = true;

      // ✅ extra variants
      const extraProducts = addedColors?.map((variantProduct) => {
        // console.log("----variantProduct", variantProduct)
        const prod = {
          uniqueKey: uuidv4(),
          id: variantProduct?.variant?.id?.split("/").reverse()[0],
          imgurl: variantProduct?.img,
          color: variantProduct?.name,
          size: variantProduct?.variant?.selectedOptions[1]?.value,
          sizes: getSizeOptions(variantProduct, variantProduct?.name),
          name: product?.name,
          title: consistentTitle,
          sku: variantProduct?.variant?.sku,
          variantId: variantProduct?.variant?.id,
          allImages: getVariantImagesFromMetafields(
            variantProduct?.variant?.metafields
          ),
          selections: [],
          price: variantProduct?.variant?.price,
          allVariants: variantProduct?.allVariants,
          swatchImg: variantProduct?.swatchImg,
          inventory_quantity:
            variantProduct?.variant?.inventoryItem?.inventoryLevels?.edges?.[0]
              ?.node?.quantities?.[0]?.quantity,
        };
        console.log(prod, "prod");

        dispatch(addProduct(prod));
        newExpandedProducts[prod.uniqueKey] = true;
        return prod;
      });

      newAllProducts.push(...extraProducts);
    });

    setAllProducts(newAllProducts);
    fetchSizes(newAllProducts);
    setExpandedProducts(newExpandedProducts);

    // ✅ Populate sizes from nameAndNumber state
    nameAndNumberProductList?.forEach((product) => {
      const availableSizes = product?.sizeCount || {};
      const allSizes = product?.sizes || [];

      if (Object.keys(availableSizes).length > 0) {
        for (let [size, value] of Object.entries(availableSizes)) {
          handleQuantityChange(product.id, size, value);
        }
        allSizes?.forEach((size) => {
          if (!(size.size in availableSizes)) {
            handleQuantityChange(product.id, size.size, 0);
          }
        });
      } else {
        allSizes?.forEach((size) => {
          handleQuantityChange(product.id, size.size, 0);
        });
      }
    });
  }, [selectedProducts, nameAndNumberProductList]);

  const getSizeOptions = (product, color) => {
    const extractAvailableSizeVariants = (variants, accessor = (v) => v) => {
      const sizeVariantPairs = variants.flatMap((variantWrapper) => {
        const variant = accessor(variantWrapper);
        // console.log("variant?.selectedOptions?", variant?.selectedOptions)
        const sizeOption = variant?.selectedOptions?.find(
          (opt) => opt.name === 'Size'
        );
        const inventoryQty =
          variant?.inventoryItem?.inventoryLevels?.edges?.[0]?.node
            ?.quantities?.[0]?.quantity || 0;
        // console.log("variant", variant, "inventoryQty", inventoryQty);
        if (sizeOption && variant?.selectedOptions?.[0].value == color && inventoryQty > 0) {
          return [
            {
              size: sizeOption.value,
              variantId: variant.id,
              quantity: inventoryQty,
              sku: variant.sku
            },
          ];
        }
        return [];
      });
      return Array.from(
        new Map(sizeVariantPairs.map((item) => [item.size, item])).values()
      );
    };

    if (product?.allVariants?.length) {
      return extractAvailableSizeVariants(product.allVariants);
    }
    return [];
  };

  const getAvailableSizesAndQuantity = (product) => {
    return product.sizes && product.sizes.length > 0
      ? product.sizes
      : [];
  };



  // const getTotalQuantityForProduct = (product) => {
  //   const key = getProductKey(product);
  //   if (!productState[key]) return 0;
  //   return Object.values(productState[key].selections).reduce(
  //     (sum, qty) => sum + qty,
  //     0
  //   );
  // };
  const getTotalQuantityForProduct = (product) => {
    if (!productState[product.id]) return 0;
    return Object.values(productState[product.id].selections).reduce((sum, qty) => sum + qty, 0);
  };

  function calculatePrice() {
    const shouldRedirectToReview = (productState) => {
      return Object.values(productState).some((product) => {
        return Object.values(product.selections || {}).some(
          (quantity) => quantity >= 1
        );
      });
    };
    dispatch(setCollegiateLicense(licenses.collegiate));
    if (shouldRedirectToReview(productState)) {
      navigate("/review");
    } else {
      toast.warn("A minimum quantity of 1 is required.");
    }
  }
  const goBack = () => {
    navigate('/design/product');
  }


  const getAvailableSizesAndQuantityFromSAndS = async (product) => {
    try {

      const response = await apiConnecter("post", "products/inventoryCheckavailabilitySS", product);
      const { result } = await response.data;
      return result;
    } catch (err) {
      console.error("Error fetching available sizes:", err);
      return [];
    }
  };

  const fetchSizes = async (products) => {
    const prod = products.flatMap((products) => {
      return products.sizes.map(size => { return { sku: size.sku, "qty": 0 } })
      // return products
    })
    // console.log("prod before calling", prod)
    if (prod.size == 0) return;
    setLoading(true);
    try {
      const result = await getAvailableSizesAndQuantityFromSAndS(prod);
      // setSizes(result);
      setAvailableSizesQuantity(result)
      console.log("prod", result)
    }
    catch (err) {
      console.log("getting error while fetching the quantity ")
    } finally {
      setLoading(false);
    }

  };

  function getMaxAvaibleQuantity(item) {
    return availableSizesQuantity.find((i) => i.sku == item.sku)?.total_available ?? 0
  }

  return (
    <div className={` ${style.toolbarMainContainer} ${style.toolbarMargin}`}>
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Quantity And Sizes</h5>
        <div className={style.quantityHead}>
          <span className={style.arrow} onClick={goBack}>
            <LuArrowLeft />
          </span>
          <h2>How Many Do You Need?</h2>


        </div>
        <p>
          Enter quantities to calculate the price. Save money by increasing
          quantity and reducing ink colors in your design.
        </p>
      </div>

      <div className={style.toolbarBox}>

        {
          loading ? <div className={style.loaderWrapper}>
            <div className={style.loader}></div>
            <p>Loading available sizes.....</p>:
          </div> :
            <>{products.map((product) => {
              const key = getProductKey(product);
              return (
                <div key={key} className="main-top-container">
                  <div className="toolbar-box-top-content">
                    <div
                      className={style.quantityToolbarHead}
                      onClick={() => toggleProductExpansion(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={style.downArrow}>
                        {expandedProducts[key] ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      <div className={style.miniProdImgContainer}>
                        <img
                          src={product.imgurl || miniProd}
                          className={style.productMiniImg}
                          alt="product"
                        />
                      </div>
                      <div className={style.rightProductQtyTitle}>
                        <h4>{product.title}</h4>
                        <div className={style.rightProductTitleQty}>
                          {product.color && (
                            // <p className={style.toolbarSpan}>{product.color}</p>
                            <button
                              className={style.toolbarSpan}

                            >
                              <img
                                src={product?.swatchImg || product?.img}
                                alt={product?.color}
                                className={style.swatchImage}
                              />
                              {product.color}
                            </button>
                          )}
                          <p className={style.totalQtyitems}>
                            {getTotalQuantityForProduct(product)} items
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedProducts[key] && (
                    <div className={style.sizeSection}>
                      <div className={style.sizeGroup}>
                        <h5>Available Sizes</h5>
                        <div className={style.sizeInputs}>
                          {getAvailableSizesAndQuantity(product).map((item) => (
                            <div
                              className={style.sizeBox}
                              key={`${key}-${item.size}`}
                            >
                              <label>{item.size}</label>
                              {/* <input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={
                              productState[key]?.selections?.[item.size] || ""
                            }
                            onChange={(e) => {
                              if (e.target.value > item.quantity) return;
                              handleQuantityChange(
                                key,
                                item.size,
                                e.target.value
                              ); */}
                              <input
                                type="number"
                                min={0} // 👈 start from 1, not 0
                                max={getMaxAvaibleQuantity(item)}
                                value={productState[product.id]?.selections?.[item.size] || ''}
                                onChange={(e) => {
                                  let val = Number(e.target.value);

                                  if (isNaN(val) || val < 0) {
                                    e.target.value = 0;
                                    handleQuantityChange(product.id, item.size, 0);
                                    return;
                                  }; // ignore invalid input
                                  if (val <= getMaxAvaibleQuantity(item)) {
                                    handleQuantityChange(product.id, item.size, val);
                                    // e.target.value = 0;
                                    return
                                  }
                                }}
                              />
                            </div>
                          ))}

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}</>
        }

        {!loading && <>
          <div className={style.licenseOptions}>
            <label>
              <input
                type="checkbox"
                style={{ marginRight: "5px" }}
                checked={licenses.collegiate}
                onChange={(e) => {
                  setLicenses((prev) => ({
                    ...prev,
                    collegiate: !prev.collegiate,
                  }));
                  if (e.target.checked) {
                    toast.info(
                      "This item is officially licensed by Simax Design, ensuring it's the genuine article."
                    );
                  }
                }}
              />
              Collegiate License(Has college name in design)
            </label>
          </div>
          <button
            className={style.calculateBtn}
            onClick={() => calculatePrice()}
          >
            CALCULATE PRICING
          </button></>
        }
      </div>
    </div>
  );
};

export default QuantityToolbar;
