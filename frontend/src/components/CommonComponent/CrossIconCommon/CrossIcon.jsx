import React from 'react';
import styles from './CloseButton.module.css';
import { CrossIcon } from '../../iconsSvg/CustomIcon';


const CloseButton = ({ onClose, disabled = false, className = '' }) => {
    return (
        <button
            className={`${styles.closeBtn} ${className}`}
            onClick={onClose}
            disabled={disabled}
        >
            <CrossIcon />
        </button>
    );
};

export default CloseButton;