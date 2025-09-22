import React, { useEffect } from 'react';
import './UploadBox.css';
import CloseButton from '../CommonComponent/CrossIconCommon/CrossIcon';

const UploadBox = ({ file, imageUrl, onRemoveFile, progress, status, fileName }) => {

  // Determine the display name for the file
  const displayFileName = fileName || (file ? file.name : (imageUrl ? 'Unsplash Image' : 'Loading...'));

  // Determine the image source for the thumbnail
  const imagePreviewSrc = imageUrl || (file ? URL.createObjectURL(file) : '');

  // Cleanup for URL.createObjectURL when component unmounts or file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);


  return (
    <div className="upload-box-overlay">
      <div className="upload-box">
        <div className="header">
          <h3 className='title'>UPLOAD FILES</h3>
          {/* <button className="close-button" onClick={onRemoveFile}>&times;</button> */}
          <CloseButton onClose={onRemoveFile} />
        </div>
        <div className='uploadContent'>
          <p className="upload-description">
            Don't worry, we double check everything to ensure your design prints perfectly.
          </p>

          {(file || imageUrl) && ( // Show item if either file object or imageUrl is present
            <div className="file-upload-item">
              <div className="file-thumbnail">
                {imagePreviewSrc ? (
                  <img src={imagePreviewSrc} alt="File Preview" className="file-preview-image" />
                ) : (
                  <div className="file-placeholder">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <div className="file-info">
                <span className="file-name">{displayFileName}</span>
                <div className="upload-progress-container">
                  <div className="upload-progress-bar" style={{ width: `${progress}%` }}></div>
                  <span className="upload-status-text">
                    {/* Display status based on external prop */}
                    {status === 'fetching' && 'Fetching image from Unsplash...'}
                    {status === 'uploading' && `Uploading File (${progress}%)`}
                    {status === 'complete' && 'Upload Complete!'}
                    {status === 'error' && 'Upload Failed!'}
                  </span>
                </div>
              </div>
              {/* The remove button for the specific file item */}
              <button className="remove-file-button" onClick={onRemoveFile}>&times;</button>
            </div>
          )}

          <div className="copyright-notice">
            <h4>Copyright & Trademark Notice</h4>
            <p>
              You agree and confirm that you own or have the necessary rights to use the images, logos, text,
              and/or trademarks in your design and indemnify Printify.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
// import React, { useEffect } from 'react';
// import styles from './UploadBox.module.css';

// const UploadBox = ({ file, imageUrl, onRemoveFile, progress, status, fileName }) => {

//   // Determine the display name for the file
//   const displayFileName = fileName || (file ? file.name : (imageUrl ? 'Unsplash Image' : 'Loading...'));

//   // Determine the image source for the thumbnail
//   const imagePreviewSrc = imageUrl || (file ? URL.createObjectURL(file) : '');

//   // Cleanup for URL.createObjectURL when component unmounts or file changes
//   useEffect(() => {
//     if (file) {
//       const url = URL.createObjectURL(file);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [file]);


//   return (
//     <div className={styles.uploadBoxOverlay}>
//       <div className={styles.uploadBox}>
//         <div className={styles.uploadBoxHeader}>
//           <h3>UPLOAD FILES</h3>
//           <button className={styles.closeButton} onClick={onRemoveFile}>&times;</button>
//         </div>

//         <p className={styles.uploadDescription}>
//           Don't worry, we double check everything to ensure your design prints perfectly.
//         </p>

//         {(file || imageUrl) && ( // Show item if either file object or imageUrl is present
//           <div className={styles.fileUploadItem}>
//             <div className={styles.fileThumbnail}>
//               {imagePreviewSrc ? (
//                 <img src={imagePreviewSrc} alt="File Preview" className={styles.filePreviewImage} />
//               ) : (
//                 <div className={styles.filePlaceholder}>
//                   <div className={styles.spinner}></div>
//                 </div>
//               )}
//             </div>
//             <div className={styles.fileInfo}>
//               <span className={styles.fileName}>{displayFileName}</span>
//               <div className={styles.uploadProgressContainer}>
//                 <div className={styles.uploadProgressBar} style={{ width: `${progress}%` }}></div>
//                 <span className={styles.uploadStatusText}>
//                   {/* Display status based on external prop */}
//                   {status === 'fetching' && 'Fetching image from Unsplash...'}
//                   {status === 'uploading' && `Uploading File (${progress}%)`}
//                   {status === 'complete' && 'Upload Complete!'}
//                   {status === 'error' && 'Upload Failed!'}
//                 </span>
//               </div>
//             </div>
//             {/* The remove button for the specific file item */}
//             <button className={styles.removeFileButton} onClick={onRemoveFile}>&times;</button>
//           </div>
//         )}

//         <div className={styles.copyrightNotice}>
//           <h4>Copyright & Trademark Notice</h4>
//           <p>
//             You agree and confirm that you own or have the necessary rights to use the images, logos, text,
//             and/or trademarks in your design and indemnify Printify.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadBox;