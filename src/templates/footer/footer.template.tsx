import React from 'react';
import styles from './footer.template.module.css';

interface FooterTemplateProps {
	children: React.ReactNode;
}

const FooterTemplate: React.FC<FooterTemplateProps> = ({ children }) => {
	return (
		<div className={styles.footer}>
			{children}
		</div>
	);
};

export default FooterTemplate;
