import React, { useState } from "react";
import styles from "./AddToCartPopup.module.css";

const AddToCartPopup = ({ onSave, onClose, defaultDesignName }) => {
    // const [designName, setDesignName] = useState("");
    const [designName, setDesignName] = useState(defaultDesignName || '');

    const handleSave = () => {
        const payload = {

            name: designName,

        };
        if (designName.trim() && designName.length <= 25) {
            onSave(payload);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>

                <h3 className={styles.header}>SAVE AND ADD TO CART</h3>
                <hr />

                {/* <h2 className={styles.title}>Add to Cart</h2> */}
                <p className={styles.subText}>
                    Name and save your design to proceed to checkout.
                </p>
                <p className={styles.loggedIn}>
                    Logged in as vaishaliverma@itgeeks.com
                </p>

                <input
                    type="text"
                    placeholder="Enter Design Name"
                    value={designName}
                    onChange={(e) =>
                        setDesignName(
                            e.target.value
                        )
                    }
                    maxLength={25}
                    className={styles.input}
                />
                <p className={styles.charLimit}>
                    25 characters max, no symbols except dashes
                </p>

                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={!designName.trim()}
                >
                    Save Design
                </button>

                <p className={styles.privacy}>
                    Your email is safe and secure. Read our{" "}
                    <span className={styles.link}>privacy policy</span>.
                </p>
            </div>
        </div>
    );
};

export default AddToCartPopup;
