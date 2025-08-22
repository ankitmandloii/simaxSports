import React from 'react';
import styles from './AnimatedEnvelope.module.css';

export default function AnimatedEnvelope() {
    return (
        <div className={styles.container}>
            <svg
                className={styles.envelope}
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
            >
                <g id="envelope">
                    <rect x="10" y="30" width="80" height="50" rx="5" fill="#005BFF" />
                    <path
                        className={styles.flap}
                        d="M10 30L50 60L90 30L50 10L10 30Z"
                        fill="#2166e7"
                    />
                </g>
            </svg>
        </div>
    );
}
