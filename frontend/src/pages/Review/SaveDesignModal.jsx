// import React, { useState } from 'react';
// import styles from './SaveDesignModal.module.css'; // use same CSS conventions

// export default function SaveDesignModal({ onClose, onSubmit, defaultDesignName }) {
//     const [selectedOption, setSelectedOption] = useState('update');
//     const [designName, setDesignName] = useState(defaultDesignName || '');
//     const [emailUpdates, setEmailUpdates] = useState(true);

//     const handleSubmit = () => {
//         if (selectedOption === 'new' && designName.trim() === '') return;

//         const payload = {
//             type: selectedOption,
//             name: selectedOption === 'new' ? designName.trim() : defaultDesignName,
//             emailUpdates,
//         };

//         onSubmit(payload); // call the API or parent handler
//     };

//     return (
//         <div className={styles.overlay}>
//             <div className={styles.popup}>
//                 <div className={styles.header}>
//                     <div className={styles.headerTitle}>SAVE AND ADD TO CART</div>
//                     <button className={styles.closeButton} onClick={onClose}>x</button>
//                 </div>
//                 <h2 className={styles.subTitle}>Save changes to "{defaultDesignName}"</h2>
//                 <p className={styles.subText}>
//                     We found an existing design with the same name and email address.
//                 </p>

//                 {/* <div className={styles.optionBox}>
//                     <label style={{ display: 'block', marginBottom: '10px' }}>
//                         <input
//                             type="radio"
//                             name="option"
//                             value="update"
//                             checked={selectedOption === 'update'}
//                             onChange={() => setSelectedOption('update')}
//                         />{' '}
//                         <strong>Update Design</strong>
//                     {selectedOption === 'update' && (
//                         <label style={{ display: 'block', marginBottom: '20px', marginLeft: '25px' }}>
//                             <input
//                                 type="checkbox"
//                                 checked={emailUpdates}
//                                 onChange={() => setEmailUpdates(!emailUpdates)}
//                             />{' '}
//                             Email me my updated design
//                         </label>
//                     )}
//                     </label>

//                     <label style={{ display: 'block', marginBottom: '20px' }}>
//                         <input
//                             type="radio"
//                             name="option"
//                             value="new"
//                             checked={selectedOption === 'new'}
//                             onChange={() => setSelectedOption('new')}
//                         />{' '}
//                         <strong>Save as New</strong>
//                     </label>

//                     {selectedOption === 'new' && (
//                         <input
//                             className={styles.input}
//                             placeholder="Enter new design name"
//                             value={designName}
//                             onChange={(e) => setDesignName(e.target.value)}
//                         />
//                     )}
//                 </div> */}
//                 <div className={styles.optionBox}>
//                     {/* Update Design Option */}
//                     <label className={styles.radioOption}>
//                         <input
//                             type="radio"
//                             name="option"
//                             value="update"
//                             checked={selectedOption === 'update'}
//                             onChange={() => setSelectedOption('update')}
//                         />
//                         <span><strong>Update Design</strong></span>
//                     </label>

//                     {selectedOption === 'update' && (
//                         <div className={styles.subOption}>
//                             <label className={styles.checkboxLabel}>
//                                 <input
//                                     type="checkbox"
//                                     checked={emailUpdates}
//                                     onChange={() => setEmailUpdates(!emailUpdates)}
//                                 />
//                                 <span>Email me my updated design</span>
//                             </label>
//                         </div>
//                     )}

//                     {/* Save as New Option */}
//                     <label className={styles.radioOption}>
//                         <input
//                             type="radio"
//                             name="option"
//                             value="new"
//                             checked={selectedOption === 'new'}
//                             onChange={() => setSelectedOption('new')}
//                         />
//                         <span><strong>Save as New</strong></span>
//                     </label>

//                     {selectedOption === 'new' && (
//                         <div className={styles.subOption}>
//                             <input
//                                 className={styles.input}
//                                 placeholder="Enter new design name"
//                                 value={designName}
//                                 onChange={(e) => setDesignName(e.target.value)}
//                             />
//                         </div>
//                     )}
//                 </div>


//                 <button
//                     className={styles.saveButton}
//                     onClick={handleSubmit}
//                     disabled={selectedOption === 'new' && designName.trim() === ''}
//                 >
//                     Continue
//                 </button>
//             </div>
//         </div>
//     );
// }
import React, { useState } from 'react';
import styles from './SaveDesignModal.module.css';
import { CrossIcon } from '../../components/iconsSvg/CustomIcon';

export default function SaveDesignModal({ onClose, onSubmit, defaultDesignName, designId, currentDesign = [] }) {
    console.log(currentDesign, "currentDesign");
    const [selectedOption, setSelectedOption] = useState('update');
    const [designName, setDesignName] = useState(currentDesign[0]?.DesignName || '');
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
                    <button className={styles.closeButton} onClick={onClose}><CrossIcon /></button>
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