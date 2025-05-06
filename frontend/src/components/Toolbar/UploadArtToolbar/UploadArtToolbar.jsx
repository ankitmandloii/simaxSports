import React, { useState, useRef } from "react";
import './UploadArtToolbar.css';
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png'
import googleDrive from "../../images/googleDrive.png"

const UploadArtToolbar = () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Upload Art</h5>
        <h3>Choose Files To Upload</h3>
        <p>You can select multiple products and colors</p>
      </div>

      <div className="toolbar-box">
        {/* Option 1: Drag & Drop */}
        <div
          className="upload-option drop-zone"
          // onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p> Drag & drop files here</p>
          <p>or</p>
           <button className="upload-file-btn " onClick={handleClick}>
                  <ChooseFileIcon />
                  SHARE
                </button>
          <div className="upload-option">
          {/* <button className="upload-btn" >Upload Files</button> */}
        </div>
        </div>
        {files.length > 0 && (
  <div className="file-list">
    <h4>Selected files:</h4>
    <ul>
      {files.map((file, idx) => (
        <li key={idx} className="file-item">
          {file.name}
          <span className="remove-icon" onClick={() => {
            const updatedFiles = [...files];
            updatedFiles.splice(idx, 1);
            setFiles(updatedFiles);
          }}>
            ✖
          </span>
        </li>
      ))}
    </ul>
  </div>
)}

        {/* Option 2: Google Drive */}
        <div className="upload-btn-flex-container">
        <div className="upload-option-btn" onClick={() => alert('Integrate Google Drive API')}>
          <img src={googleDrive}/>
          <p> Use Google Drive</p>
        </div>

        {/* Option 3: Dropbox */}
        <div className="upload-option-btn" onClick={() => alert('Integrate Dropbox API')}>
          <img src={dropBox}/>
          <p> Use Dropbox</p>
        </div>
        </div>
       
<p className="upload-para">Upload ANY file type, but we prefer vector, high-res, or large files such as: .AI, .EPS, .PDF, .TIFF, .PSD, .JPG, .PNG</p>
        {/* Option 4: Upload button */}
        

        <input
          type="file"
          multiple
          ref={inputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />


      </div>

      
    </div>
  );
};

export default UploadArtToolbar;
