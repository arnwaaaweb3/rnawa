import React from "react";
import styles from "../styles/SignatureNawaCard.module.css";
import Image from "next/image";

interface Props {
  name: string;
  role: string;
  image: string;
}

const SignatureNawaCard: React.FC<Props> = ({ name, role, image }) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.photoSection}> {/* Matches updated CSS */}
          <Image 
            src={image} 
            className={styles.photo} 
            alt={name} 
            width={245} 
            height={200} 
            priority
          />
        </div>
        <div className={styles.infoSection}> {/* Matches updated CSS */}
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.role}>{role}</p>
          <a href="/me" className={styles.seeMoreLink}>
            <span className={styles.seeMoreText}>See more about myself</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignatureNawaCard;