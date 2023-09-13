import { useNavigate, useLocation } from 'react-router-dom';
import styles from './not-found.screen.module.css';
import ButtonAtoms from '@/components/atoms/button/button.atoms';
import IconRefresh from '@/components/atoms/icons/icon-refresh.atoms';
import IconApps from '@/components/atoms/icons/icon-app.atoms';


const NotFoundScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
	const handleMainScreen = (goTo: string) => {
		
		navigate(goTo);
	};
    const handleRefresh = () => {
		window.location.reload();
	};

    
    return (
		<div className={styles.not_found_container}>
			<div className={styles.not_found_animation}>
				<div
					className={`${styles.not_found_animation_ear} ${styles.not_found_animation_ear_left}`}
				></div>
				<div
					className={`${styles.not_found_animation_ear} ${styles.not_found_animation_ear_right}`}
				></div>
				<div className={styles.not_found_animation_face}>
					<div
						className={`${styles.not_found_animation_eye} ${styles.not_found_animation_eye_left}`}
					>
						<div
							className={styles.not_found_animation_eye_pupil}
						></div>
					</div>
					<div
						className={`${styles.not_found_animation_eye} ${styles.not_found_animation_eye_right}`}
					>
						<div
							className={styles.not_found_animation_eye_pupil}
						></div>
					</div>
					<div className={styles.not_found_animation_muzzle}></div>
				</div>
				<div className={styles.to_back_container}>
					<ButtonAtoms
						btnStyle={{
							btnType: 'info',
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
							action: () => handleRefresh(),
						}}
					>
						<IconRefresh />
					</ButtonAtoms>
					<ButtonAtoms
						btnStyle={{
							btnType: 'light',
							btnBorderStyle: 'dotted',
							txtAlgn: 'center',
							btnRadius: true,
							btnShadow: true,
							btnTxtTransform: false,
							btnTxtWeight: 'bold',
						}}
						icon={true}
						actionClick={{
							arg: '/',
							action: () => handleMainScreen('/'),
						}}
					>
						<IconApps />
					</ButtonAtoms>
				</div>
			</div>
		</div>
	);
};

export default NotFoundScreen;
