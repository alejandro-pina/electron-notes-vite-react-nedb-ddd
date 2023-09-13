import React from 'react';
import styles from './main.template.module.css';

interface MainTemplateProps {
	children: React.ReactNode;
}

const MainTemplate: React.FC<MainTemplateProps> = ({ children }) => {
	return (
		<div className={styles.screen}>
			<div className={styles.bg_main}></div>
			<div className={styles.main_content}>
				<div className={styles.section_principal}>{children}</div>
			</div>
		</div>
	);
};

export default MainTemplate;
