import React from 'react';
import styles from './loading.module.css';

interface LoadingProps {
	text?: string;
	animationClass?: 'loading' | 'loading_read' | 'loading_diagonal_square' | 'loading_lineal_squares' | 'loading_open_file' | 'loading_long_time' | 'loading_donwload' | 'loading_send' | 'loading_save' | 'loading_transfer';
  }

export const Loading: React.FC<LoadingProps> = ({text = '', animationClass = 'loading',}) => {
	
	let content = null;
	if (animationClass === 'loading_read' || animationClass === 'loading_lineal_squares' || animationClass === 'loading_open_file' || animationClass === 'loading_long_time') {
		content = (
		  <>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		  </>
		);
	  }
	  if (animationClass === 'loading_donwload') {
		content = (
		  <div className={styles.loading_6_item}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		  </div>
		);
	  }
	return (
		<div className={styles.loading_container}>
			<div className={styles[animationClass]}>{content}{text}</div>
		</div>
	);
};
