import React, { useState } from "react";
import styles from "./EmailInputPopup.module.css";
import { CrossIcon } from "../../iconsSvg/CustomIcon";

const EmailInputPopup = ({ onSubmit, onClose }) => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = () => {
        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        onSubmit({ email });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <div className={styles.title}>ENTER EMAIL</div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <CrossIcon />
                    </button>
                </div>
                <div className={styles.content}>
                    <p className={styles.subText}>
                        Please enter your email to proceed with saving or sharing your design.
                    </p>
                    <input
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                        className={`${styles.input} ${emailError ? styles.inputError : ""}`}
                    />
                    {emailError && (
                        <p className={styles.errorText}>
                            {emailError}
                        </p>
                    )}
                    <p className={styles.charLimit}>
                        Please enter a valid email address
                    </p>
                    <button
                        className={styles.saveButton}
                        onClick={handleSubmit}
                        disabled={!email.trim() || !!emailError}
                    >
                        Continue
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

export default EmailInputPopup;