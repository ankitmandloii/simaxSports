import React, { useState } from "react";
import axios from "axios";

const SaveDesignModal = ({ open, onClose, designName, userEmail }) => {
    const [saveOption, setSaveOption] = useState("update");
    const [sendEmail, setSendEmail] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        setLoading(true);

        try {
            const payload = {
                action: saveOption,
                email: userEmail,
                sendEmail,
                designName,
            };

            // Replace with your actual API endpoint
            // const response = await axios.post("/api/save-design", payload);

            // console.log("API Response:", response.data);
            onClose(); // Close modal on success
        } catch (err) {
            console.error("Error saving design:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeBtn} onClick={onClose}>×</button>
                <h3 style={styles.header}>SAVE AND ADD TO CART</h3>

                <p style={styles.title}>Save changes to <strong>"{designName}"</strong></p>
                <p style={styles.subText}>
                    We found an existing design with the same name and email address.
                </p>

                <div style={styles.radioGroup}>
                    <label style={styles.radioOption}>
                        <input
                            type="radio"
                            name="saveOption"
                            value="update"
                            checked={saveOption === "update"}
                            onChange={() => setSaveOption("update")}
                        />
                        <strong> Update Design</strong>
                    </label>
                    {saveOption === "update" && (
                        <label style={styles.checkboxOption}>
                            <input
                                type="checkbox"
                                checked={sendEmail}
                                onChange={() => setSendEmail(!sendEmail)}
                            />
                            Email me my updated design
                        </label>
                    )}

                    <label style={styles.radioOption}>
                        <input
                            type="radio"
                            name="saveOption"
                            value="new"
                            checked={saveOption === "new"}
                            onChange={() => setSaveOption("new")}
                        />
                        <strong> Save as New</strong>
                    </label>
                </div>

                <button
                    onClick={handleContinue}
                    style={styles.continueBtn}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        borderRadius: 8,
        padding: "24px 32px",
        width: 480,
        position: "relative",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif",
    },
    closeBtn: {
        position: "absolute",
        top: 12,
        right: 16,
        background: "none",
        border: "none",
        fontSize: 24,
        cursor: "pointer",
    },
    header: {
        color: "#FF4D00",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subText: {
        marginBottom: 20,
        color: "#333",
    },
    radioGroup: {
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    radioOption: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    checkboxOption: {
        marginLeft: 24,
        fontSize: 14,
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: 6,
    },
    continueBtn: {
        background: "#FF4D00",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        fontSize: 16,
        fontWeight: "bold",
        borderRadius: 6,
        cursor: "pointer",
        width: "100%",
    },
};

export default SaveDesignModal;
