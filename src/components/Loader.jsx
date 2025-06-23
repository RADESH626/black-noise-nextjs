import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderText}>Black Noise</div>
    </div>
  );
};

export default Loader;
