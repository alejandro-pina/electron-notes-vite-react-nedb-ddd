import React from "react";
import styles from "./header-info.template.module.css";

interface HeaderInfoTemplateProps {
	children: React.ReactNode;
	title?: string;
}

const HeaderInfoTemplate: React.FC<HeaderInfoTemplateProps> = ({ children, title }) => {
	return (
		<div className={styles.header_info}>
			{children}
			{title}
		</div>
	);
};

export default HeaderInfoTemplate;
