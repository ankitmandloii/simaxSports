import React, { useEffect, useRef } from 'react';
import styles from './LoadingScreen.module.css';

const messages = [
  'Initializing system',
  'Loading sports data',
  'Preparing live updates',
  'Optimizing performance',
  'Almost ready',
];

const LoadingScreen = () => {
  const progressRef = useRef(null);
  let currentMessage = 0;

  useEffect(() => {
    const updateProgress = () => {
      if (progressRef.current) {
        progressRef.current.textContent = messages[currentMessage];
        currentMessage = (currentMessage + 1) % messages.length;
      }
    };

    const interval = setInterval(updateProgress, 1500);
    setTimeout(updateProgress, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderCard}>
        <div className={styles.textAnimationContainer}>
          <div className={styles.simaxText}>
            {'SIMAX'.split('').map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </div>
          <div className={styles.sportsText}>APPAREL</div>
        </div>
        <div className={styles.loaderText}>
        Let's Create Something Amazing Today<span className={styles.dots}></span>
        </div>
        <span className={styles.progressText} ref={progressRef}>
          Initializing system
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
