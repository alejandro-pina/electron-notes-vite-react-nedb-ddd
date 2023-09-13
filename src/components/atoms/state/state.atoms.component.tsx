import React, { FC } from "react";
import styles from "./state.atoms.module.css";

interface StateAtomsProps {
	geometry?: "circle" | "square";
	color?: string;
	size?: string;
	outline?: string;
}

const StateAtoms: FC<StateAtomsProps> = ({
	geometry = "circle",
	color = "red",
	size = "20",
	outline = "none",
}) => {
	const shapeStyle = {
		width: `${size}px`,
		height: `${size}px`,
		backgroundColor: `${outline === "none" ? color : "transparent"}`,
		borderRadius: `${geometry === "circle" ? "50%" : "0"}`,
		border: `${outline} solid ${color}`,
	};

	return (
		<span className={styles.container}>
			{geometry === "square" && (
				<span style={shapeStyle} className={styles.square}></span>
			)}
			{geometry === "circle" && (
				<span style={shapeStyle} className={styles.circle}></span>
			)}
		</span>
	);
};

export default StateAtoms;
