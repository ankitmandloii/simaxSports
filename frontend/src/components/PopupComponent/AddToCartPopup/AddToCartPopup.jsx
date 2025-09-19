import React, { useState } from "react";
import styles from "./AddToCartPopup.module.css";
import { CrossIcon } from "../../iconsSvg/CustomIcon";
import { useLocation } from "react-router-dom";
import CloseButton from "../../CommonComponent/CrossIconCommon/CrossIcon";

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

    // enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // prevent accidental form submission or page reload
            handleSave();
        }
    }
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const customerEmail = searchParams.get("customerEmail");

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                {/* <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button> */}

                {/* <h3 className={styles.header}>SAVE AND ADD TO CART</h3> */}
                <div className={styles.header}>
                    <div className={styles.title}>SAVE AND ADD TO CART</div>
                    <CloseButton onClose={onClose} />
                    {/* <button className={styles.closeButton} onClick={onClose}><CrossIcon /></button> */}
                </div>

                {/* <h2 className={styles.title}>Add to Cart</h2> */}
                <div className={styles.content}>
                    <p className={styles.subText}>
                        Name and save your design to proceed to checkout.
                    </p>
                    <p className={styles.loggedIn}>
                        Logged in as {customerEmail}
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
                        onKeyDown={handleKeyDown}

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
        </div>
    );
};

export default AddToCartPopup;
