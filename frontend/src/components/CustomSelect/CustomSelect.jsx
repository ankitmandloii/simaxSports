// CustomSelect.jsx - New separate component
import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomsSelect.module.css'
const CustomSelect = ({ options, value, onChange, placeholder, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState(null);
    const selectRef = useRef(null);
    const dropdownRef = useRef(null);

    const selectedOption = value ? options.flatMap(group =>
        group.options.find(opt => opt.value.id === value.id)
    ).find(Boolean) || null : null;

    const toggleDropdown = () => {
        if (!disabled) {
            console.log("Dropdown toggled", !isOpen); // Debug log
            setIsOpen(!isOpen);
        }
    };


    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' && hoveredOption) {
            handleOptionClick(hoveredOption);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            // Simple keyboard nav - can enhance
            const nextGroup = options[hoveredOption?.groupIndex + 1 || 0];
            if (nextGroup) {
                setHoveredOption({ ...nextGroup.options[0], groupIndex: hoveredOption?.groupIndex + 1 || 0 });
            }
        }
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.customSelect} ref={selectRef}>
            <div
                className={`${styles.selectControl} ${isOpen ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
            >
                <span className={styles.selectedValue}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={styles.dropdownIcon}>▼</span>
            </div>

            {isOpen && (
                <div className={styles.dropdownMenu} ref={dropdownRef}>
                    <ul className={styles.menuList} role="listbox">
                        {options.map((group, groupIndex) => (
                            <li key={groupIndex} className={styles.group}>
                                <div className={styles.groupHeading}>{group.label}</div>
                                <ul className={styles.groupOptions}>
                                    {group.options.map((option, optIndex) => (
                                        <li
                                            key={optIndex}
                                            className={`${styles.option} ${selectedOption?.value.id === option.value.id ? styles.selected : ''} ${hoveredOption?.value.id === option.value.id ? styles.hovered : ''}`}
                                            onClick={() => handleOptionClick(option)}
                                            onMouseEnter={() => setHoveredOption({ ...option, groupIndex })}
                                            role="option"
                                            aria-selected={selectedOption?.value.id === option.value.id}
                                        >
                                            {option.label}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;