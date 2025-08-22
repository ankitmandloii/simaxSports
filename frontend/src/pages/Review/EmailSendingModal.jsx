import React from 'react';
import styles from './EmailSendingModal.module.css';
import Lottie from 'lottie-react';
import emailAnimation from './emailAnimation.json';

export default function EmailSendingModal({ onClose, isLoading }) {
    // if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span>SAVE AND ADD TO CART</span>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <div className={styles.body}>
                    <Lottie
                        animationData={emailAnimation}
                        loop
                        autoplay
                        style={{ height: 150, width: 150 }}
                    />
                    <p className={styles.statusText}>Saving your design &<br />emailing you a link</p>
                </div>
            </div>
        </div>
    );
}
