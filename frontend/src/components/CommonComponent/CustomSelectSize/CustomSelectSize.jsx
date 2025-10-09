// CustomSelect.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './CustomSelectSize.module.css';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';

const CustomSelectSize = ({ value, onChange, options = [], disabled = false, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const displayValue = value || placeholder;
    const allOptions = [
        // { value: '', label: placeholder, disabled: true },
        ...options.map((opt) => ({
            value: opt.size,
            label: opt.size,
            disabled: false,
        })),
    ];

    const handleOptionClick = (optValue) => {
        if (optValue !== '') {
            onChange(optValue);
        }
        setIsOpen(false);
    };

    if (disabled) {
        return (
            <div className={`${styles.customSelectContainer} ${styles.disabled}`}>
                <div className={styles.customSelectTrigger}>
                    {displayValue}
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={styles.customSelectContainer}>
            <div
                className={styles.customSelectTrigger}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={styles.selectValue}>{displayValue}</span>
                <span className={styles.dropdownArrow}>{isOpen ? <FaAngleUp /> : <FaAngleDown />}</span>
            </div>
            {isOpen && (
                <ul className={styles.customSelectList}>
                    {allOptions.map((opt, index) => (
                        <li
                            key={index}
                            className={`${styles.customSelectOption} ${opt.disabled ? styles.disabledOption : ''} ${value === opt.value ? styles.selectedOption : ''}`}
                            onClick={() => handleOptionClick(opt.value)}
                            style={opt.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelectSize;