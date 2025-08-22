import React, { useEffect, useState } from 'react';
import styles from './RetrieveSavedDesignsModal.module.css';

const RetrieveSavedDesignsModal = ({ onClose = () => { } }) => {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Checking for existing designs...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setMessage('Designs Retrieved!');
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                    return 100;
                }
                return prev + 10;
            });
        }, 400);

        return () => clearInterval(interval);
    }, [onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.title}>SAVE AND ADD TO CART</span>
                </div>
                    <button className={styles.close} onClick={onClose}>×</button>

                <div className={styles.body}>
                    <h2 className={styles.subtitle}>Retrieve Your Saved Designs</h2>
                    <p className={styles.message}>{message}</p>

                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetrieveSavedDesignsModal;
