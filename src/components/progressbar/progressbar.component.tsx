import React from 'react';
import styles from './progressbar.module.css';
import ButtonAtoms from '../atoms/button/button.atoms';
import IconCancelOperation from '../atoms/icons/icon-cancel-operation.atoms';

interface ProgressBarProps {
	title?: string;
	info?:string;
	currentCount: number;
	totalCount: number;
	showTime?: string | null;
	setCancel?: (cancel: boolean) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ title = '', info= '', currentCount, totalCount, showTime = null, setCancel,}) => {


	const handleCancel = () => {
		if (setCancel) {
		  setCancel(true);
		}
	};
	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		return `${padZero(hours)}:${padZero(minutes)}:${padZero(
			remainingSeconds
		)}`;
	};

	const padZero = (value: number): string => {
		return value.toString().padStart(2, '0');
	};

	const progress = Math.floor((currentCount / totalCount) * 100);

	return (
		<>
		<div className={styles.progressbar_overlay_container}></div>
		<div className={styles.progressbar_container}>
			<div className={styles.progress_body}>
				{
					(title || info) && (
					<div className={styles.progress_header}>	
						{title && <h3 className={styles.progress_title}>{title}</h3>}			
						{info && <p className={styles.progress_info}>{info}</p>}						
					</div>)
				}
				<div className={styles.progress_element}>
					<p className={styles.progress_label}>{`${progress}%`}</p>
					<div className={styles.progress_container}>
						<div
							className={styles.progress_fill}
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
				<div className={styles.aditional_info}>
					<p>{showTime && showTime}</p>
					<p>{currentCount}/{totalCount}</p>
				</div>
			</div>
			<ButtonAtoms
				btnStyle={{
					btnType: 'primary',
					btnBorderStyle: 'solid',
					txtAlgn: 'center',
					btnRadius: true,
					btnShadow: true,
					btnTxtTransform: false,
					btnTxtWeight: 'bold',
				}}
				icon={true}
				actionClick={{
					arg: {},
					action: handleCancel,
				}}
			>
				<IconCancelOperation />
			</ButtonAtoms>
		</div>
		</>
	);
};
