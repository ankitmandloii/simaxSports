// import React, { useState, useRef, useEffect } from "react";
// import { ChooseFileIcon } from "../../iconsSvg/CustomIcon";
// import dropBox from '../../images/dropBox.png';
// import googleDrive from "../../images/googleDrive.png";
// import useDrivePicker from "react-google-drive-picker";
// import DropboxPicker from "../../CommonComponent/DropboxPicker";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
// import style from './UploadArtToolbar.module.css';
// import axios from "axios";
// import { toast } from "react-toastify";
// import ExifReader from "exifreader"
// import { useGoogleLogin } from "@react-oauth/google";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const DEVELOPER_KEY = process.env.REACT_APP_DEVELOPER_KEY;

// const UploadArtToolbar = () => {
//   const [files, setFiles] = useState([]);
//   const [driveFiles, setDriveFiles] = useState([]);
//   const [dropboxFiles, setDropboxFiles] = useState([]);
//   const inputRef = useRef();
//   const [openPicker] = useDrivePicker();
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const dispatch = useDispatch();
//   const [googleAccessToken, setGoogleAccessToken] = useState(null);
//   const [shouldOpenPicker, setShouldOpenPicker] = useState(false); // 🔁 new state

//   const fetchGoogleDriveFileAsBlob = async (fileId, accessToken) => {
//     const response = await fetch(
//       `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     const blob = await response.blob();
//     return blob;
//   };
//   const validateImageDPI = async (file) => {

//     try {

//       const arrayBuffer = await file.arrayBuffer();

//       const tags = ExifReader.load(arrayBuffer);

//       console.log(`Tags for ${file.name}:`, tags);

//       const xDpi = tags.XResolution?.value;

//       const yDpi = tags.YResolution?.value;

//       const resUnit = tags["Resolution Unit"]?.value;

//       let isDpiValid = false;

//       let isLowDpiWarning = false;

//       if (xDpi && yDpi) {

//         const dpi = Math.max(xDpi, yDpi);

//         console.log(`${file.name} - DPI: ${dpi}`);

//         if (dpi >= 300) {

//           isDpiValid = true;

//         } else if (dpi >= 100) {

//           isDpiValid = true;

//           isLowDpiWarning = true;

//         }

//       }

//       const imageBitmap = await createImageBitmap(file);

//       const { width, height } = imageBitmap;

//       console.log(`${file.name} - resolution: ${width}x${height}`);

//       const isHighRes = width >= 1000 || height >= 1000;

//       const isPrintReady = width >= 1200 && height >= 1200;

//       if (!isDpiValid && !isHighRes) {

//         return {

//           valid: true,

//           warning: `${file.name} is low quality (DPI < 100 and small size). Consider using super resolution to enhance quality.`,

//         };

//       }

//       if (isLowDpiWarning || !isPrintReady) {

//         return {

//           valid: true,

//           warning: `${file.name} may not be print-ready (DPI < 300 or small dimensions). Consider using super resolution to enhance quality.`,

//         };

//       }

//       return { valid: true };

//     } catch (error) {

//       console.warn(`Failed to read DPI or resolution for ${file.name}:`, error);

//       return { valid: true };

//     }

//   };

//   const handleFiles = async (files) => {

//     const BASE_URL = process.env.REACT_APP_BASE_URL;
//     const stateForSuperResolution = [];

//     if (!files.length) return;

//     const formData = new FormData();

//     const warnings = [];

//     for (let i = 0; i < files.length; i++) {

//       const file = files[i];

//       if (file.type.startsWith("image/")) {

//         const result = await validateImageDPI(file);

//         if (result.warning) {
//           stateForSuperResolution[i] = true;
//           // warnings.push(result.warning);

//         }

//       }

//       formData.append("images", file);

//     }

//     if (warnings.length > 0) {

//       warnings.forEach(msg => toast.warn(msg, {

//         style: {

//           width: "600px",

//           whiteSpace: "pre-wrap",

//         },

//       }));

//     }

//     if (!formData.has("images")) {

//       return;

//     }

//     try {

//       setIsLoading(true);

//       const response = await axios.post(

//         `${BASE_URL}imageOperation/upload`,

//         formData,

//         { headers: { "Content-Type": "multipart/form-data" } }

//       );

//       response.data.files.forEach((fileObj, index) => {

//         dispatch(addImageState({ src: `${fileObj.url}${stateForSuperResolution[index] ? "?auto=enhance&sharp=80&upscale=true" : ""}` }));
//         // dispatch(addImageState({ src: `${fileObj.url}` }));

//       });

//       navigate("/design/addImage");

//     } catch (err) {

//       toast.error(err.message, {

//         style: {

//           width: "600px",

//           whiteSpace: "pre-wrap",

//         },

//       });

//       console.error("Upload error:", err.response?.data || err.message);

//     } finally {

//       setIsLoading(false);

//     }

//   };

//   // const handleFiles = async (files) => {
//   //   const BASE_URL = process.env.REACT_APP_BASE_URL;
//   //   if (files.length === 0) return;

//   //   const formData = new FormData();
//   //   for (let i = 0; i < files.length; i++) {
//   //     formData.append("images", files[i]);
//   //   }

//   //   try {
//   //     setIsLoading(true);
//   //     const response = await axios.post(
//   //       `${BASE_URL}imageOperation/upload`,
//   //       formData,
//   //       { headers: { "Content-Type": "multipart/form-data" } }
//   //     );

//   //     response.data.files.forEach((fileObj) => {
//   //       dispatch(addImageState({ src: fileObj.url }));
//   //     });
//   //     navigate("/design/addImage");
//   //   } catch (err) {
//   //     toast.error("Error uploading files");
//   //     console.error("Upload error:", err.response?.data || err.message);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       await handleFiles(e.dataTransfer.files);
//       e.dataTransfer.clearData();
//     }
//   };

//   const handleClick = () => inputRef.current.click();

//   const handleOpenGoogleDrivePicker = () => {
//     openPicker({
//       clientId: CLIENT_ID,
//       developerKey: DEVELOPER_KEY,
//       viewId: "DOCS",
//       token: googleAccessToken,
//       showUploadView: true,
//       showUploadFolders: true,
//       supportDrives: true,
//       multiselect: true,
//       callbackFunction: async (data) => {
//         if (data.action === "cancel") return;

//         if (data.docs && data.docs.length > 0) {
//           const driveFilesMeta = data.docs;

//           const filesToUpload = await Promise.all(
//             driveFilesMeta.map(async (doc) => {
//               try {
//                 const response = await fetch(
//                   `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
//                   {
//                     headers: {
//                       Authorization: `Bearer ${googleAccessToken}`,
//                     },
//                   }
//                 );
//                 const blob = await response.blob();
//                 return new File([blob], doc.name, { type: doc.mimeType });
//               } catch (err) {
//                 toast.error(`Error fetching ${doc.name}`);
//                 return null;
//               }
//             })
//           );

//           const filteredFiles = filesToUpload.filter((f) => f !== null);
//           if (filteredFiles.length > 0) {
//             await handleFiles(filteredFiles);
//             setDriveFiles(driveFilesMeta);
//           }
//         }
//       },
//     });
//   };

//   const loginToGoogle = useGoogleLogin({
//     onSuccess: (tokenResponse) => {
//       setGoogleAccessToken(tokenResponse.access_token);
//     },
//     scope: "https://www.googleapis.com/auth/drive.readonly",
//   });

//   // 🔁 Trigger picker after login
//   useEffect(() => {
//     if (googleAccessToken && shouldOpenPicker) {
//       handleOpenGoogleDrivePicker();
//       setShouldOpenPicker(false); // reset
//     }
//   }, [googleAccessToken, shouldOpenPicker]);

//   return (
//     <div className="toolbar-main-container">
//       <div className="toolbar-main-heading">
//         <h5 className="Toolbar-badge">Upload Art</h5>
//         <h3>Choose Files To Upload</h3>
//         <p>Upload your files and personalize them with your favorite font and color!</p>
//       </div>

//       {!isLoading ? (
//         <div className={style.toolbarBox}>
//           <div
//             className={style.dropZone}
//             onDrop={handleDrop}
//             onDragOver={(e) => e.preventDefault()}
//           >
//             <p>Drag & Drop Artwork Files </p>
//             <p className={style.marginTop}>or</p>
//             <button className={style.uploadFileBtn} onClick={handleClick}>
//               <ChooseFileIcon />
//               CHOOSE FILE(S)
//             </button>
//           </div>

