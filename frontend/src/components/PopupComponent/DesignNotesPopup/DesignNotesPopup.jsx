import React, { useState } from 'react';
import styles from './DesignNotesPopup.module.css';

const DesignNotesPopup = ({ handleClose }) => {
    const [formData, setFormData] = useState({
        frontDesign: '',
        backDesign: '',
        extraInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Handle save logic here (e.g., log or send data)
        console.log('Saved Notes:', formData);
    };

    const handleClosee = () => {
        handleClose();
        // Handle close logic here (e.g., hide popup)
        console.log('Popup Closed');
    };

    return (
        <div className='modal-overlay'>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3>DESIGN NOTES</h3>
                    <button onClick={handleClosee} className={styles.closeButton}>×</button>
                </div>
                <p className={styles.description}>
                    Leave a note for our design specialist. We review every note after you place your order.
                </p>
                <div className={styles.formGroup}>
                    <label>Front Design</label>
                    <textarea
                        name="frontDesign"
                        value={formData.frontDesign}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Back Design</label>
                    <textarea
                        name="backDesign"
                        value={formData.backDesign}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Extra Info</label>
                    <textarea
                        name="extraInfo"
                        value={formData.extraInfo}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </div>
                <button onClick={handleSave} className={styles.saveButton}>
                    Save Notes
                </button>
            </div>
        </div>
    );
};

export default DesignNotesPopup;