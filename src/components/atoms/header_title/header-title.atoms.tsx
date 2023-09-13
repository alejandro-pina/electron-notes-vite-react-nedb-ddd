import React from 'react';
import styles from './header-title.atoms.module.css'


interface HeaderTitleAtomsProps {
  title?: string;
  subtitle?: string;
  styleHeaderTitle?: React.CSSProperties;
}

const HeaderTitleAtoms: React.FC<HeaderTitleAtomsProps> = ({ title, subtitle, styleHeaderTitle }) => {
  return (
    <>
      {title && <h5 className={styles.card_atom_title}>{title}</h5>}
      {subtitle && <span className='text-sm text-gray-500 dark:text-gray-400'>{subtitle}</span>}
    </>
  );
};

export default HeaderTitleAtoms;


