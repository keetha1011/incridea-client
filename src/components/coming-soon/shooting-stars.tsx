import styles from "./shootingStars.module.css";

const ShootingStars = () => {
  return (
    <section className={`shootingStars w-full h-full ${styles.shootingStars}`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} />
      ))}
    </section>
  );
};

export default ShootingStars;
