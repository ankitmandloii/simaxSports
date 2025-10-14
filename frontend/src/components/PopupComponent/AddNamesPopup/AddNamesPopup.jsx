import React, { useState, useEffect, useRef } from 'react';
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import styles from './AddNamesPopup.module.css'
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";

import { useDispatch, useSelector } from 'react-redux';
import { addNameAndNumberProduct, UpdateNameAndNumberProduct } from '../../../redux/FrontendDesign/TextFrontendDesignSlice.js';
import { getHexFromName } from '../../utils/colorUtils.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseButton from '../../CommonComponent/CrossIconCommon/CrossIcon.jsx';
import CustomSelectSize from '../../CommonComponent/CustomSelectSize/CustomSelectSize.jsx';


//=========== customselect Componenet
// const CustomSelect = ({ value, onChange, options = [], disabled = false, placeholder = "Select..." }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (containerRef.current && !containerRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const displayValue = value || placeholder;
//   const allOptions = [
//     { value: '', label: placeholder, disabled: true },
//     ...options.map((opt) => ({
//       value: opt.size,
//       label: opt.size,
//       disabled: false,
//     })),
//   ].filter((opt) => opt.value !== ''); // Filter out empty if it's the only one, but keep for placeholder

//   const handleOptionClick = (optValue) => {
//     if (optValue !== '') {
//       onChange(optValue);
//     }
//     setIsOpen(false);
//   };

//   if (disabled) {
//     return (
//       <div className={`${styles.customSelectContainer} ${styles.disabled}`}>
//         <div className={styles.customSelectTrigger}>
//           {displayValue}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div ref={containerRef} className={styles.customSelectContainer}>
//       <div
//         className={styles.customSelectTrigger}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {displayValue}
//         <span className={styles.dropdownArrow}>{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
//       </div>
//       {isOpen && (
//         <ul className={styles.customSelectList}>
//           {allOptions.map((opt, index) => (
//             <li
//               key={index}
//               className={`${styles.customSelectOption} ${opt.disabled ? styles.disabledOption : ''} ${value === opt.value ? styles.selectedOption : ''}`}
//               onClick={() => handleOptionClick(opt.value)}
//               style={opt.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
//             >
//               {opt.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

