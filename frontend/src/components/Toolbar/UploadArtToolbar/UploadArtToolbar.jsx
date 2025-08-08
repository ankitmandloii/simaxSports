import React, { useState, useRef, useEffect } from "react";
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png';
import googleDrive from "../../images/googleDrive.png";
import useDrivePicker from "react-google-drive-picker";
import DropboxPicker from "../../CommonComponent/DropboxPicker";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import style from './UploadArtToolbar.module.css';
import axios from "axios";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

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
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [shouldOpenPicker, setShouldOpenPicker] = useState(false); // 🔁 new state

  const fetchGoogleDriveFileAsBlob = async (fileId, accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const blob = await response.blob();
    return blob;
  };

  const handleFiles = async (files) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    if (files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}imageOperation/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      response.data.files.forEach((fileObj) => {
        dispatch(addImageState({ src: fileObj.url }));
      });
      navigate("/design/addImage");
    } catch (err) {
      toast.error("Error uploading files");
      console.error("Upload error:", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => inputRef.current.click();

  const handleOpenGoogleDrivePicker = () => {
    openPicker({
      clientId: CLIENT_ID,
      developerKey: DEVELOPER_KEY,
      viewId: "DOCS",
      token: googleAccessToken,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: async (data) => {
        if (data.action === "cancel") return;

        if (data.docs && data.docs.length > 0) {
          const driveFilesMeta = data.docs;

          const filesToUpload = await Promise.all(
            driveFilesMeta.map(async (doc) => {
              try {
                const response = await fetch(
                  `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
                  {
                    headers: {
                      Authorization: `Bearer ${googleAccessToken}`,
                    },
                  }
                );
                const blob = await response.blob();
                return new File([blob], doc.name, { type: doc.mimeType });
              } catch (err) {
                toast.error(`Error fetching ${doc.name}`);
                return null;
              }
            })
          );

          const filteredFiles = filesToUpload.filter((f) => f !== null);
          if (filteredFiles.length > 0) {
            await handleFiles(filteredFiles);
            setDriveFiles(driveFilesMeta);
          }
        }
      },
    });
  };

  const loginToGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleAccessToken(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/drive.readonly",
  });

  // 🔁 Trigger picker after login
  useEffect(() => {
    if (googleAccessToken && shouldOpenPicker) {
      handleOpenGoogleDrivePicker();
      setShouldOpenPicker(false); // reset
    }
  }, [googleAccessToken, shouldOpenPicker]);

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Upload Art</h5>
        <h3>Choose Files To Upload</h3>
        <p>Upload your files and personalize them with your favorite font and color!</p>
      </div>

      {!isLoading ? (
        <div className={style.toolbarBox}>
          <div
            className={style.dropZone}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p>Drag & Drop Artwork Files </p>
            <p className={style.marginTop}>or</p>
            <button className={style.uploadFileBtn} onClick={handleClick}>
              <ChooseFileIcon />
              CHOOSE FILE(S)
            </button>
          </div>

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

          <div className={style.uploadBtnFlexContainer}>
            <div
              className={style.uploadOptionBtn}
              onClick={() => {
                if (!googleAccessToken) {
                  setShouldOpenPicker(true); // 🔁 set flag
                  loginToGoogle();           // login first
                } else {
                  handleOpenGoogleDrivePicker(); // already logged in
                }
              }}
            >
              <img src={googleDrive} alt="Google Drive" />
              <p>USE GOOGLE DRIVE</p>
            </div>

            <DropboxPicker
              onFilesSelected={async (files) => {
                if (files && files.length > 0) {
                  console.log("Dropbox selected files:", files);
                  const fetchedFiles = await Promise.all(
                    files.map(async (fileMeta) => {
                      try {
                        const downloadUrl = fileMeta.link;
                        const response = await fetch(downloadUrl);
                        const blob = await response.blob();
                        return new File([blob], fileMeta.name, { type: blob.type });
                      } catch (err) {
                        toast.error(`Error downloading ${fileMeta.name}`);
                        return null;
                      }
                    })
                  );
                  const validFiles = fetchedFiles.filter(Boolean);
                  if (validFiles.length > 0) {
                    await handleFiles(validFiles);
                  }
                }
              }}
            >
              <div className={style.uploadOptionBtn}>
                <img src={dropBox} alt="Dropbox" />
                <p>USE DROPBOX</p>
              </div>
            </DropboxPicker>
          </div>

          <p className={style.uploadPara}>
            Upload ANY file type, but we prefer vector, high-res, or large files such as:
            .JPG, .PNG , .JPEG
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