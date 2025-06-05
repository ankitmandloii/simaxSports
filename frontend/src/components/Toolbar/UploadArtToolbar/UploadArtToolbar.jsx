import React, { useState, useRef } from "react";
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png';
import googleDrive from "../../images/googleDrive.png";
import useDrivePicker from "react-google-drive-picker";
import DropboxPicker from "../../CommonComponent/DropboxPicker";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import style from './UploadArtToolbar.module.css';
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;

const UploadArtToolbar = () => {
  const [files, setFiles] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [dropboxFiles, setDropboxFiles] = useState([]);
  const inputRef = useRef();
  const [openPicker] = useDrivePicker();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFiles = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const src = URL.createObjectURL(file);
      dispatch(addImageState({ src }));

      setIsLoading(true);
      setTimeout(() => {
        navigate("/addImage");
      }, 4000);
    }
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


  const getDriveImageUrl = (file) => {
    const fileId = file.id;
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };


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

        if (data.docs && data.docs.length > 0) {
          const file = data.docs[0];
          const src = getDriveImageUrl(file);
          console.log("Selected file URL:", src);
          dispatch(addImageState({ src }));

          setIsLoading(true);
          setTimeout(() => {
            navigate("/addImage");
          }, 4000);

          setDriveFiles(data.docs);
        }
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

      {!isLoading ? (
        <div className={style.toolbarBox}>
          {/* Drag & Drop */}
          <div
            className={style.dropZone}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p>Drag & drop files here</p>
            <p className={style.marginTop}>or</p>
            <button className={style.uploadFileBtn} onClick={handleClick}>
              <ChooseFileIcon />
              SHARE
            </button>
          </div>

          {/* Local Files */}
          {files.length > 0 && (
            <div className={style.fileList}>
              <h4>Selected files:</h4>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx} className={style.fileItem}>
                    {file.name}
                    <span
                      className={style.removeIcon}
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
            <div className={style.fileList}>
              <h4>Google Drive files:</h4>
              <ul>
                {driveFiles.map((file, idx) => (
                  <li key={idx} className={style.fileItem}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                    <span
                      className={style.removeIcon}
                      onClick={() => {
                        const updated = [...driveFiles];
                        updated.splice(idx, 1);
                        setDriveFiles(updated);
                      }}
                    >
                      ✖
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dropbox Files */}
          {dropboxFiles.length > 0 && (
            <div className={style.fileList}>
              <h4>Dropbox files:</h4>
              <ul>
                {dropboxFiles.map((file, idx) => (
                  <li key={idx} className={style.fileItem}>
                    <a href={file.link} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                    <span
                      className={style.removeIcon}
                      onClick={() => {
                        const updated = [...dropboxFiles];
                        updated.splice(idx, 1);
                        setDropboxFiles(updated);
                      }}
                    >
                      ✖
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Options */}
          <div className={style.uploadBtnFlexContainer}>
            <div className={style.uploadOptionBtn} onClick={handleOpenGoogleDrivePicker}>
              <img src={googleDrive} alt="Google Drive" />
              <p>Use Google Drive</p>
            </div>

            <DropboxPicker onFilesSelected={(files) => {
              if (files && files.length > 0) {
                const file = files[0];
                const src = file.link || file.preview;
                dispatch(addImageState({ src }));

                setIsLoading(true);
                setTimeout(() => {
                  navigate("/addImage");
                }, 4000);

                setDropboxFiles(files);
              }
            }}>
              <div className={style.uploadOptionBtn}>
                <img src={dropBox} alt="Dropbox" />
                <p>Use Dropbox</p>
              </div>
            </DropboxPicker>
          </div>

          <p className={style.uploadPara}>
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
      ) : (
        <div>
          <div className="loader" />
          <p id="prepareHeading">Preparing your files...</p>
        </div>
      )}
    </div>
  );
};

export default UploadArtToolbar;