const AddNamesPopup = ({ onClose }) => {
  // const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
  const activeSide = "back";
  // const { addNumber, addName } = useSelector((state) => state.TextFrontendDesignSlice);
  const productState = useSelector((state) => state.productSelection.products);
  // console.log("productState..........", productState);
  const { addName, addNumber } = useSelector((state) => state.TextFrontendDesignSlice);
  const nameAndNumberDesign = useSelector((state) => state.TextFrontendDesignSlice.nameAndNumberDesignState)
  // console.log("---------addnamedesignSlice", nameAndNumberDesign)

  const { present } = useSelector((state) => state.TextFrontendDesignSlice);
  console.log("present ", present)
  const nameAndNumberProductList = useSelector((state) => state.TextFrontendDesignSlice.present["back"].nameAndNumberProductList);

  const selectedProducts = useSelector((state) => state.selectedProducts.selectedProducts);
  console.log(selectedProducts, "-----alllproductselect");

  const [allProducts, setAllProducts] = useState(nameAndNumberProductList ?? []);


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

  const [rowsByKey, setRowsByKey] = useState(getObjectTypeData(nameAndNumberProductList));
  const [activeRowId, setActiveRowId] = useState(null);


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
        if (sizeOption && variant?.selectedOptions?.[0].value === color && inventoryQty > 0) {
          return [
            {
              size: sizeOption.value,
              variantId: variant?.id,
              quantity: inventoryQty,
              sku: variant?.sku,
              "handle": product?.handle
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


  const addRow = (key, size) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { selectionId: Date.now(), size: size ? size : "", name: '', number: '' }],
    }));
  };

  const removeRow = (key, rowId) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].filter((row) => row.selectionId !== rowId),
    }));
  };

  const updateRow = (key, rowId, field, value, newId) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].map((row, index) =>
        row.selectionId === rowId
          ? {
            ...row,
            [field]: value,
            selectionId:
              newId !== undefined && row.selectionId !== newId
                ? newId + "/" + index
                : row.selectionId,
          }
          : row
      ),
    }));
  };



  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) return;

    const newAllProducts = [];
    console.log("selectedProducts useEffect", selectedProducts);

    selectedProducts.forEach((product) => {
      const addedColors = product.addedColors || [];
      const selectedColor = [product.selectedColor] || [];
      const consistentTitle = product?.title || product?.name || product?.handle || 'Product';
      console.log("addedColors", addedColors)
      const extraProducts = addedColors.map((variantProduct) => ({

        id: variantProduct?.variant?.id?.split("/")?.reverse()[0],
        imgurl: variantProduct?.img,
        color: variantProduct?.name,
        size: variantProduct?.variant?.selectedOptions[1]?.value,
        sizes: getSizeOptions(variantProduct, variantProduct?.name),
        name: product?.name,
        title: consistentTitle,
        selections: [],
        swatchImg: variantProduct?.swatchImg
      }));

      // const mainProduct = {
      //   name: product.name || product.title,
      //   id: product.id.split("/").reverse()[0],
      //   imgurl: product?.imgurl,
      //   color: product?.selectedColor?.name,
      //   size: product.selectedColor?.variant?.selectedOptions[1]?.value,
      //   sizes: getSizeOptions(product), // assume this is a valid function in scope
      //   title: consistentTitle,
      //   swatchImg: product?.swatchImg || product?.selectedColor?.swatchImg,
      //   selections: [],
      // };
      console.log(selectedColor, "selectedColor");

      const extraProducts2 = selectedColor?.map((variantProduct) => {
        console.log("----variantProduct", variantProduct)
        const prod = {
          id: variantProduct?.variant?.id?.split("/")?.reverse()[0],
          imgurl: variantProduct?.img,
          color: variantProduct?.name,
          size: variantProduct?.variant?.selectedOptions[1]?.value,
          // sizes: variantProduct?.sizes?.map(size => ({ size: size.size, variantId: size?.variant?.id })) || [],
          sizes: getSizeOptions(variantProduct, variantProduct?.name),
          name: product?.name,
          title: consistentTitle,
          selections: [],
          swatchImg: variantProduct?.swatchImg,
        };
        // console.log(prod, "prod");
        return prod;
      });
      // console.log("mainProduct", mainProduct);
      console.log("addedColor", extraProducts2);
      console.log("selectedColor", extraProducts);
      // Add main product and its variants
      newAllProducts.push(...extraProducts, ...extraProducts2);
      console.log("newAllProducts", newAllProducts);
    });

    setAllProducts(newAllProducts);

    newAllProducts.forEach(product => dispatch(addNameAndNumberProduct({ productData: product })));

    const initialRows = {};

    // Add default rows only for products with missing or empty rows
    newAllProducts.forEach((product, pIdx) => {
      const key = `${product.id}`;
      // console.log("product in adding product ", product)
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





  const saveAndExit = () => {
    const selectionsRows = Object.entries(rowsByKey);
    console.log("selection rows", selectionsRows)
    const isRowEmpty = (row) => {
      return (
        (row.size === null || row.size.trim() === '') &&
        (row.name === null || row.name.trim() === '') &&
        (row.number === null || row.number.trim() === '')
      );
    };
    const filteredRows = []
    // Filter the selectionsRows array
    selectionsRows.forEach(([key, rows]) => {
      // Check if ALL rows in the inner array are emptys
      const filledRows = rows.filter((row) => {
        return !isRowEmpty(row)
      });
      if (filledRows.length != 0) {
        filteredRows.push([key, filledRows ?? []])
      }
    });

    console.log("filteredRows", filteredRows)


    const isValid = filteredRows.every(([key, rows]) =>
      rows.every(row => {
        const product = allProducts?.find(p => `${p.id}` === key);
        const isSizeFilled =
          product?.sizes?.length === 0 || (row.size && row.size.trim() !== '');
        const isNameFilled = !addName || row.name !== '';
        const isNumberFilled = !addNumber || row.number !== '';
        return isSizeFilled && isNameFilled && isNumberFilled;
      })
    );

    if (!isValid) {
      toast.error("All required fields (Size, Name, Number) must be filled.");
      // alert("All required fields must be filled.");
    } else {
      // console.log(selectionsRows, "selectionsRows");

      const sizeCountWithId = selectionsRows.map(([id, items]) => {
        const sizeCount = {};

        items.forEach(item => {
          const size = item.size;
          if (sizeCount[size]) {
            sizeCount[size] += 1;
          } else {
            sizeCount[size] = 1;
          }
        });

        return {
          id,
          sizeCount
        };
      });

      console.log('sizeCountWithId', sizeCountWithId)
      console.log("selectionsRows", selectionsRows)
      filteredRows.forEach(([id, rows]) => {
        const found = sizeCountWithId?.find(obj => obj.id === id);

        dispatch(UpdateNameAndNumberProduct({
          id,
          newSelections: rows,
          sizeCount: found?.sizeCount || {}, // send sizeCount too
          isRenderOrNot: true
        }));
      });
      onClose();
      // showAddnamesPopupHandler();
    }
  };


  const activeProduct = allProducts?.find(product =>
    (rowsByKey[product.id] || []).some(row => row.selectionId === activeRowId)
  );
  // console.log("------activee", activeProduct)
  const canvasBgColor = getHexFromName(activeProduct?.color) || "#f5f5f5";

  // console.log("--canvass", canvasBgColor)
  // console.log("====all", allProducts)

  return (

    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Edit Names & Numbers List</h2>
            {/* <p>Personalize your apparel with Names and/or Numbers!</p> */}
          </div>
          {/* <button className={styles.closeBtn} onClick={showAddnamesPopupHandler}>
            <CrossIcon />
          </button> */}
          <CloseButton onClose={onClose} />
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
                      <img src={product?.swatchImg} className={styles.prColorSpan} alt='colorSwatch' />
                      {/* <span className={styles.prColorSpan} style={{ backgroundColor: getHexFromName(product?.color) }}></span> */}
                      <h5 className={styles.productColorSpanName}>{product?.color}</h5>
                    </div>
                  </div>
                </div>

                <div className={styles.namesList}>
                  <div className={styles.tableHeader}>
                    <span>Size</span>
                    <span className={!addName ? styles.Deactive : ""}>Name</span>
                    <span className={!addNumber ? styles.Deactive : ""}>Number</span>
                    <span></span>
                  </div>

                  {(rowsByKey[product.id] || [])?.map((row) => (
                    <div key={row.selectionId} className={styles.tableRow}>
                      <CustomSelectSize
                        value={row.size}
                        onChange={(newValue) => {
                          setActiveRowId(row.selectionId)
                          console.log("selected size", newValue);
                          const productSize = product?.sizes?.find(s => s.size === newValue);
                          console.log("productSize", productSize);
                          const newId = productSize?.variantId || row.selectionId;
                          console.log("newId", newId);
                          updateRow(`${product.id}`, row.selectionId, 'size', newValue, newId)
                        }}
                        options={product.sizes}
                        disabled={product?.sizes?.length === 0}
                        placeholder={product.sizes.length === 0 ? "Not Available" : "Size"}
                      />

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

                      <button className={styles.trashBtn} onClick={() => removeRow(`${product.id}`, row.selectionId)}><DeleteIcon /></button>
                    </div>
                  ))}
                  <div className={styles.addAnother}><span onClick={() => addRow(`${product.id}`)}>+ Add Another</span>

                  </div>
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
              <button className={styles.linkBtn} onClick={onClose}>Exit Without Saving</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};



export default AddNamesPopup;