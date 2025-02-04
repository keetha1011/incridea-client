import styles from "./loader.module.css";

const CenteredLoader = () => {
  return (
    <div className={styles.fullscreen}>
      <div className={styles.loader}>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
        <div className={styles.box}></div>
      </div>
    </div>
  );
};

export default CenteredLoader;
