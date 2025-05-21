import React, { useState, useEffect } from 'react';
import './AddNamesPopup.css';
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import { useSelector } from 'react-redux';

const AddNamesPopup = ({ showAddnamesPopupHAndler }) => {
  const selectedProducts = useSelector((state) => state.slectedProducts.selectedProducts);

  const [rowsByProduct, setRowsByProduct] = useState({});
  const [activeRowId, setActiveRowId] = useState(null);

  useEffect(() => {
    const initialRows = {};
    selectedProducts.forEach((_, idx) => {
      initialRows[idx] = [{ id: Date.now() + idx, size: '', name: '', number: '' }];
    });
    setRowsByProduct(initialRows);
  }, [selectedProducts]);

  const getSizeOptions = (product) => {
    if (!product?.allVariants) return [];
    return Array.from(new Set(
      product.allVariants
        .flatMap(variant =>
          variant.selectedOptions
            .filter(option => option.name === 'Size')
            .map(option => option.value)
        )
    ));
  };

  const addRow = (productIndex) => {
    setRowsByProduct(prev => ({
      ...prev,
      [productIndex]: [
        ...(prev[productIndex] || []),
        { id: Date.now(), size: '', name: '', number: '' }
      ]
    }));
  };

  const removeRow = (productIndex, rowId) => {
    setRowsByProduct(prev => ({
      ...prev,
      [productIndex]: prev[productIndex].filter(row => row.id !== rowId)
    }));
  };

  const updateRow = (productIndex, rowId, field, value) => {
    setRowsByProduct(prev => ({
      ...prev,
      [productIndex]: prev[productIndex].map(row =>
        row.id === rowId ? { ...row, [field]: value } : row
      )
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
              {selectedProducts.map((product, index) => (
                <div key={index} className="product-block">
                  <div className="product-details">
                    <div className='mini-prod-img-container'>
                      <img src={product.imgurl} className="product-mini-img" alt="mini" />
                    </div>
                    <div>
                      <h4>{product.name}</h4>
                      <p className='toolbar-span'>{product.colors.map(color => color.name).join(', ')}</p>
                    </div>
                  </div>

                  <div className="names-list">
                    <div className="table-header">
                      <span>Size</span>
                      <span>Name</span>
                      <span>Number</span>
                      <span></span>
                    </div>
                    {(rowsByProduct[index] || []).map((row) => (
                      <div className="table-row" key={row.id}>
                        <select
                          value={row.size}
                          onChange={(e) => updateRow(index, row.id, 'size', e.target.value)}
                          disabled={getSizeOptions(product).length === 0}
                        >
                          {getSizeOptions(product).length === 0 ? (
                            <option value="">Not Available</option>
                          ) : (
                            <>
                              <option value="" disabled>Select Size</option>
                              {getSizeOptions(product).map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </>
                          )}
                        </select>

                        <input
                          type="text"
                          placeholder="Name"
                          maxLength={11}
                          value={row.name}
                          onFocus={() => setActiveRowId(row.id)}
                          onChange={(e) => updateRow(index, row.id, 'name', e.target.value.toUpperCase())}
                        />

                        <input
                          type="text"
                          placeholder="Number"
                          maxLength={4}
                          value={row.number}
                          onFocus={() => setActiveRowId(row.id)}
                          onChange={(e) => updateRow(index, row.id, 'number', e.target.value.toUpperCase())}
                        />

                        <button className="trash-btn" onClick={() => removeRow(index, row.id)}><DeleteIcon /></button>
                      </div>
                    ))}
                    <p className="add-another" onClick={() => addRow(index)}>+ Add Another</p>
                    <p className='total-show-box'>Totals: {rowsByProduct[index]?.filter(r => r.name).length || 0} with Names | {rowsByProduct[index]?.filter(r => r.number).length || 0} with Numbers</p>
                    <hr className='hr-underline' />
                  </div>
                </div>
              ))}
            </div>

            <div className="popup-right">
              <div className="render-box">
                <div className='canvas-bg'>
                  {!activeRowId ? (
                    <div className="text-row">
                      <div className="name-text">Edit a row to preview</div>
                    </div>
                  ) : (
                    Object.values(rowsByProduct).flat().filter(row => row.id === activeRowId).map(row => (
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
