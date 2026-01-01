// SignatureNawaCard.tsx
import React from "react";
import styles from "../styles/SignatureNawaCard.module.css";

interface Props {
  name: string;
  role: string;
  image: string;
}

const SignatureNawaCard: React.FC<Props> = ({ name, role, image }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.photoWrapper}>
          <img src={image} className={styles.photo} alt={name} />
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.role}>{role}</p>
          <a href="/me" className={styles.seeMoreLink}>
            See more about myself
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignatureNawaCard;