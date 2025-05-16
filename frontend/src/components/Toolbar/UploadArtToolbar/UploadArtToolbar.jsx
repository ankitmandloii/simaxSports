// import React, { useState, useRef } from "react";
// import './UploadArtToolbar.css';
// import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
// import dropBox from '../../images/dropBox.png';
// import googleDrive from "../../images/googleDrive.png";
// import useDrivePicker from "react-google-drive-picker";


//   const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
 
//   const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;
   


 

// const UploadArtToolbar = () => {
  

//   const [files, setFiles] = useState([]);
//   const [driveFiles, setDriveFiles] = useState([]);
//   const inputRef = useRef();
//   const [openPicker] = useDrivePicker();

//   const handleFiles = (selectedFiles) => {
//     const fileArray = Array.from(selectedFiles);
//     setFiles((prev) => [...prev, ...fileArray]);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFiles(e.dataTransfer.files);
//       e.dataTransfer.clearData();
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleClick = () => {
//     inputRef.current.click();
//   };

//   const handleOpenGoogleDrivePicker = () => {
//     openPicker({
//       clientId: CLIENT_ID,
//       developerKey: DEVELOPER_KEY,
//       viewId: "DOCS", // or DOCS_IMAGES, PDFS etc.
//       showUploadView: true,
//       showUploadFolders: true,
//       supportDrives: true,
//       multiselect: true,
//       callbackFunction: (data) => {
//         if (data.action === "cancel") {
//           console.log("User cancelled picker");
//         } else if (data.docs) {
//           console.log("Picked from Google Drive:", data.docs);
//           setDriveFiles(data.docs);
//         }
//       },
//     });
//   };

//   return (
//     <div className="toolbar-main-container">
//       <div className="toolbar-main-heading">
//         <h5 className="Toolbar-badge">Upload Art</h5>
//         <h3>Choose Files To Upload</h3>
//         <p>You can select multiple products and colors</p>
//       </div>

//       <div className="toolbar-box">
//         {/* Option 1: Drag & Drop */}
//         <div
//           className="upload-option drop-zone"
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//         >
//           <p>Drag & drop files here</p>
//           <p>or</p>
//           <button className="upload-file-btn" onClick={handleClick}>
//             <ChooseFileIcon />
//             SHARE
//           </button>
//         </div>

//         {/* Local files display */}
//         {files.length > 0 && (
//           <div className="file-list">
//             <h4>Selected files:</h4>
//             <ul>
//               {files.map((file, idx) => (
//                 <li key={idx} className="file-item">
//                   {file.name}
//                   <span className="remove-icon" onClick={() => {
//                     const updatedFiles = [...files];
//                     updatedFiles.splice(idx, 1);
//                     setFiles(updatedFiles);
//                   }}>
//                     ✖
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Google Drive Files display */}
//         {driveFiles.length > 0 && (
//           <div className="file-list">
//             <h4>Google Drive files:</h4>
//             <ul>
//               {driveFiles.map((file, idx) => (
//                 <li key={idx} className="file-item">
//                   <a href={file.url} target="_blank" rel="noopener noreferrer">
//                     {file.name}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Option 2: Google Drive */}
//         <div className="upload-btn-flex-container">
//           <div className="upload-option-btn" onClick={handleOpenGoogleDrivePicker}>
//             <img src={googleDrive} alt="Google Drive" />
//             <p>Use Google Drive</p>
//           </div>

//           {/* Option 3: Dropbox */}
//           <div className="upload-option-btn" onClick={() => alert('Integrate Dropbox API')}>
//             <img src={dropBox} alt="Dropbox" />
//             <p>Use Dropbox</p>
//           </div>
//         </div>

//         <p className="upload-para">
//           Upload ANY file type, but we prefer vector, high-res, or large files such as:
//           .AI, .EPS, .PDF, .TIFF, .PSD, .JPG, .PNG
//         </p>

//         {/* Hidden file input */}
//         <input
//           type="file"
//           multiple
//           ref={inputRef}
//           style={{ display: "none" }}
//           onChange={(e) => handleFiles(e.target.files)}
//         />
//       </div>
//     </div>
//   );
// };

// export default UploadArtToolbar;










import React, { useState, useRef } from "react";
import './UploadArtToolbar.css';
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png';
import googleDrive from "../../images/googleDrive.png";
import useDrivePicker from "react-google-drive-picker";
import DropboxPicker from "../../CommonComponent/DropboxPicker";


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;

const UploadArtToolbar = () => {
  const [files, setFiles] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const inputRef = useRef();
  const [openPicker] = useDrivePicker();

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

  const handleClick = () => inputRef.current.click();

  const handleOpenGoogleDrivePicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: DEVELOPER_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") return;
        if (data.docs) setDriveFiles(data.docs);
      },
    });
  };

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Upload Art</h5>
        <h3>Choose Files To Upload</h3>
        <p>You can select multiple products and colors</p>
      </div>

      <div className="toolbar-box">
        {/* Drag & Drop */}
        <div
          className="upload-option drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p>Drag & drop files here</p>
          <p>or</p>
          <button className="upload-file-btn" onClick={handleClick}>
            <ChooseFileIcon />
            SHARE
          </button>
        </div>

        {/* Local Files */}
        {files.length > 0 && (
          <div className="file-list">
            <h4>Selected files:</h4>
            <ul>
              {files.map((file, idx) => (
                <li key={idx} className="file-item">
                  {file.name}
                  <span
                    className="remove-icon"
                    onClick={() => {
                      const updated = [...files];
                      updated.splice(idx, 1);
                      setFiles(updated);
                    }}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Google Drive Files */}
        {driveFiles.length > 0 && (
          <div className="file-list">
            <h4>Google Drive files:</h4>
            <ul>
              {driveFiles.map((file, idx) => (
                <li key={idx} className="file-item">
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dropbox Files */}
        {dropboxFiles.length > 0 && (
          <div className="file-list">
            <h4>Dropbox files:</h4>
            <ul>
              {dropboxFiles.map((file, idx) => (
                <li key={idx} className="file-item">
                  <a href={file.link} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Options */}
        <div className="upload-btn-flex-container">
          <div className="upload-option-btn" onClick={handleOpenGoogleDrivePicker}>
            <img src={googleDrive} alt="Google Drive" />
            <p>Use Google Drive</p>
          </div>

          <DropboxPicker onFilesSelected={setDropboxFiles}>
            <div className="upload-option-btn">
              <img src={dropBox} alt="Dropbox" />
              <p>Use Dropbox</p>
            </div>
          </DropboxPicker>
        </div>

        <p className="upload-para">
          Upload ANY file type, but we prefer vector, high-res, or large files such as:
          .AI, .EPS, .PDF, .TIFF, .PSD, .JPG, .PNG
        </p>

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
