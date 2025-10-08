import React, { useEffect, useState } from 'react';
import './UploadBox.css';
import CloseButton from '../CommonComponent/CrossIconCommon/CrossIcon';
import { RxCross2 } from "react-icons/rx";


const UploadBox = ({ file, imageUrl, onRemoveFile, progress, status = "uploading", fileName }) => {
  // // Use a ref for the interval to manage it properly
  // const [progress, setProgress] = useState(10);

  // // Use useEffect to manage the progress interval and ensure it stops at 100
  // useEffect(() => {
  //   // Only run the interval if the status is 'uploading'
  //   if (status === 'uploading' && progress < 100) {
  //     const interval = setInterval(() => {
  //       setProgress(prevProgress => {
  //         // Calculate the next progress, capping it at 100
  //         const nextProgress = prevProgress + 10;
  //         return nextProgress >= 100 ? 100 : nextProgress;
  //       });
  //     }, 1000);

  //     // Clear the interval when the component unmounts or when progress reaches 100
  //     return () => clearInterval(interval);
  //   }
  // }, [progress, status]); // Re-run effect when progress or status changes


  // Determine the display name for the file
  // Restored original logic but with the ternary fix you had:
  const displayFileName = fileName || (file ? file.name : (imageUrl ? 'Unsplash Image' : 'Loading...'));

  // Determine the image source for the thumbnail
  // Restored original logic:
  const imagePreviewSrc = imageUrl || (file ? URL.createObjectURL(file) : 'https://simaxdesigns.imgix.net/uploads/1759402293724_k92xqc7tnhw26kvotgwgy.png');

  // Cleanup for URL.createObjectURL when component unmounts or file changes
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);


  // Helper function to determine the status text
  const getStatusText = () => {
    switch (status) {
      case 'fetching':
        return 'Fetching image from server...';
      case 'uploading':
        // Display percentage during upload
        return `Uploading File (${progress}%)`;
      case 'complete':
        // Display 100% on completion
        return `Upload Complete! (100%)`;
      case 'error':
        // You could optionally show the progress at the time of error here
        return `Upload Failed! (${progress}%)`;
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="upload-box-overlay">
      <div className="upload-box">
        <div className="header">
          <h3 className='title'>UPLOAD FILES</h3>
          <CloseButton onClose={onRemoveFile} />
        </div>
        <div className='uploadContent'>
          <p className="upload-description">
            Don't worry, we double check everything to ensure your design prints perfectly.
          </p>

          {(file || imageUrl || true) && (
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
                  {/* Use Math.min to ensure progress bar doesn't exceed 100% */}
                  <div className="upload-progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
                <span className="upload-status-text">
                  {/* Display status and percentage */}
                  {getStatusText()}
                </span>
              </div>
              <button className="remove-file-button" onClick={onRemoveFile}><RxCross2 /></button>
            </div>
          )}

          <div className="copyright-notice">
            <h4>Copyright & Trademark Notice</h4>
            <p>
              You agree and confirm that you own or have the necessary rights to use the images, logos, text,
              and/or trademarks in your design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBox;