import React, { useState } from 'react';
import styles from './SaveDesignModal.module.css';
import { CrossIcon } from '../../components/iconsSvg/CustomIcon';
import CloseButton from '../../components/CommonComponent/CrossIconCommon/CrossIcon';

export default function SaveDesignModal({ onClose, onSubmit, defaultDesignName, designId, currentDesign = [] }) {
    console.log(defaultDesignName, "currentDesign");
    const [selectedOption, setSelectedOption] = useState('update');
    // const [designName, setDesignName] = useState(currentDesign?.[0].DesignName || '');
    // const [designName, setDesignName] = useState(currentDesign?.[0]?.DesignName || '');
    const [designName, setDesignName] = useState(defaultDesignName || '');


    const [emailUpdates, setEmailUpdates] = useState(true);

    const handleSubmit = () => {
        if (selectedOption === 'new' && designName.trim() === '') return;

        const payload = {
            type: selectedOption,
            name: selectedOption === 'new' ? designName.trim() : defaultDesignName,
            emailUpdates,
            ...(selectedOption === 'update' && designId ? { designId } : {}),
        };

        onSubmit(payload);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>SAVE AND ADD TO CART</div>
                    <CloseButton onClose={onClose} />
                    {/* <button className={styles.closeButton} onClick={onClose}><CrossIcon /></button> */}
                </div>
                <h2 className={styles.subTitle}>Save changes to "{designName}"</h2>
                <p className={styles.subText}>
                    We found an existing design with the same name and email address.
                </p>

                <div className={styles.optionBox}>
                    {/* Update Design Option */}
                    <label className={styles.radioOption}>
                        <input
                            type="radio"
                            name="option"
                            value="update"
                            checked={selectedOption === 'update'}
                            onChange={() => setSelectedOption('update')}
                        />
                        <span>Update Design</span>
                    </label>

                    {/* {selectedOption === 'update' && (
                        <div className={styles.subOption}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={emailUpdates}
                                    onChange={() => setEmailUpdates(!emailUpdates)}
                                />
                                <span>Email me my updated design</span>
                            </label>
                        </div>
                    )} */}

                    {/* Save as New Option */}
                    <label className={styles.radioOption}>
                        <input
                            type="radio"
                            name="option"
                            value="new"
                            checked={selectedOption === 'new'}
                            onChange={() => setSelectedOption('new')}
                        />
                        <span>Save as New</span>
                    </label>

                    {selectedOption === 'new' && (
                        <div className={styles.subOption}>
                            <input
                                className={styles.input}
                                placeholder="Enter new design name"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <button
                    className={styles.saveButton}
                    onClick={handleSubmit}
                    disabled={selectedOption === 'new' && designName.trim() === ''}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}