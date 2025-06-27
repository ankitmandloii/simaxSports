import React from 'react';
import styles from './AddColorBtn.module.css';

const AddColorBtn = () => {
  return (
    <div className={styles.container}>
      <div className={styles.circle}>
        <span className={styles.plus}>+</span>
      </div>
    </div>
  );
};

export default AddColorBtn;
