import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './DesignNotesPopup.module.css';
import { setDesignNotes } from '../../../redux/FrontendDesign/TextFrontendDesignSlice';
import { CrossIcon } from '../../iconsSvg/CustomIcon';
import { toast } from "react-toastify";


const DesignNotesPopup = ({ handleClose }) => {
    const dispatch = useDispatch();
    const designNotes = useSelector(state => state.TextFrontendDesignSlice.DesignNotes);

    // Pre-fill with current redux state
    const [formData, setFormData] = useState({
        frontDesign: designNotes.FrontDesignNotes || '',
        backDesign: designNotes.BackDesignNotes || '',
        extraInfo: designNotes.ExtraInfo || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Check if all fields are empty
    const isSaveDisabled = !formData.frontDesign.trim() &&
        !formData.backDesign.trim() &&
        !formData.extraInfo.trim();

    const handleSave = () => {
        if (isSaveDisabled) {
            toast.error("Please fill at least one field before saving");
            // toast.error('Please fill at least one field before saving', {
            //     position: "top-right",
            //     autoClose: 3000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            // });
            return;
        }

        // Save all fields with one generic reducer
        dispatch(setDesignNotes({ key: "FrontDesignNotes", value: formData.frontDesign }));
        dispatch(setDesignNotes({ key: "BackDesignNotes", value: formData.backDesign }));
        dispatch(setDesignNotes({ key: "ExtraInfo", value: formData.extraInfo }));

        // console.log('Saved Notes:', formData);

        // Show success toast
        // toast.success('Notes saved successfully!', {
        //     position: "top-right",
        //     autoClose: 3000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        // });
        toast.success("Notes saved successfully!");


        // Close after save
        // handleClose();
    };

    const handleClosee = () => {
        handleClose();
        // console.log('Popup Closed');
    };

    return (
        <div className="modal-overlay">
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Design Notes</h3>
                    <button onClick={handleClosee} className={styles.close}><CrossIcon /></button>
                </div>
                <div className={styles.content}>
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

                    <button
                        onClick={handleSave}
                        className={styles.saveButton}
                        disabled={isSaveDisabled}
                    >
                        Save Notes
                    </button>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};

export default DesignNotesPopup;