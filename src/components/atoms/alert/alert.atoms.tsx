import React from 'react';
import styles from './alert.atoms.module.css';

interface AlertStyle {
	alertType: string;
	txtAlgn: string;
	alertRadius: boolean;
	alertShadow: boolean;
	alertBorderStyle: string;
	alertTxtTransform: boolean;
}

type AlertTypes = {
	[key: string]: any;
};

type TxtAlign = {
	[key: string]: any;
};

type BorderStyle = {
	[key: string]: any;
};

const AlertAtoms = ({
	children,
	alertStyle,
}: {
	children: React.ReactNode;
	alertStyle: AlertStyle;
}) => {
	const {
		alertType,
		txtAlgn,
		alertRadius,
		alertShadow,
		alertBorderStyle,
		alertTxtTransform,
	} = alertStyle;
	
	return (
		<div
			className={`${styles.alert} ${alert_type[alertType]} ${
				txt_align[txtAlgn]
			} ${alertRadius && styles.alert_border_radius} ${
				alertShadow && styles.alert_sdw
			} ${alertBorderStyle && alert_border_style[alertBorderStyle]} ${
				alertTxtTransform && styles.alert_txt_transform
			}`}
		>
			{children}
		</div>
	);
};

export default AlertAtoms;

const alert_type: AlertTypes = {
	primary: styles.alert_primary,
	secondary: styles.alert_secondary,
	success: styles.alert_success,
	danger: styles.alert_danger,
	warning: styles.alert_warning,
	info: styles.alert_info,
	light: styles.alert_light,
	dark: styles.alert_dark,
	primary_r: styles.alert_primary_r,
	secondary_r: styles.alert_secondary_r,
	success_r: styles.alert_success_r,
	danger_r: styles.alert_danger_r,
	warning_r: styles.alert_warning_r,
	info_r: styles.alert_info_r,
	light_r: styles.alert_light_r,
	dark_r: styles.alert_dark_r,
};

const txt_align: TxtAlign = {
	center: styles.alert_txt_center,
	left: styles.alert_txt_left,
	right: styles.alert_txt_right,
};

const alert_border_style: BorderStyle = {
	solid: styles.border_style_solid,
	dashed: styles.border_style_dashed,
	dotted: styles.border_style_dotted,
	double: styles.border_style_double,
};
