import styles from "./glitch.module.css";

interface glitchProps {
  text: string;
}
export default function GlitchAnimation({ text }: glitchProps) {
  return (
    <>
      <p
        className={`${styles.glitch} text-md sm:text-lg md:text-2xl lg:text-3xl`}
      >
        <span aria-hidden="true">{text}</span>
        {text}
        <span aria-hidden="true">{text}</span>
      </p>
    </>
  );
}
