
// import React, { useState } from "react";
// import styles from "./EditWithAipopup.module.css";
// import rabbit from '../../images/rabbit1.png'
// // import sampleImage from "./your-image.png";
// // import YourImage from "../../images/rabbit1.png"; // replace with your image
// // import NewImage from "../../images/your-new-image.png"; // replace with your generated image

// const EditWithAipopup = ({ onClose }) => {
//     const [inputValue, setInputValue] = useState("");
//     const [showResult, setShowResult] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);

//     const handleEditClick = () => {
//         console.log("clickeeeee")
//         setShowResult(true);
//     };

//     const handleImageSelect = (type) => {
//         setSelectedImage(type);
//     };

//     return (
//         <div className={styles.overlay}>
//             <div className={styles.popup}>

//                 {/* <button className={styles.closeBtn} onClick={onClose}>
//                     &times;
//                 </button>

//                 <div className={styles.header}>
//                     <span className={styles.aiTag}>AI</span> EDIT YOUR IMAGE WITH AI MAGIC
//                 </div> */}
//                 <div className={styles.header}>
//                     <div className={styles.title}>EDIT WITH AI</div>
//                     <button className={styles.close} onClick={onClose}>×</button>
//                 </div>
//                 <div className={styles.content}>



//                     <p className={styles.description}>
//                         Our AI Editor can do <strong>ALMOST</strong> anything. Describe the
//                         changes you'd like to make.
//                     </p>

//                     <textarea
//                         className={styles.textarea}
//                         placeholder={`ex. Change the beach scene to a mountain scene
// ex. Add text above the design that says Established 2025 in a cursive font
// ex. Transform this into a cartoon version for a t-shirt graphic
// ex. Remove the text on the side of the boat`}
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         rows={4}
//                     />

//                     {!showResult ? (
//                         <>
//                             <h3 className={styles.imageTitle}>Your Image</h3>
//                             <div className={styles.imageWrapperr}>
//                                 <img src={rabbit} alt="Preview" className={styles.image} />
//                             </div>

//                             <button
//                                 className={styles.editButton}
//                                 disabled={!inputValue.trim()}
//                                 onClick={handleEditClick}
//                             // onClick={console.log("click")

//                             // }
//                             >
//                                 ✨ Edit Image
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <p className={styles.disclaimerBlue}>
//                                 Don't like the results? Be more specific and try again.
//                             </p>

//                             <div className={styles.imageCompare}>
//                                 <div>
//                                     <h3 className={styles.imageTitle}>Your Image</h3>
//                                     <div
//                                         className={`${styles.imageWrapper} ${selectedImage === "your" ? styles.selected : ""
//                                             }`}
//                                         onClick={() => handleImageSelect("your")}
//                                     >
//                                         <img src={rabbit} alt="Your" className={styles.image} />
//                                         {selectedImage === "your" && (
//                                             <button className={styles.useImageButton}>
//                                                 Use This Image
//                                             </button>
//                                         )}
//                                     </div>

//                                 </div>

//                                 <div>
//                                     <h3 className={styles.imageTitle}>New</h3>
//                                     <div
//                                         className={`${styles.imageWrapper} ${selectedImage === "new" ? styles.selected : ""
//                                             }`}
//                                         onClick={() => handleImageSelect("new")}
//                                     >
//                                         <img src={rabbit} alt="New" className={styles.image} />
//                                         {selectedImage === "new" && (
//                                             <button className={styles.useImageButton}>
//                                                 Use This Image
//                                             </button>
//                                         )}
//                                     </div>

//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditWithAipopup;
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EditWithAipopup.module.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateImageState } from "../../../redux/FrontendDesign/TextFrontendDesignSlice";
import { CrossIcon } from "../../iconsSvg/CustomIcon";

const EditWithAipopup = ({ onClose }) => {
    const dispatch = useDispatch();
    const activeSide = useSelector((state) => state.TextFrontendDesignSlice.activeSide);
    const selectedImageId = useSelector(
        (state) => state.TextFrontendDesignSlice.present[activeSide].selectedImageId
    );
    const allImageData = useSelector(
        (state) => state.TextFrontendDesignSlice.present[activeSide].images
    );
    const img = allImageData?.find((img) => img.id == selectedImageId);

    const [originalImg, setOriginalImg] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [resultBlob, setResultBlob] = useState(null);

    const BASE_URL =
        process.env.REACT_APP_BASE_URL ||
        "https://simax-sports-x93p.vercel.app/api/";
    const apiKey = process.env.GENERATE_API_KEY;

    // Convert image URL to File object
    const urlToFile = async (url, filename, mimeType) => {
        try {
            const res = await fetch(url, { mode: "cors" });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(
                    `Failed to fetch image: ${res.status} ${res.statusText} - ${text}`
                );
            }
            const buffer = await res.arrayBuffer();
            if (!buffer.byteLength) {
                throw new Error("Empty buffer received");
            }
            return new File([buffer], filename, { type: mimeType });
        } catch (err) {
            console.error("Error in urlToFile:", err.message, { url, filename, mimeType });
            throw err;
        }
    };

    // Resize image
    const resizeImage = async (imageUrl, maxWidth = 1024, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Canvas is empty"));
                            return;
                        }
                        const file = new File([blob], "resized-image.jpg", {
                            type: "image/jpeg",
                        });
                        resolve(file);
                    },
                    "image/jpeg",
                    quality
                );
            };
            img.onerror = (err) => {
                console.error("Image load error:", err, { imageUrl });
                reject(err);
            };
            img.src = imageUrl;
        });
    };

    // Set original image from Redux store
    useEffect(() => {
        if (img?.src) {
            setOriginalImg(img.src);
        } else {
            console.warn("No image source found for selectedImageId:", selectedImageId);
            toast.warn("No image selected. Please select an image.");
        }
    }, [img, selectedImageId]);

    // Handle Generate Image
    const handleEditClick = async () => {
        if (!inputValue.trim()) {
            toast.warn("Please enter a prompt first");
            return;
        }
        if (!originalImg) {
            toast.warn("No image selected. Please select an image.");
            return;
        }

        setLoading(true);
        try {
            const file = await urlToFile(originalImg, "image.jpg", "image/jpeg");
            const formData = new FormData();
            const resizedImage = await resizeImage(originalImg, 1024);
            formData.append("image", resizedImage);
            formData.append("prompt", inputValue);
            formData.append("model", "gpt-image-1");
            formData.append("size", "1024x1024");
            formData.append("n", "1");

            const res = await fetch(`${BASE_URL}imageOperation/editImageByAi`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(
                    `Failed to generate image: ${res.status} ${res.statusText} - ${errorText}`
                );
            }

            const blob = await res.blob();
            if (!blob.size) {
                throw new Error("Empty blob received from editImageByAi");
            }
            const objectURL = URL.createObjectURL(blob);
            setResultImage(objectURL);
            setResultBlob(blob);
            setShowResult(true);
        } catch (err) {
            console.error("Error generating image:", err.message);
            toast.error(`Error generating image: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection and upload
    const handleImageSelect = async (type) => {
        setSelectedImage(type);
        if (type === "new" && resultImage && resultBlob) {
            try {
                const file = new File([resultBlob], `generated-image-${Date.now()}.jpg`, {
                    type: resultBlob.type,
                });
                const formData = new FormData();
                formData.append("images", file);

                const uploadResponse = await axios.post(
                    `${BASE_URL}imageOperation/upload`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                if (!Array.isArray(uploadResponse.data.files)) {
                    throw new Error("Invalid upload response structure");
                }

                const fileUrl = uploadResponse.data.files[0]?.url;
                if (!fileUrl) {
                    throw new Error("File object missing URL");
                }
                // dispatch("loadingText", true);
                dispatch(updateImageState({
                    id: selectedImageId, changes: {
                        src: fileUrl,
                        base64CanvasImage: fileUrl,
                        "loadingText": true
                    }
                }))
                dispatch(updateImageState({
                    id: selectedImageId, changes: {

                        "loadingText": false
                    }
                }))
                // dispatch("loadingText", true);
                onClose(); // Close the popup after successful upload
            } catch (err) {
                console.error("Error uploading image:", err.message);
                toast.error(`Error uploading image: ${err.message}`);
            }
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <div className={styles.title}>EDIT WITH AI</div>
                    <button className={styles.close} onClick={onClose}>
                        <CrossIcon />
                    </button>
                </div>
                <div className={styles.content}>
                    <p className={styles.description}>
                        Our AI Editor can do <strong>ALMOST</strong> anything. Describe the
                        changes you'd like to make.
                    </p>

                    <textarea
                        className={styles.textarea}
                        placeholder={`ex. Change the beach scene to a mountain scene
ex. Add text above the design that says Established 2025 in a cursive font
ex. Transform this into a cartoon version for a t-shirt graphic
ex. Remove the text on the side of the boat`}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        rows={4}
                        disabled={loading}
                    />

                    {loading ? (
                        <div className={styles.loaderOverlay}>
                            <div className={styles.spinner}></div>
                        </div>
                    ) : !showResult ? (
                        <>
                            <h3 className={styles.imageTitle}>Your Image</h3>
                            <div className={styles.imageWrapperr}>
                                {originalImg ? (
                                    <img src={originalImg} alt="Preview" className={styles.image} />
                                ) : (
                                    <p>No image selected</p>
                                )}
                            </div>

                            <button
                                className={styles.editButton}
                                disabled={!inputValue.trim() || loading || !originalImg}
                                onClick={handleEditClick}
                            >
                                ✨ Edit Image
                            </button>
                        </>
                    ) : (
                        <>
                            <p className={styles.disclaimerBlue}>
                                Don't like the results? Be more specific and try again.
                            </p>

                            <div className={styles.imageCompare}>
                                <div>
                                    <h3 className={styles.imageTitle}>Your Image</h3>
                                    <div
                                        className={`${styles.imageWrapper} ${selectedImage === "your" ? styles.selected : ""}`}
                                        onClick={() => handleImageSelect("your")}
                                    >
                                        {originalImg ? (
                                            <img
                                                src={originalImg}
                                                alt="Your"
                                                className={styles.image}
                                            />
                                        ) : (
                                            <p>No image selected</p>
                                        )}
                                        {selectedImage === "your" && (
                                            <button className={styles.useImageButton}>
                                                Use This Image
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={styles.imageTitle}>New</h3>
                                    <div
                                        className={`${styles.imageWrapper} ${selectedImage === "new" ? styles.selected : ""}`}
                                        onClick={() => handleImageSelect("new")}
                                    >
                                        <img
                                            src={resultImage || originalImg || ""}
                                            alt="New"
                                            className={styles.image}
                                        />
                                        {selectedImage === "new" && (
                                            <button className={styles.useImageButton}>
                                                Use This Image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditWithAipopup;