//           {files.length > 0 && (
//             <div className={style.fileList}>
//               <h4>Selected files:</h4>
//               <ul>
//                 {files.map((file, idx) => (
//                   <li key={idx} className={style.fileItem}>
//                     {file.name}
//                     <span
//                       className={style.removeIcon}
//                       onClick={() => {
//                         const updated = [...files];
//                         updated.splice(idx, 1);
//                         setFiles(updated);
//                       }}
//                     >
//                       ✖
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {driveFiles.length > 0 && (
//             <div className={style.fileList}>
//               <h4>Google Drive files:</h4>
//               <ul>
//                 {driveFiles.map((file, idx) => (
//                   <li key={idx} className={style.fileItem}>
//                     <a href={file.url} target="_blank" rel="noopener noreferrer">
//                       {file.name}
//                     </a>
//                     <span
//                       className={style.removeIcon}
//                       onClick={() => {
//                         const updated = [...driveFiles];
//                         updated.splice(idx, 1);
//                         setDriveFiles(updated);
//                       }}
//                     >
//                       ✖
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {dropboxFiles.length > 0 && (
//             <div className={style.fileList}>
//               <h4>Dropbox files:</h4>
//               <ul>
//                 {dropboxFiles.map((file, idx) => (
//                   <li key={idx} className={style.fileItem}>
//                     <a href={file.link} target="_blank" rel="noopener noreferrer">
//                       {file.name}
//                     </a>
//                     <span
//                       className={style.removeIcon}
//                       onClick={() => {
//                         const updated = [...dropboxFiles];
//                         updated.splice(idx, 1);
//                         setDropboxFiles(updated);
//                       }}
//                     >
//                       ✖
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className={style.uploadBtnFlexContainer}>
//             <div
//               className={style.uploadOptionBtn}
//               onClick={() => {
//                 if (!googleAccessToken) {
//                   setShouldOpenPicker(true); // 🔁 set flag
//                   loginToGoogle();           // login first
//                 } else {
//                   handleOpenGoogleDrivePicker(); // already logged in
//                 }
//               }}
//             >
//               <img src={googleDrive} alt="Google Drive" />
//               <p>USE GOOGLE DRIVE</p>
//             </div>

//             <DropboxPicker
//               onFilesSelected={async (files) => {
//                 if (files && files.length > 0) {
//                   console.log("Dropbox selected files:", files);
//                   const fetchedFiles = await Promise.all(
//                     files.map(async (fileMeta) => {
//                       try {
//                         const downloadUrl = fileMeta.link;
//                         const response = await fetch(downloadUrl);
//                         const blob = await response.blob();
//                         return new File([blob], fileMeta.name, { type: blob.type });
//                       } catch (err) {
//                         toast.error(`Error downloading ${fileMeta.name}`);
//                         return null;
//                       }
//                     })
//                   );
//                   const validFiles = fetchedFiles.filter(Boolean);
//                   if (validFiles.length > 0) {
//                     await handleFiles(validFiles);
//                   }
//                 }
//               }}
//             >
//               <div className={style.uploadOptionBtn}>
//                 <img src={dropBox} alt="Dropbox" />
//                 <p>USE DROPBOX</p>
//               </div>
//             </DropboxPicker>
//           </div>

//           <p className={style.uploadPara}>
//             Upload ANY file type, but we prefer vector, high-res, or large files such as:
//             .JPG, .PNG , .JPEG
//           </p>

//           <input
//             type="file"
//             multiple
//             ref={inputRef}
//             style={{ display: "none" }}
//             onChange={(e) => handleFiles(e.target.files)}
//           />
//         </div>
//       ) : (
//         <div>
//           <div className="loader" />
//           <p id="prepareHeading">Preparing your files...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadArtToolbar;
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

  // NEW: Drag overlay state
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const validateImageDPI = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      const xDpi = tags.XResolution?.value;
      const yDpi = tags.YResolution?.value;

      let isDpiValid = false;
      let isLowDpiWarning = false;

      if (xDpi && yDpi) {
        const dpi = Math.max(xDpi, yDpi);
        if (dpi >= 300) {
          isDpiValid = true;
        } else if (dpi >= 100) {
          isDpiValid = true;
          isLowDpiWarning = true;
        }
      }

      const imageBitmap = await createImageBitmap(file);
      const { width, height } = imageBitmap;
      const isHighRes = width >= 1000 || height >= 1000;
      const isPrintReady = width >= 1200 && height >= 1200;

      if (!isDpiValid && !isHighRes) {
        return {
          valid: true,
          warning: `${file.name} is low quality (DPI < 100 and small size). Consider using super resolution to enhance quality.`,
        };
      }

      if (isLowDpiWarning || !isPrintReady) {
        return {
          valid: true,
          warning: `${file.name} may not be print-ready (DPI < 300 or small dimensions). Consider using super resolution to enhance quality.`,
        };
      }

      return { valid: true };
    } catch {
      return { valid: true };
    }
  };

  const handleFiles = async (files) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const stateForSuperResolution = [];
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const result = await validateImageDPI(file);
        if (result.warning) {
          stateForSuperResolution[i] = true;
        }
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
          // src: `${fileObj.url}${stateForSuperResolution[index] ? "?auto=enhance&sharp=80&upscale=true" : ""}`
          src: `${fileObj.url}`
        }));
      });

      navigate("/design/addImage");
    } catch (err) {
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
  // const handleDrop = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
  //     await handleFiles(e.dataTransfer.files);
  //     e.dataTransfer.clearData();
  //   }
  // };

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
            {/* <button className={style.uploadFileBtn}>
              <ChooseFileIcon />
              CHOOSE FILE(S)
            </button> */}
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
            // onDrop={handleDrop}
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
              <div className={style.uploadOptionBtn}>
                <img src={dropBox} alt="Dropbox" />
                <p>USE DROPBOX</p>
              </div>
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
