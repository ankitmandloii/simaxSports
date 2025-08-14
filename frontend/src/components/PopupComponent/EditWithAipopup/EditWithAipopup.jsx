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
import Rabbit from "../../images/rabbit1.png"
// import sampleImage from "./your-image.png"; // replace with your uploaded image

const EditWithAipopup = ({ onClose }) => {
    const [inputValue, setInputValue] = useState("");
    const [showResult, setShowResult] = useState(false);

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

                {/* Textarea input */}
                <textarea
                    className={styles.textarea}
                    placeholder="ex. Change the beach scene to a mountain scene&#10;ex. Add text above the design that says Established 2025 in a cursive font&#10;ex. Transform this into a cartoon version for a t-shirt graphic&#10;ex. Remove the text on the side of the boat"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    rows={4}
                />

                {/* Button is disabled until inputValue is not empty */}
                <button
                    className={styles.editButton}
                    disabled={!inputValue.trim()}
                // onClick={() => setShowResult(true)
                >
                    ✨ Edit Image
                </button>

                <p className={styles.disclaimer}>
                    As we cannot control the results of AI tools, we disclaim all liability
                    and you assume full responsibility when using this feature in compliance
                    with trademark and copyright law and our terms of service.
                </p>

                <h3 className={styles.imageTitle}>Your Image</h3>
                <div className={styles.imageWrapper}>
                    <img src={Rabbit} alt="Preview" className={styles.image} />
                </div>
            </div>
        </div >
    );
};

export default EditWithAipopup;
