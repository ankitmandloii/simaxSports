import React, { useState, useEffect } from 'react';
import './AddNamesPopup.css';
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import { useSelector } from 'react-redux';

const AddNamesPopup = ({ showAddnamesPopupHAndler }) => {
  const selectedProducts = useSelector((state) => state.slectedProducts.selectedProducts);
  const [rowsByKey, setRowsByKey] = useState({});
  const [activeRowId, setActiveRowId] = useState(null);

  useEffect(() => {
    const initialRows = {};
    selectedProducts.forEach((product, pIdx) => {
      initialRows[`${pIdx}`] = [{ id: Date.now() + pIdx, size: '', name: '', number: '' }];
      (product.addedColors || []).forEach((_, cIdx) => {
        const key = `${pIdx}-${cIdx}`;
        initialRows[key] = [{ id: Date.now() + pIdx + cIdx + 1000, size: '', name: '', number: '' }];
      });
    });
    setRowsByKey(initialRows);
  }, [selectedProducts]);

  const getSizeOptions = (product) => {
    if (!product?.allVariants) return [];
    const sizeVariantPairs = product.allVariants.flatMap((variant) => {
      const sizeOption = variant.selectedOptions.find((option) => option.name === 'Size');
      return sizeOption ? [{ size: sizeOption.value, variantId: variant.id }] : [];
    });
    return Array.from(new Map(sizeVariantPairs.map((item) => [item.size, item])).values());
  };

  const addRow = (key) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now(), size: '', name: '', number: '' }],
    }));
  };

  const removeRow = (key, rowId) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].filter((row) => row.id !== rowId),
    }));
  };

  const updateRow = (key, rowId, field, value) => {
    setRowsByKey((prev) => ({
      ...prev,
      [key]: prev[key].map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row
      ),
    }));
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
              {selectedProducts.map((product, pIdx) => (
                <div key={pIdx} className="product-block">
                  <div className="product-details">
                    <div className="mini-prod-img-container">
                      <img src={product?.imgurl} className="product-mini-img" alt="mini" />
                    </div>
                    <div>
                      <h4>{product.name || product?.title}</h4>
                      <p className="toolbar-span">{product?.colors?.map((color) => color?.name).join(', ')}</p>
                      <h5 className="product-color-span-name">{product?.selectedColor?.name}</h5>
                    </div>
                  </div>

                  <div className="names-list">
                    <div className="table-header">
                      <span>Size</span>
                      <span>Name</span>
                      <span>Number</span>
                      <span></span>
                    </div>

                    {(rowsByKey[`${pIdx}`] || []).map((row) => (
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
                          onChange={(e) => updateRow(`${pIdx}`, row.id, 'name', e.target.value.toUpperCase())}
                        />

                        <input
                          type="text"
                          placeholder="Number"
                          maxLength={4}
                          value={row.number}
                          onFocus={() => setActiveRowId(row.id)}
                          onChange={(e) => updateRow(`${pIdx}`, row.id, 'number', e.target.value.toUpperCase())}
                        />

                        <button className="trash-btn" onClick={() => removeRow(`${pIdx}`, row.id)}><DeleteIcon /></button>
                      </div>
                    ))}

                    <p className="add-another" onClick={() => addRow(`${pIdx}`)}>+ Add Another</p>
                    <p className="total-show-box">
                      Totals: {rowsByKey[`${pIdx}`]?.filter((r) => r.name).length || 0} with Names | {rowsByKey[`${pIdx}`]?.filter((r) => r.number).length || 0} with Numbers
                    </p>
                    <hr className="hr-underline" />
                  </div>

                  {(product.addedColors || []).map((color, cIdx) => {
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
                  })}
                </div>
              ))}
            </div>

            <div className="popup-right">
              <div className="render-box">
                <div className="canvas-bg">
                  {!activeRowId ? (
                    <div className="text-row">
                      <div className="name-text">Edit a row to preview</div>
                    </div>
                  ) : (
                    Object.values(rowsByKey).flat().filter((row) => row.id === activeRowId).map((row) => (
                      <div key={row.id} className="text-row">
                        {row.name && <div className="name-text">{row.name}</div>}
                        {row.number && <div className="number-text">{row.number}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="popup-footer">
                <button className="primary-btn">Save & Close</button>
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
