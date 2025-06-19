import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(prev => (prev === 1 ? 1.02 : 1));
    }, 1500);
    return () => clearInterval(pulseInterval);
  }, []);

  const particleCount = 20;
  const particles = Array.from({ length: particleCount }).map((_, i) => (
    <div
      key={i}
      className={`${styles.particle} ${styles.animateBackgroundParticle}`}
      style={{
        width: `${10 + Math.random() * 30}px`,
        height: `${10 + Math.random() * 30}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 15}s`,
        opacity: Math.random() * 0.5 + 0.1,
      }}
    />
  ));

  return (
    <div className={`${styles.container}`}>
      <div className={styles.particleContainer}>{particles}</div>

      <div className={styles.card}>
        <h1 className={styles.errorCode}>
          {['4', '0', '4'].map((digit, index) => (
            <span
              key={index}
              className={`${styles.errorDigit} ${styles.bounceIn}`}
              style={{
                transform: `scale(${pulseScale})`,
                transition: 'transform 0.5s ease-in-out',
                animationDelay: `${index * 0.1}s`, // Only delay dynamically
              }}
            >
              {digit}
            </span>

          ))}
        </h1>

        <h2 className={`${styles.heading} ${styles.fadeInUp}`}>
          PAGE NOT FOUND!!
        </h2>

        <p className={`${styles.description} ${styles.fadeInUp} ${styles.delay1}`}>
          The page you’re looking for doesn’t exist or has been moved. Double-check the URL or head back to the homepage to continue navigating.
        </p>

        <button
          onClick={() => window.location.href = '/'}
          className={`${styles.button} ${styles.fadeInUp} ${styles.delay2}`}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
