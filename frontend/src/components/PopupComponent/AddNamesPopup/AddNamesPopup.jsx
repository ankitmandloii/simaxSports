import React, { useState } from 'react';
import './AddNamesPopup.css';
import miniProd from '../../images/mini-prod.png';
import Redimg from '../../images/red-img.png'
import { CrossIcon, DeleteIcon } from '../../iconsSvg/CustomIcon';
import { useSelector } from 'react-redux';

import CanvasPreview from '../../fabric/CanvasPreview';
// import tshirtPreview from '../../images/tshirt-preview.png';

const AddNamesPopup = ({ showAddnamesPopupHAndler }) => {
  const [rows, setRows] = useState([{ id: Date.now(), size: '', name: '', number: '' }]);
  const [activeRowId, setActiveRowId] = useState(null);
  const frontImageforMiniImageShow = useSelector(state => state?.slectedProducts?.activeProduct?.imgurl || 'https://i.postimg.cc/vHZM9108/Rectangle-11.png');
  const allVariants = useSelector(state => state?.slectedProducts?.activeProduct?.allVariants || []);
  console.log(allVariants, "allVariants");


  const sizeOptions = Array.from(new Set(
    allVariants
      .flatMap(variant =>
        variant.selectedOptions
          .filter(option => option.name === 'Size')
          .map(option => option.value)
      )
  ));

  console.log(sizeOptions, "sizeOptions");
  const addRow = () => {
    setRows([...rows, { id: Date.now(), size: '', name: '', number: '' }]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
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

          <div className="popup-body">
            <div className="popup-left">
              <div className="product-details ">
                <div className='mini-prod-img-container'>
                  <img src={frontImageforMiniImageShow} className="product-mini-img" alt="mini" />
                </div>

                <div>
                  <h4>Essential Red T-Shirt for Men & Women</h4>
                  <p className='toolbar-span'>Red</p>
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
                  <div className="table-row" key={row.id}>
                    <select value={row.size} onChange={(e) => updateRow(row.id, 'size', e.target.value)}>
                      {sizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    {/* <select value={row.size} onChange={(e) => updateRow(row.id, 'size', e.target.value)}>
                    <option value="">--</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select> */}
                    <input
                      type="text"
                      placeholder="Name"
                      maxLength={11}
                      value={row.name}
                      onFocus={() => setActiveRowId(row.id)}
                      onChange={(e) => updateRow(row.id, 'name', e.target.value.toUpperCase())}
                    />

                    <input
                      type="text"
                      placeholder="Number"
                      maxLength={4}
                      value={row.number}
                      onFocus={() => setActiveRowId(row.id)}
                      onChange={(e) => updateRow(row.id, 'number', e.target.value.toUpperCase())}
                    />

                    <button className="trash-btn" onClick={() => removeRow(row.id)}><DeleteIcon /></button>
                  </div>
                ))}
                <p className="add-another" onClick={addRow}>+ Add Another</p>
              </div>
            </div>

            <div className="popup-right">
              {/* have to limit 25 char and 4 digits only  */}
              {/* want to impliement the design of canvas and render the bg-color as the selected product color */}
              {/* <img src={Redimg} alt="T-Shirt" /> */}
              <div className="render-box">
                <div className='canvas-bg'>


                  {/* <img src={Redimg} alt="T-Shirt" className="canvas-bg" /> */}
                  {!activeRowId ? (
                    <div className="text-row">
                      <div className="name-text">Edit a row to preview</div>
                    </div>
                  ) : (
                    rows
                      .filter((row) => row.id === activeRowId)
                      .map((row) => (
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
