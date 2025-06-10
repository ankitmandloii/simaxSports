import React, { useState, useEffect } from 'react';
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import styles from './AddNamesPopup.module.css'

import { useDispatch, useSelector } from 'react-redux';
import { addNameAndNumberProduct, removeNameAndNumberProduct, setActiveSide, setAddName, setAddNumber, updateNameAndNumberDesignState, UpdateNameAndNumberProduct } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { getHexFromName } from '../../utils/colorUtils.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNamesPopup = ({ showAddnamesPopupHAndler, previewSelectionByProduct, setPreviewSelectionByProduct }) => {
  const activeSide = "front";
  const currentProductId = useSelector((state) => state.TextFrontendDesignSlice.currentProductId);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);

  // console.log("currentProductId",currentProductId);
  // Safely access product state
  const productState = useSelector(
    (state) => state.TextFrontendDesignSlice.products?.[currentProductId]
  );
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.products?.[currentProductId].present[activeSide].nameAndNumberProductList);

  const allNameAndNumberLists = useSelector((state) => {
    const products = state.TextFrontendDesignSlice.products || {};
    const side = "front";

    return Object.entries(products).reduce((acc, [productId, productData]) => {
      const list = productData.present?.[side]?.nameAndNumberProductList || [];
      acc[productId] = list;
      return acc;
    }, {});
  });


  console.log(nameAndNumberProductList, "nameAndNumberProductList single");
  console.log(allNameAndNumberLists, "allNameAndNumberLists")




  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  console.log(selectedProducts);

  const [allProducts, setAllProducts] = useState(nameAndNumberProductList);


  const nameAndNumberDesign = productState?.present?.[activeSide]?.nameAndNumberDesignState;
  const textContaintObject = productState?.present?.[activeSide]?.texts || [];
  const isRender = productState?.present?.[activeSide]?.setRendering;
  const selectedTextId = productState?.present?.[activeSide]?.selectedTextId;

  // console.log(nameAndNumberProductList, "nameAndNumberProductList")

  const dispatch = useDispatch();

  const getObjectTypeData = (data) => {
    if (!data) return {};

    const obj = {};
    data.forEach(product => {
      obj[product.id] = product.selections;
    });

    return obj;
  };

  const [rowsByKey, setRowsByKey] = useState(allNameAndNumberLists);
  const [activeRowId, setActiveRowId] = useState(null);

  console.log("rows by key", rowsByKey);

  // const getSizeOptions = (product) => {
  //   if (!product?.allVariants) return [];
  //   const sizeVariantPairs = product.allVariants.flatMap((variant) => {
  //     const sizeOption = variant.selectedOptions.find((option) => option.name === 'Size');
  //     return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
  //   });
  //   return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
  // };




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


  const addRow = (key) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { selectionId: Date.now(), size: '', name: '', number: '' }],
    }));
  };

  const removeRow = (key, rowId) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].filter((row) => row.selectionId !== rowId),
    }));
  };

  const updateRow = (key, rowId, field, value) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].map((row) =>
        row.selectionId === rowId ? { ...row, [field]: value } : row
      ),
    }));
  };


  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const newAllProducts = [];

    selectedProducts.forEach((product) => {
      const addedColors = product.addedColors || [];
      const consistentTitle = product?.title || product?.name || product?.handle || 'Product';

      const extraProducts = addedColors.map((variantProduct) => ({
        id: variantProduct?.variant?.id,
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
        id: product.id,
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

    newAllProducts.forEach(product => dispatch(addNameAndNumberProduct({ productData: product })));

    const initialRows = {};

    // Add default rows only for products with missing or empty rows
    newAllProducts.forEach((product, pIdx) => {
      const key = `${product.id}`;
      if (!rowsByKey[key] || rowsByKey[key].length === 0) {
        initialRows[key] = [
          { selectionId: Date.now() + pIdx, size: '', name: '', number: '' }
        ];
      }
    });
    // Merge existing rowsByKey with any newly created default rows
    if (Object.keys(initialRows).length > 0) {
      setRowsByKey(prev => ({
        ...prev,
        ...initialRows
      }));
    }
    setActiveRowId(previewSelectionByProduct?.[currentProductId]);

  }, [selectedProducts]);





  const saveAndExit = () => {
    const selectionsRows = Object.entries(rowsByKey).filter(([key, rows]) => (key.split("/")[0] == "gid:"));
    console.log("filtered row ", selectionsRows)

    const isValid = selectionsRows.every(([key, rows]) =>
      rows.every(row => {
        const product = allProducts.find(p => `${p.id}` === key);
        const isSizeFilled =
          product?.sizes?.length === 0 || (row.size && row.size.trim() !== '');
        const isNameFilled = !addName || row.name !== '';
        const isNumberFilled = !addNumber || row.number !== '';
        const isPreview = !previewSelectionByProduct;
        return isSizeFilled && isNameFilled && isNumberFilled;
      })
    );

    if (!isValid) {
      toast.error("All required fields (Size, Name, Number) must be filled.");
      return;
    }

    selectionsRows.forEach(([id, rows]) => {
      const selectedRowId = previewSelectionByProduct?.[id];
      // if(!selectedRowId) return; 
      const previewRow = rows.find(row => row.selectionId === selectedRowId) || rows[0];

      dispatch(UpdateNameAndNumberProduct({
        id,
        newSelections: rows,
        isRenderOrNot: true
      }));

      dispatch(updateNameAndNumberDesignState({
        changes: {
          name: previewRow?.name || "NAME",
          number: previewRow?.number || "00"
        },
        productId: id,
        side: "front"
      }));

      dispatch(updateNameAndNumberDesignState({
        changes: {
          name: previewRow?.name || "NAME",
          number: previewRow?.number || "00"
        },
        productId: id,
        side: "back"
      }));
    });

    showAddnamesPopupHAndler();
  };


  const activeProduct = allProducts.find(product =>
    (rowsByKey[product.id] || []).some(row => row.selectionId === activeRowId)
  );
  // console.log("------activee", activeProduct)
  const canvasBgColor = getHexFromName(activeProduct?.color) || "#f5f5f5";

  // console.log("--canvass", canvasBgColor)
  return (

    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <div>
            <h2>Edit Names & Numbers List</h2>
            <p>Personalize your apparel with Names and/or Numbers!</p>
          </div>
          <button className={styles.closeBtn} onClick={showAddnamesPopupHAndler}>
            <CrossIcon />
          </button>
        </div>

        <div className={styles.popupBody}>
          <div className={styles.popupLeft}>
            {allProducts.map((product, pIdx) => (
              <div key={pIdx} className={styles.productBlock}>
                <div className={styles.productDetails}>
                  <div className={styles.miniProdImgContainer}>
                    <img src={product?.imgurl} className={styles.productMiniImg} alt="mini" />
                  </div>
                  <div>
                    <h4>{product.name || product?.title}</h4>
                    <div className={styles.colorShowDiv}>
                      <span className={styles.prColorSpan} style={{ backgroundColor: getHexFromName(product?.color) }}></span>
                      <h5 className={styles.productColorSpanName}>{product?.color}</h5>
                    </div>
                  </div>
                </div>

                <div className={styles.namesList}>
                  <div className={styles.tableHeader}>
                    <span>Size</span>
                    <span className={!addName ? styles.deactive : ""}>Name</span>
                    <span className={!addNumber ? styles.deactive : ""}>Number</span>
                    <span className={`${!addNumber || !addName ? styles.deactive : ""}`}>Preview</span>
                    <span></span>
                  </div>

                  {(rowsByKey[product.id] || []).map((row) => (
                    <div key={row.selectionId} className={styles.tableRow}>
                      <select
                        value={row.size}
                        onChange={e =>
                          updateRow(`${product.id}`, row.selectionId, 'size', e.target.value)
                        }
                        disabled={product.sizes.length === 0}
                      >
                        {product.sizes.length === 0 ? (
                          <option value="">Not Available</option>
                        ) : (
                          <>
                            <option value="" disabled>Select Size</option>
                            {product.sizes.map((s, indx) => {
                              const sizeValue = typeof s === 'object' ? s.size : s;
                              return (
                                <option key={indx} value={sizeValue}>{sizeValue}</option>
                              );
                            })}
                          </>
                        )}
                      </select>

                      <input
                        type="text"
                        placeholder="Name"
                        maxLength={15}
                        value={row.name}
                        className={!addName ? styles.Deactive : ""}
                        onFocus={() => setActiveRowId(row.selectionId)}
                        onChange={(e) => updateRow(`${product.id}`, row.selectionId, 'name', e.target.value.toUpperCase())}
                      />

                      <input
                        type="text"
                        placeholder="Number"
                        maxLength={4}
                        value={row.number}
                        className={!addNumber ? styles.Deactive : ""}
                        onFocus={() => setActiveRowId(row.selectionId)}
                        onChange={(e) => updateRow(`${product.id}`, row.selectionId, 'number', e.target.value.toUpperCase())}
                      />
                      <input
                        type="radio"
                        name={`preview-selection-${product.id}`} // unique per product
                        checked={previewSelectionByProduct[product.id] === row.selectionId}
                        onChange={() => {
                          setActiveRowId(row.selectionId);
                          setPreviewSelectionByProduct((prev) => ({
                            ...prev,
                            [product.id]: row.selectionId,
                          }))
                        }
                        }
                        title="Set as Preview"
                      />

                      <button className={styles.trashBtn} onClick={() => removeRow(`${product.id}`, row.selectionId)}><DeleteIcon /></button>
                    </div>
                  ))}

                  <p className={styles.addAnother} onClick={() => addRow(`${product.id}`)}>+ Add Another</p>
                  {(() => {
                    const rows = rowsByKey[product.id] || [];
                    const productTotal = rows.length;
                    const productNameCount = rows.filter((r) => r.name?.trim()).length;
                    const productNumberCount = rows.filter((r) => r.number?.trim()).length;

                    return (
                      <p className={styles.totalCount}>
                        Totals: {productNameCount} out of {productTotal} have Names | {productNumberCount} out of {productTotal} have Numbers
                      </p>
                    );
                  })()}
                  <hr className={styles.hrUnderline} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.popupRight}>
            <div className={styles.renderBox}>
              <div className={styles.canvasBg} style={{ backgroundColor: canvasBgColor }}>
                {!activeRowId ? null : Object.values(rowsByKey).flat().filter((row) => row.selectionId === activeRowId).map((row) => (
                  <div key={row.selectionId} className={styles.textRow}>
                    {row.name && (
                      <div
                        className={styles.nameText}
                        style={{
                          color: nameAndNumberDesign.fontColor || '#000',
                          fontFamily: nameAndNumberDesign.fontFamily || 'Chakra Petch,sans-serif',
                          fontSize: nameAndNumberDesign.fontSize === 'large' ? '45px' : '25px',
                        }}
                      >
                        {row.name}
                      </div>
                    )}
                    {row.number && (
                      <div
                        className={styles.numberText}
                        style={{
                          color: nameAndNumberDesign.fontColor || '#000',
                          fontFamily: nameAndNumberDesign.fontFamily || 'Chakra Petch,sans-serif',
                          fontSize: nameAndNumberDesign.fontSize === 'large' ? '140px' : '60px',
                        }}
                      >
                        {row.number}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.popupFooter}>
              <button className={styles.primaryBtn} onClick={saveAndExit}>Save & Close</button>
              <button className={styles.linkBtn} onClick={showAddnamesPopupHAndler}>Exit Without Saving</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default AddNamesPopup;
