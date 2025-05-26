import React, { useState, useEffect } from 'react';
import './AddNamesPopup.css';
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch, useSelector } from 'react-redux';
import { addNameAndNumberProduct, removeNameAndNumberProduct, setActiveSide, setAddName, setAddNumber, updateNameAndNumberDesignState, UpdateNameAndNumberProduct } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';

const AddNamesPopup = ({ showAddnamesPopupHAndler }) => {
  const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberDesignState)
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].nameAndNumberProductList);

  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);

  const [allProducts, setAllProducts] = useState(nameAndNumberProductList);

  console.log(nameAndNumberProductList, "nameAndNumberProductList")

  const dispatch = useDispatch();

  const getObjectTypeData = (data) => {
    if (!data) return {};

    const obj = {};
    data.forEach(product => {
      obj[product.id] = product.selections;
    });

    return obj;
  };

  console.log("selectedddd", selectedProducts)
  const [rowsByKey, setRowsByKey] = useState(getObjectTypeData(nameAndNumberProductList));
  const [activeRowId, setActiveRowId] = useState(null);


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

      const extraProducts = addedColors.map((variantProduct) => ({
        id: variantProduct?.variant?.id?.split("/")?.reverse()[0],
        imgurl: variantProduct?.img,
        color: variantProduct?.name,
        size: variantProduct?.variant?.selectedOptions[1]?.value,
        sizes: variantProduct?.sizes,
        name: product?.name,
        title: variantProduct.variant?.title,
        selections: [],
      }));

      const mainProduct = {
        name: product.name,
        id: product.id.split("/").reverse()[0],
        imgurl: product?.imgurl,
        color: product?.selectedColor?.name,
        size: product.selectedColor?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(product), // assume this is a valid function in scope
        title: product.selectedColor?.variant?.title,
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

  }, [selectedProducts]);


  console.log("rowkeys", rowsByKey);

  console.log(allProducts, "allproducts")


  const saveAndExit = () => {
    const selectionsRows = Object.entries(rowsByKey);

    const isValid = selectionsRows.every(([key, rows]) =>
      rows.every(row => {
        const isSizeFilled = !row.size || row.size !== '';
        const isNameFilled = !addName || row.name !== '';
        const isNumberFilled = !addNumber || row.number !== '';
        return isSizeFilled && isNameFilled && isNumberFilled;
      })
    );

    if (!isValid) {
      alert("All required fields must be filled.");
    } else {
      selectionsRows.forEach(([id, rows]) => {
        dispatch(UpdateNameAndNumberProduct({
          id,
          newSelections: rows,
          isRenderOrNot: true
        }));
      });

      showAddnamesPopupHAndler();
    }
  };





  return (
    <div className="addNames-popup-box">
      <div className="popup-overlay">
        <div className="popup-container add-name-popup">
          <div className="popup-header">
            <div>
              <h2>Edit Names & Numbers List</h2>
              <p>Personalize your apparel with Names and/or Numbers!</p>
            </div>
            <button className="close-btn" onClick={showAddnamesPopupHAndler}><CrossIcon /></button>
          </div>

          <div className="popup-body names-popup-body">
            <div className="popup-left">
              {allProducts.map((product, pIdx) => (
                <div key={pIdx} className="product-block">
                  <div className="product-details">
                    <div className="mini-prod-img-container">
                      <img src={product?.imgurl} className="product-mini-img" alt="mini" />
                    </div>
                    <div>
                      <h4>{product.name || product?.title}</h4>
                      <h5 className="product-color-span-name">{product?.color}</h5>
                    </div>
                  </div>

                  <div className="names-list">
                    <div className="table-header">
                      <span>Size</span>
                      <span className={`${!addName ? "Deactive" : ""}`}>Name</span>
                      <span className={`${!addNumber ? "Deactive" : ""}`}>Number</span>
                      <span></span>
                    </div>

                    {(rowsByKey[product.id] || []).map((row) => (
                      <div key={product.id} className="table-row">
                        <select
                          value={row.size}
                          onChange={e => {
                            const selectedSize = e.target.value;
                            // const variant = getSizeOptions(product).find(opt => opt.size === selectedSize);
                            // console.log(`Selected size: ${selectedSize}, Variant ID: ${variant?.variantId}`);
                            updateRow(`${product.id}`, row.selectionId, 'size', selectedSize);
                          }}
                          disabled={product.sizes.length === 0}
                        >
                          {product.sizes.length === 0 ? (
                            <option value="">Not Available</option>
                          ) : (
                            <>
                              <option value="" disabled>Select Size</option>
                              {product.sizes.map((s, indx) => {
                                const isObject = s && typeof s === 'object';
                                const sizeValue = isObject ? s.size : s;
                                return (
                                  <option key={indx} value={sizeValue}>
                                    {sizeValue}
                                  </option>
                                );
                              })}

                            </>
                          )}
                        </select>

                        <input
                          type="text"
                          placeholder="Name"
                          maxLength={25}
                          value={row.name}
                          className={`${!addName ? "Deactive" : ""}`}
                          onFocus={() => setActiveRowId(row.selectionId)}
                          onChange={(e) => updateRow(`${product.id}`, row.selectionId, 'name', e.target.value.toUpperCase())}
                        />
                        <input
                          type="text"
                          placeholder="Number"
                          maxLength={4}
                          value={row.number}
                          className={`${!addNumber ? "Deactive" : ""}`}
                          onFocus={() => setActiveRowId(row.selectionId)}
                          onChange={(e) => updateRow(`${product.id}`, row.selectionId, 'number', e.target.value.toUpperCase())}
                        />

                        <button className="trash-btn" onClick={() => removeRow(`${product.id}`, row.selectionId)}><DeleteIcon /></button>
                      </div>
                    ))}

                    <p className="add-another" onClick={() => addRow(`${product.id}`)}>+ Add Another</p>
                    {/* <p className="total-show-box">
                      Totals: {rowsByKey[`${pIdx}`]?.filter((r) => r.name).length || 0} with Names | {rowsByKey[`${pIdx}`]?.filter((r) => r.number).length || 0} with Numbers
                    </p> */}
                    <hr className="hr-underline" />
                  </div>

                  {/* {(product.addedColors || []).map((color, cIdx) => { 
                    const key = `${pIdx}-${cIdx}`;
                    const rows = rowsByKey[key] || [];

                    return (
                      <div key={key} className="color-block">
                        <div className="product-details">
                          <div className="mini-prod-img-container">
                            <img src={color.img} className="product-mini-img" alt="mini" />
                          </div>
                          <div>
                            <h4>{product.name || product?.handle}</h4>
                            <p className="toolbar-span">{product?.colors?.map((c) => c.name).join(', ')}</p>
                            <h5 className="product-color-span-name">{color?.name}</h5>
                          </div>
                        </div>

                        <div className="names-list">
                          <div className="table-header">
                            <span>Size</span>
                            <span>Name</span>
                            <span>Number</span>
                            <span></span>
                          </div>

                          {rows.map((row) => (
                            <div key={row.id} className="table-row">
                              <select
                                value={row.size}
                                onChange={e => {
                                  const selectedSize = e.target.value;
                                  const variant = getSizeOptions(product).find(opt => opt.size === selectedSize);
                                  console.log(`Selected size: ${selectedSize}, Variant ID: ${variant?.variantId}`);
                                  updateRow(`${pIdx}`, row.id, 'size', selectedSize);
                                }}
                                disabled={getSizeOptions(product).length === 0}
                              >
                                {getSizeOptions(product).length === 0 ? (
                                  <option value="">Not Available</option>
                                ) : (
                                  <>
                                    <option value="" disabled>Select Size</option>
                                    {getSizeOptions(product).map(({ size, variantId }) => (
                                      <option key={variantId} value={size}>{size}</option>
                                    ))}
                                  </>
                                )}
                              </select>

                              <input
                                type="text"
                                placeholder="Name"
                                maxLength={25}
                                value={row.name}
                                onFocus={() => setActiveRowId(row.id)}
                                onChange={(e) => updateRow(key, row.id, 'name', e.target.value.toUpperCase())}
                              />

                              <input
                                type="text"
                                placeholder="Number"
                                maxLength={4}
                                value={row.number}
                                onFocus={() => setActiveRowId(row.id)}
                                onChange={(e) => updateRow(key, row.id, 'number', e.target.value.toUpperCase())}
                              />

                              <button className="trash-btn" onClick={() => removeRow(key, row.id)}><DeleteIcon /></button>
                            </div>
                          ))}

                          <p className="add-another" onClick={() => addRow(key)}>+ Add Another</p>
                          <p className="total-show-box">
                            Totals: {rows.filter((r) => r.name).length} with Names | {rows.filter((r) => r.number).length} with Numbers
                          </p>
                          <hr className="hr-underline" />
                        </div>
                      </div>
                    );
                  })} */}
                </div>
              ))}
            </div>

            <div className="popup-right">
              <div className="render-box">
                <div className="canvas-bg">
                  {!activeRowId ? (
                    <div className="text-row">
                      {/* <div className="name-text">Edit a row to preview</div> */}
                    </div>
                  ) : (
                    Object.values(rowsByKey).flat().filter((row) => row.selectionId === activeRowId).map((row) => (
                      <div key={row.selectionId} className="text-row">
                        {row.name && <div className="name-text">{row.name}</div>}
                        {row.number && <div className="number-text">{row.number}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="popup-footer">
                <button className="primary-btn" onClick={saveAndExit}>Save & Close</button>
                <button className="link-btn" onClick={showAddnamesPopupHAndler}>Exit Without Saving</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNamesPopup;
