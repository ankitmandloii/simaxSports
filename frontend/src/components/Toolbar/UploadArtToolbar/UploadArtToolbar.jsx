import React, { useState, useRef } from "react";
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png';
import googleDrive from "../../images/googleDrive.png";
import { useGoogleLogin } from '@react-oauth/google';
import DropboxPicker from "../../CommonComponent/DropboxPicker";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import style from './UploadArtToolbar.module.css';
import axios from "axios";
import { toast } from "react-toastify";

const UploadArtToolbar = () => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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

  const googleDriveLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/drive/v3/files',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
            params: {
              pageSize: 20,
              fields: 'files(id, name, mimeType)',
              q: "mimeType contains 'image/'"
            },
          }
        );

        const files = res.data.files;
        window._googleAccessToken = tokenResponse.access_token;

        for (const file of files) {
          const blobRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );
          const blob = await blobRes.blob();
          const fetchedFile = new File([blob], file.name, { type: blob.type });
          await handleFiles([fetchedFile]);
        }

      } catch (err) {
        console.error("Google Drive API error:", err);
        toast.error("Failed to upload Google Drive files");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="toolbar-main-container">
      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Upload Art</h5>
        <h3>Choose Files To Upload</h3>
        <p>You can select multiple products and colors</p>
      </div>

      {!isLoading ? (
        <div className={style.toolbarBox}>
          <div className={style.dropZone} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <p>Drag & drop files here</p>
            <p className={style.marginTop}>or</p>
            <button className={style.uploadFileBtn} onClick={handleClick}>
              <ChooseFileIcon />
              SHARE
            </button>
          </div>

          {files.length > 0 && (
            <div className={style.fileList}>
              <h4>Selected files:</h4>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx} className={style.fileItem}>
                    {file.name}
                    <span className={style.removeIcon} onClick={() => {
                      const updated = [...files];
                      updated.splice(idx, 1);
                      setFiles(updated);
                    }}>✖</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={style.uploadBtnFlexContainer}>
            <div className={style.uploadOptionBtn} onClick={() => googleDriveLogin()}>
              <img src={googleDrive} alt="Google Drive" />
              <p>Use Google Drive</p>
            </div>

            <DropboxPicker
              onFilesSelected={async (files) => {
                if (files && files.length > 0) {
                  const fetchedFiles = await Promise.all(
                    files.map(async (fileMeta) => {
                      const response = await fetch(fileMeta.link);
                      const blob = await response.blob();
                      return new File([blob], fileMeta.name, { type: blob.type });
                    })
                  );
                  await handleFiles(fetchedFiles); // Upload immediately without showing name
                }
              }}
            >
              <div className={style.uploadOptionBtn}>
                <img src={dropBox} alt="Dropbox" />
                <p>Use Dropbox</p>
              </div>
            </DropboxPicker>
          </div>

          <p className={style.uploadPara}>
            Upload ANY file type, but we prefer vector, high-res, or large files such as: .AI, .EPS, .PDF, .TIFF, .PSD, .JPG, .PNG
          </p>

          <input type="file" multiple ref={inputRef} style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
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
