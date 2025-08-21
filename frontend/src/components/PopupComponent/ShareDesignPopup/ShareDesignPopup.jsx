import React, { useState } from 'react';
import styles from './ShareDesignPopup.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { TfiEmail } from "react-icons/tfi";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";


const ShareDesignPopup = () => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://www.ninjaprinthouse.com/design/?design=MTEyMzkxODk=&i');
        alert('Link copied to clipboard!');
    };

    const handlePreview = () => {
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    return (
        <div className="modal-overlay">
            <div className={styles.popup}>
                <div className={styles.modalHeader}>
                    <h3>Share your Design</h3>
                    <span><CrossIcon /></span>
                </div>
                <div className={styles.content}>
                    <div className={styles.designimg}>
                        <img src="https://cdn.shopify.com/s/files/1/0622/9560/5382/files/82601_f_fl.jpg?v=1754920925" alt="Hoodie Design" className={styles.designImage} />
                    </div>
                    <div className={styles.textContainer}>
                        <h2 className={styles.title}>Share your design</h2>
                        <p className={styles.description}>Your design "kik" has been saved and emailed to you.</p>
                        <p className={styles.description}>Copy your design link below and share with others.</p>
                        <div className={styles.linkContainer}>
                            <input
                                type="text"
                                value="https://www.ninjaprinthouse.com/design/?design=MTEyMzkxODk=&i"
                                readOnly
                                className={styles.linkInput}
                            />
                            <button onClick={handleCopy} className={styles.copyButton}>
                                Copy
                            </button>
                        </div>
                        <div className={styles.shareOptions}>
                            <div className={styles.shareItem}>
                                <span className={styles.shareIcon}><TfiEmail /></span>
                                <span className={styles.shareLabel}>Email</span>
                            </div>
                            <div className={styles.shareItem}>
                                <span className={styles.shareIcon}>< FaFacebookSquare /></span>
                                <span className={styles.shareLabel}>Share</span>
                            </div>
                            <div className={styles.shareItem}>
                                <span className={styles.shareIcon}><FaTwitter /></span>
                                <span className={styles.shareLabel}>Tweet</span>
                            </div>
                            <div className={styles.shareItem}>
                                <span className={styles.shareIcon}><FaPinterest /></span>
                                <span className={styles.shareLabel}>Pin</span>
                            </div>

                        </div>
                        <button className={styles.continueButton}>Continue to Pricing</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShareDesignPopup;