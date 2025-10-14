import React from 'react';
import Lottie from 'lottie-react'; // Requires: npm install lottie-react
import styles from './NoproductFound.module.css';
import NoData from './notFoundAnimation.json';

// Define the Lottie animation data (paste your full JSON here)


const NoProductFound = () => {
    return (
        <div className={styles.container}>
            {/* Lottie animation in place of the static icon */}
            <div className={styles.animationWrapper}>
                <Lottie
                    animationData={NoData}
                    loop
                    autoplay
                    style={{ height: 150, width: 150 }}
                />
            </div>

            <h2 className={styles.heading}>No Products Found !!</h2>

            <p className={styles.message}>
                We couldn't find any products that meet your criteria.
            </p>

            {/* <button className={styles.actionButton}>
                Explore All Products
            </button> */}
        </div>
    );
};

export default NoProductFound;