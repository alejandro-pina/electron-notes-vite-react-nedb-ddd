import React from "react";
import styles from "./select.atoms.module.css";

interface Option {
	value: string;
	label: string;
}

interface SelectAtomsProps {
	name: string;
	label: string;
	options: Option[];
	valDefault?: string;
	style?: React.CSSProperties;
	required?: boolean;
	onChange?: (value: string) => void;
}

const SelectAtoms: React.FC<SelectAtomsProps> = ({
	name,
	label,
	options,
	valDefault,
	style,
	required,
	onChange, 
}) => (
	<div className={styles.select_form_group}>
		<select
			name={name}
			className={styles.select_form}
			style={style}
			defaultValue={valDefault}
			required={required}
			onChange={(event) => {
				if (onChange) {
					onChange(event.target.value); 
				}
			}}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
		<div className="cut"></div>
		<label
			htmlFor={name}
			className={styles.select_placeholder}
			style={style}
		>
			{label}
		</label>
	</div>
);

export default SelectAtoms;
