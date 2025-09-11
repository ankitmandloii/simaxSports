import React, { useState } from 'react';
import axios from 'axios';
import styles from './ReplaceBg.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { useDispatch } from 'react-redux';
// import { addImageState, updateImageState } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { toast } from 'react-toastify';
import UploadBox from '../../utils/UploadBox';
import { useNavigate } from 'react-router-dom';

const ReplaceBg = ({ replacebgwithAi, setreplaceBgwithAi, img, replaceBgHandler }) => {
    console.log("========img", img);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [resultBlob, setResultBlob] = useState(null); // Store the blob for upload
    const [showUploadBox, setShowUploadBox] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [currentUploadFileInfo, setCurrentUploadFileInfo] = useState(null);
    const [uploadAbortController, setUploadAbortController] = useState(null);
    const [generateAbortController, setGenerateAbortController] = useState(null);

    // const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);

    // const selectedImageId = useSelector((state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId);


    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://simax-sports-x93p.vercel.app/api/';
    const apiKey = process.env.GENERATE_API_KEY;
    // Convert image URL to File object
    const urlToFile = async (url, filename, mimeType) => {
        try {
            console.log('Fetching URL:', url);
            const res = await fetch(url, { mode: 'cors' });
            console.log('Fetch response:', res.status, res.statusText);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to fetch image: ${res.status} ${res.statusText} - ${text}`);
            }
            const buffer = await res.arrayBuffer();
            if (!buffer.byteLength) {
                throw new Error('Empty buffer received');
            }
            return new File([buffer], filename, { type: mimeType });
        } catch (err) {
            console.error('Error in urlToFile:', err.message, { url, filename, mimeType });
            throw err;
        }
    };

    // Resize image
    const resizeImage = async (imageUrl, maxWidth = 1024, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas is empty'));
                            return;
                        }
                        const file = new File([blob], 'resized-image.jpg', { type: 'image/jpeg' });
                        resolve(file);
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = (err) => {
                console.error('Image load error:', err, { imageUrl });
                reject(err);
            };
            img.src = imageUrl;
        });
    };

    // Handle Generate Background
    const handleGenerate = async () => {
        if (!prompt) {
            toast.warn("Please enter a prompt first");
            // alert('Please enter a prompt first');
            return;
        }

        setLoading(true);
        const controller = new AbortController();
        setGenerateAbortController(controller);
        try {
            console.log('Generating with img.src:', img.src);
            const file = await urlToFile(img.src, 'image.jpg', 'image/jpeg');
            const formData = new FormData();
            const resizedImage = await resizeImage(img.src, 1024);
            formData.append('image', resizedImage);
            formData.append('prompt', prompt);
            formData.append('model', 'gpt-image-1');
            formData.append('size', '1024x1024');
            formData.append('n', '1');

            const res = await fetch(`${BASE_URL}imageOperation/editImageByAi`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`
                },
                body: formData,
                signal: controller.signal,
            });
            console.log('editImageByAi response:', res.status, res.statusText);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to generate image: ${res.status} ${res.statusText} - ${errorText}`);
            }

            const blob = await res.blob();
            if (!blob.size) {
                throw new Error('Empty blob received from editImageByAi');
            }
            const objectURL = URL.createObjectURL(blob);
            setResultImage(objectURL);
            setResultBlob(blob); // Store the blob for upload
        } catch (err) {
            console.error('Error generating background:', err.message, { imgSrc: img.src });
            // alert(`Error generating background: ${err.message}`);
            toast.error(`Error generating background: ${err.message}`)
        } finally {
            setLoading(false);
            setGenerateAbortController(null);
        }
    };

    // Handle image upload
    const handleFiles = async (imageUrl) => {
        setShowUploadBox(true);
        setUploadProgress(0);
        setUploadStatus('preparing');
        setCurrentUploadFileInfo({
            file: null,
            imageUrl: imageUrl,
            name: `generated-image-${Date.now()}.jpg`
        });

        const controller = new AbortController();
        setUploadAbortController(controller);

        try {
            let file;
            if (imageUrl === resultImage && resultBlob) {
                console.log('Using stored resultBlob for upload');
                file = new File([resultBlob], `generated-image-${Date.now()}.jpg`, { type: resultBlob.type });
            } else {
                console.log('Fetching image via fetch-image endpoint:', imageUrl);
                const fetchUrl = `${BASE_URL}imageOperation/fetch-image?url=${encodeURIComponent(imageUrl)}`;
                const response = await fetch(fetchUrl, { signal: controller.signal, mode: 'cors' });

                console.log('fetch-image response:', response.status, response.statusText);
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${text}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType?.startsWith('image/')) {
                    throw new Error(`Invalid content type: ${contentType}`);
                }

                const blob = await response.blob();
                if (!blob.size) {
                    throw new Error('Empty blob received from fetch-image');
                }
                file = new File([blob], `generated-image-${Date.now()}.jpg`, { type: blob.type });
            }

            setCurrentUploadFileInfo(prev => ({ ...prev, file }));
            setUploadStatus('uploading');

            const formData = new FormData();
            formData.append('images', file);

            const uploadResponse = await axios.post(
                `${BASE_URL}imageOperation/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    signal: controller.signal,
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                }
            );

            console.log('Upload response:', uploadResponse.data);
            if (!Array.isArray(uploadResponse.data.files)) {
                throw new Error('Invalid upload response structure');
            }

            setUploadStatus('complete');
            uploadResponse.data.files.forEach((fileObj) => {
                if (!fileObj.url) throw new Error('File object missing URL');
                // img.src = fileObj.url;
                // dispatch(updateImageState({
                //     id: selectedImageId,
                //     changes: { src: fileObj.url },
                //     side: activeSide,
                //     isRenderOrNot: true
                // }));
                replaceBgHandler(fileObj.url);
            });

            setTimeout(() => {
                setShowUploadBox(false);
                setreplaceBgwithAi(true);
                setCurrentUploadFileInfo(null);
                navigate('/design/addImage');
            }, 1500);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error in handleFiles:', err.message, { imageUrl });
                toast.error(`Error uploading image: ${err.message}`);
            }
            setUploadStatus('error');
            setUploadProgress(0);
            setTimeout(() => {
                setShowUploadBox(false);
                setCurrentUploadFileInfo(null);
            }, 2000);
        }
    };

    // Handle closing the UploadBox
    const handleCloseUploadBox = () => {
        if (uploadAbortController) {
            uploadAbortController.abort();
            setUploadAbortController(null);
        }
        if (generateAbortController) {
            generateAbortController.abort();
            setGenerateAbortController(null);
        }
        setShowUploadBox(false);
        setUploadProgress(0);
        setUploadStatus('');
        setCurrentUploadFileInfo(null);
    };

    return (
        <div className={`${styles.container} ${loading ? styles.disabled : ''}`}>
            {loading && (
                <div className={styles.loaderOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            {showUploadBox && currentUploadFileInfo ? (
                <UploadBox
                    file={currentUploadFileInfo.file}
                    imageUrl={currentUploadFileInfo.imageUrl}
                    fileName={currentUploadFileInfo.name}
                    onRemoveFile={handleCloseUploadBox}
                    progress={uploadProgress}
                    status={uploadStatus}
                />
            ) : (
                <div className={styles.content}>
                    <div className="toolbar-main-heading">
                        <h5 className="Toolbar-badge">Upload Art</h5>
                        <span
                            className={styles.crossIcon}
                            onClick={(e) => {
                                console.log("---------------------crosssss");
                                e.stopPropagation();
                                setreplaceBgwithAi(true);
                            }}
                        >
                            <CrossIcon />
                        </span>
                        <h3>Replace Background</h3>
                        <p>Type in a Prompt to try our AI-Powered Background Replacement Tool.</p>
                    </div>
                    <hr />
                    <div className={`${loading ? styles.disabled : ''}`}>
                        <textarea
                            className={styles.replacebginput}
                            placeholder="Begin Typing.... (e.g., 'add sunrise in background')"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault(); // prevent newline
                                    handleGenerate();
                                }
                            }}
                            disabled={loading}
                        />
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.generateBgbtn}
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate Background'}
                            </button>
                        </div>
                    </div>
                    {resultImage && (
                        <div className={styles.resultContainer}>
                            <h4>Generated Result:</h4>

                            <img
                                src={resultImage}
                                alt="Generated background"
                            // style={{ maxWidth: '100%', marginTop: '10px', cursor: 'pointer' }}

                            />
                            <div className={styles.BtnWrapper}>
                                <button className={styles.useImageButton} onClick={(e) => {
                                    e.stopPropagation();
                                    setreplaceBgwithAi(true);
                                }}>Discard</button>
                                <button className={styles.useImageButton} onClick={() => handleFiles(resultImage)}>Select</button>


                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReplaceBg;