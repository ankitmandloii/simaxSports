// import React from "react";
// import styles from "./EditWithAipopup.module.css";
// // import sampleImage from "./your-image.png"; // replace with your uploaded image

// const EditWithAipopup = ({ onClose }) => {
//     return (
//         <div className={styles.overlay}>
//             <div className={styles.popup}>
//                 <button className={styles.closeBtn} onClick={onClose}>
//                     &times;
//                 </button>

//                 <div className={styles.header}>
//                     <span className={styles.aiTag}>AI</span> EDIT YOUR IMAGE WITH AI MAGIC
//                 </div>

//                 <p className={styles.description}>
//                     Our AI Editor can do <strong>ALMOST</strong> anything. Describe the
//                     changes you'd like to make.
//                 </p>

//                 <div className={styles.exampleBox}>
//                     <div>ex. Change the beach scene to a mountain scene</div>
//                     <div>
//                         ex. Add text above the design that says Established 2025 in a cursive font
//                     </div>
//                     <div>
//                         ex. Transform this into a cartoon version for a t-shirt graphic
//                     </div>
//                     <div>ex. Remove the text on the side of the boat</div>
//                 </div>

//                 <button className={styles.editButton}>✨ Edit Image</button>

//                 <p className={styles.disclaimer}>
//                     As we cannot control the results of AI tools, we disclaim all liability
//                     and you assume full responsibility when using this feature in compliance
//                     with trademark and copyright law and our terms of service.
//                 </p>

//                 <h3 className={styles.imageTitle}>Your Image</h3>
//                 <div className={styles.imageWrapper}>
//                     {/* <img src={sampleImage} alt="Preview" className={styles.image} /> */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditWithAipopup;
import React, { useState } from "react";
import styles from "./EditWithAipopup.module.css";
import rabbit from '../../images/rabbit1.png'
// import sampleImage from "./your-image.png";
// import YourImage from "../../images/rabbit1.png"; // replace with your image
// import NewImage from "../../images/your-new-image.png"; // replace with your generated image

const EditWithAipopup = ({ onClose }) => {
    const [inputValue, setInputValue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleEditClick = () => {
        console.log("clickeeeee")
        setShowResult(true);
    };

    const handleImageSelect = (type) => {
        setSelectedImage(type);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeBtn} onClick={onClose}>
                    &times;
                </button>

                <div className={styles.header}>
                    <span className={styles.aiTag}>AI</span> EDIT YOUR IMAGE WITH AI MAGIC
                </div>
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
                />

                {!showResult ? (
                    <>
                        <h3 className={styles.imageTitle}>Your Image</h3>
                        <div className={styles.imageWrapper}>
                            <img src={rabbit} alt="Preview" className={styles.image} />
                        </div>

                        <button
                            className={styles.editButton}
                            disabled={!inputValue.trim()}
                            onClick={handleEditClick}
                        // onClick={console.log("click")

                        // }
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
                                    className={`${styles.imageWrapper} ${selectedImage === "your" ? styles.selected : ""
                                        }`}
                                    onClick={() => handleImageSelect("your")}
                                >
                                    <img src={rabbit} alt="Your" className={styles.image} />
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
                                    className={`${styles.imageWrapper} ${selectedImage === "new" ? styles.selected : ""
                                        }`}
                                    onClick={() => handleImageSelect("new")}
                                >
                                    <img src={rabbit} alt="New" className={styles.image} />
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
    );
};

export default EditWithAipopup;
