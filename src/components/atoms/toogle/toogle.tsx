import React, { useState } from 'react';
import styles from './toggle-button.module.css';

type ToggleButtonProps = {
	active: boolean;
	onToggle: () => void;
	onText?: string;
	offText?: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
	active,
	onToggle,
	onText = 'ON',
	offText = 'OFF',
}) => {
	const handleClick = () => {
		onToggle();
	};

	return (
		<button className={styles.toggleButton} onClick={handleClick}>
			<div
				className={`${styles.toggleButtonBackground} ${
					active ? styles.on : ''
				}`}
			>
				<div
					className={`${styles.toggleButtonCircle} ${
						active ? styles.on : ''
					}`}
				/>
			</div>
			<span className={styles.toggleButtonText}>
				{active ? onText : offText}
			</span>
		</button>
	);
};

export default ToggleButton;
