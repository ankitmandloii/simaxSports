import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react'; // Added ChevronLeft icon
import styles from './ColorPicker.module.css'; // Import the CSS module

const COLORS = {
    headerOrange: '#E64A19',
    lightGray: '#F3F4F6',
    darkGrayText: '#4B5563',
    closeButtonBg: '#E5E7EB',
};

const presetColors = [
    '#FFFFFF', '#E5E7EB', '#6B7280', '#5C4033', '#475569', '#1F2937',
    '#000000', '#B91C1C', '#7F1D1D', '#4C1D95', '#BFDBFE', '#0C4A6E',
    '#083344', '#047857', '#22D3EE', '#166534', '#4D7C0F', '#F4A3B4'
];

const AddColorButton = ({ onClick, isSelected }) => (
    <button
        onClick={onClick}
        className={`${styles.addColorButton} ${isSelected ? styles.addColorButtonSelected : ''}`}
        aria-label="Add a new color"
    >
        <div className={styles.addColorIconContainer}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12" strokeWidth="0" fill="#EF4444" opacity="0.8" />
                <path d="M12 2C17.5228 2 22 6.47715 22 12L12 12L12 2Z" fill="#3B82F6" opacity="0.8" />
                <path d="M22 12C22 17.5228 17.5228 22 12 22L12 12L22 12Z" fill="#10B981" opacity="0.8" />
                <path d="M12 22C6.47715 22 2 17.5228 2 12L12 12L12 22Z" fill="#FBBF24" opacity="0.8" />
                <circle cx="12" cy="12" r="3" fill="white" />
                <path d="M12 10V14M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        Add Color
    </button>
);

const ColorPickerModal = ({ isOpen, onClose }) => {
    const [selectedColor, setSelectedColor] = useState(presetColors[0]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerContentGroup}>
                        <button
                            onClick={() => console.log('Back button clicked')}
                            className={styles.backButton}
                            aria-label="Go back to previous step"
                        >
                            <ChevronLeft size={20} color={COLORS.darkGrayText} />
                        </button>
                        <h2 className={styles.headerTitle}>ADD ANOTHER COLOR</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="Close color picker"
                    >
                        <X size={20} color={COLORS.darkGrayText} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <p className={styles.bodyTitle}>Color:</p>
                    <div className={styles.swatchGrid}>
                        {presetColors.map((hexColor, index) => {
                            const isSelected = selectedColor === hexColor;

                            const swatchStyle = {
                                backgroundColor: hexColor,
                                border: hexColor === '#FFFFFF' ? '1px solid #D1D5DB' : 'none',
                            };

                            return (
                                <button
                                    key={index}
                                    className={`${styles.swatchItem} ${isSelected ? styles.swatchSelected : ''}`}
                                    style={swatchStyle}
                                    onClick={() => setSelectedColor(hexColor)}
                                    aria-label={`Select color ${hexColor}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ColorPickerModal;

// const App = () => {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [isAddColorSelected, setIsAddColorSelected] = useState(true);

//   return (
//     <div className={styles.appContainer}>
//       <div className={styles.sidebarMockup}>
//         <h3 className="text-lg font-bold mb-4">Product Configuration</h3>
//         <div className="flex justify-between items-start mb-6">
//           <div className="border border-gray-300 rounded-lg p-2 mr-4">
//             <AddColorButton
//               onClick={() => {
//                 setIsModalOpen(true);
//                 setIsAddColorSelected(true);
//               }}
//               isSelected={isAddColorSelected}
//             />
//           </div>
//         </div>
//       </div>

//       <div className={styles.productPreviewArea}>
//         <h1 className="text-xl text-gray-600">Product Preview Area</h1>
//       </div>

//       <ColorPickerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </div>
//   );
// };

// export default App;
