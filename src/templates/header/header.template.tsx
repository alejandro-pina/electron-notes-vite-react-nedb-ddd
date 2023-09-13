import React from 'react';
import styles from './header.template.module.css';

interface HeaderTemplateProps {
	children: React.ReactNode;
	typeHeader?: string;
}

const HeaderTemplate: React.FC<HeaderTemplateProps> = ({ children, typeHeader }) => {
	const headerHome = typeHeader == 'home' ? styles.header_home : '';
	return (
		<div className={styles.header_container}>
			<div className={`${styles.header} ${headerHome}`}>
				{children}
			</div>
		</div>
	);
};

export default HeaderTemplate;
