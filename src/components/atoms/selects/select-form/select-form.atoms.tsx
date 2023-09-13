import React from "react";
import styles from "./select-form.atoms.module.css";

interface Option {
	value: string;
	label: string;
}

interface SelectFormAtomsProps {
	name: string;
	label: string;
	options: Option[];
	valDefault?: string;
	style?: React.CSSProperties;
	required?: boolean;
}

const SelectFormAtoms: React.FC<SelectFormAtomsProps> = ({
	name,
	label,
	options,
	valDefault,
	style,
	required,
}) => (
	<div className={styles.select_form_group}>
		<select
			name={name}
			className={styles.select_form}
			style={style}
			defaultValue={valDefault}
			required={required}
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

export default SelectFormAtoms;
