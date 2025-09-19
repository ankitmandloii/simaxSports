import React, { useState, useRef, useEffect } from "react";
import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
import dropBox from '../../images/dropBox.png';
import googleDrive from "../../images/googleDrive.png";
import useDrivePicker from "react-google-drive-picker";
import DropboxPicker from "../../CommonComponent/DropboxPicker";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import style from './UploadArtToolbar.module.css';
import axios from "axios";
import { toast } from "react-toastify";
import ExifReader from "exifreader";
import { useGoogleLogin } from "@react-oauth/google";
import { BsFileEarmarkImageFill } from "react-icons/bs";

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
  const [shouldOpenPicker, setShouldOpenPicker] = useState(false);
  const { data: settings, loading } = useSelector((state) => state.settingsReducer);
  const settingsForUploadSection = settings?.uploadSettings || {};

  // NEW: Drag overlay state
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const validateImageDPI = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      // console.log("Full EXIF tags:", tags);
      let dpi = null;
      const xDpi = tags.XResolution?.value;
      const yDpi = tags.YResolution?.value;
      const resolutionUnit = tags.ResolutionUnit?.value;

      // console.log("XResolution:", xDpi, "YResolution:", yDpi, "ResolutionUnit:", resolutionUnit);

      // Only use EXIF DPI if ResolutionUnit is 2 (inches) and values are reasonable
      if (xDpi && yDpi && resolutionUnit === 2 && Math.max(xDpi, yDpi) > 1) {
        dpi = Math.max(xDpi, yDpi);
        // console.log("Calculated DPI from EXIF:", dpi);
      } else {
        console.log("Invalid or missing EXIF DPI data, using fallback estimation");
        // Fallback to estimateDPI logic
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = url;
        });
        dpi = estimateDPI(file, img.width, img.height);
        URL.revokeObjectURL(url); // Clean up
        console.log("Estimated DPI:", dpi);
      }

      const imageBitmap = await createImageBitmap(file);
      const { width, height } = imageBitmap;
      const isHighRes = width >= 1000 || height >= 1000;
      const isPrintReady = width >= 1200 && height >= 1200;

      if (!dpi && !isHighRes) {
        // console.log(`${file.name} flagged as low quality due to no DPI and small size`);
        return {
          valid: true,
          warning: `${file.name} is low quality (no DPI data and small size). Consider using super resolution to enhance quality.`,
          dpi
        };
      }

      if (dpi && dpi < 300 && !isPrintReady) {
        // console.log(`${file.name} flagged as not print-ready due to DPI < 300 or small dimensions`);
        return {
          valid: true,
          warning: `${file.name} may not be print-ready (DPI < 300 or small dimensions). Consider using super resolution to enhance quality.`,
          dpi
        };
      }

      // console.log(`${file.name} DPI validated as:`, dpi);
      return { valid: true, dpi };
    } catch (error) {
      console.error("Error reading EXIF data:", error);
      console.log("Falling back to DPI estimation due to error");
      // Fallback to estimateDPI logic on error
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = url;
      });
      const dpi = estimateDPI(file, img.width, img.height);
      URL.revokeObjectURL(url); // Clean up
      console.log("Estimated DPI on error:", dpi);
      return { valid: true, dpi };
    }
  };

  const estimateDPI = (file, width, height) => {
    const fileSizeKB = file.size / 1024;
    const megapixels = (width * height) / 1000000;
    if (fileSizeKB > megapixels * 800) return 300;
    if (fileSizeKB > megapixels * 300) return 150;
    return 72;
  };

  const handleFiles = async (files) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const stateForSuperResolution = [];
    const dpiValues = [];
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const result = await validateImageDPI(file);
        if (result.warning) {
          stateForSuperResolution[i] = true;
        }
        dpiValues[i] = result.dpi;
      }
      formData.append("images", file);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}imageOperation/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      response.data.files.forEach((fileObj, index) => {
        dispatch(addImageState({
          src: `${fileObj.url}`,
          dpi: dpiValues[index] || null
        }));
      });
      console.log("upload response", response);
      navigate("/design/addImage");
    } catch (err) {
      console.log("upload error", err);

      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Drag handlers
  useEffect(() => {
    const handleWindowDragEnter = (e) => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragging(true);
    };

    const handleWindowDragLeave = (e) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleWindowDrop = (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    };

    const handleWindowDragOver = (e) => {
      e.preventDefault(); // required to allow drop
    };

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("drop", handleWindowDrop);
    window.addEventListener("dragover", handleWindowDragOver);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
      window.removeEventListener("dragover", handleWindowDragOver);
    };
  }, []);

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
          const filesToUpload = await Promise.all(
            data.docs.map(async (doc) => {
              try {
                const response = await fetch(
                  `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
                  { headers: { Authorization: `Bearer ${googleAccessToken}` } }
                );
                const blob = await response.blob();
                return new File([blob], doc.name, { type: doc.mimeType });
              } catch {
                toast.error(`Error fetching ${doc.name}`);
                return null;
              }
            })
          );
          const filteredFiles = filesToUpload.filter(Boolean);
          if (filteredFiles.length > 0) {
            await handleFiles(filteredFiles);
            setDriveFiles(data.docs);
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

  useEffect(() => {
    if (googleAccessToken && shouldOpenPicker) {
      handleOpenGoogleDrivePicker();
      setShouldOpenPicker(false);
    }
  }, [googleAccessToken, shouldOpenPicker]);

  return (
    <div className="toolbar-main-container">
      {/* Full screen overlay */}
      {isDragging && (
        <div className={style.fullScreenOverlay} onClick={handleClick}>
          <div className={style.overlayContent}>
            <div className={style.dashed}>
              <span className={style.fileIcon}><BsFileEarmarkImageFill /></span>
              <h1>Drag & Drop Artwork Files</h1>
              <p>Your artwork will be centered within your product</p>
              <p>You can adjust the placement after upload</p>
            </div>
          </div>
        </div>
      )}

      <div className="toolbar-main-heading">
        <h5 className="Toolbar-badge">Upload Art</h5>
        <h3>Choose Files To Upload</h3>
        <p>Upload your files and personalize them with your favorite font and color!</p>
      </div>

      {!isLoading ? (
        <div className={style.toolbarBox}>
          <div
            className={style.dropZone}
            onDragOver={(e) => e.preventDefault()}
          >
            <p>Drag & Drop Artwork Files </p>
            <p className={style.marginTop}>or</p>
            <button className={style.uploadFileBtn} onClick={handleClick}>
              <ChooseFileIcon />
              CHOOSE FILE(S)
            </button>
          </div>
          <div className={style.uploadBtnFlexContainer}>
            {settingsForUploadSection?.enableGoogleDrive && (
              <div
                className={style.uploadOptionBtn}
                onClick={() => {
                  if (!googleAccessToken) {
                    setShouldOpenPicker(true);
                    loginToGoogle();
                  } else {
                    handleOpenGoogleDrivePicker();
                  }
                }}
              >
                <img src={googleDrive} alt="Google Drive" />
                <p>USE GOOGLE DRIVE</p>
              </div>
            )}

            <DropboxPicker
              onFilesSelected={async (files) => {
                if (files && files.length > 0) {
                  const fetchedFiles = await Promise.all(
                    files.map(async (fileMeta) => {
                      try {
                        const response = await fetch(fileMeta.link);
                        const blob = await response.blob();
                        return new File([blob], fileMeta.name, { type: blob.type });
                      } catch {
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
              {settingsForUploadSection?.enableDropbox && (
                <div className={style.uploadOptionBtn}>
                  <img src={dropBox} alt="Dropbox" />
                  <p>USE DROPBOX</p>
                </div>
              )}
            </DropboxPicker>
          </div>

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