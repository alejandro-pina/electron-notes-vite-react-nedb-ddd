import React from 'react';
import styles from './image-profile.atoms.module.css'


interface ImageProfileAtomsProps {
  urlImage: string;
  nameImage: string;
  imgStyle: {
    alertType: string;
    txtAlgn: string;
    alertRadius: string;
    alertShadow: string;
    alertBorderStyle: string;
    alertTxtTransform: string;
  };
}

const ImageProfileAtoms: React.FC<ImageProfileAtomsProps> = ({ urlImage, nameImage, imgStyle }) => {
  const { alertType, txtAlgn, alertRadius, alertShadow, alertBorderStyle, alertTxtTransform } = imgStyle;

  return (
    <img className={styles.profile_image} src={urlImage} alt={nameImage} />
  );
};

export default ImageProfileAtoms;
