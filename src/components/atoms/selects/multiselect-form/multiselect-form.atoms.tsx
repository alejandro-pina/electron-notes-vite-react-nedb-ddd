import React, { useState, useEffect, useRef } from "react";
import styles from "./multi-select-form.atoms.module.css";

interface Option {
	value: string;
	label: string;
}

interface Props {
	name: string;
	options: Option[];
	style?: React.CSSProperties;
}

const MultiSelectFormAtoms: React.FC<Props> = ({ name, options, style }) => {
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);

	const handleOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = event.target.value;
		setSelectedValues((prevState) => {
			if (prevState.includes(selectedValue)) {
				return prevState.filter((value) => value !== selectedValue);
			} else {
				return [...prevState, selectedValue];
			}
		});
	};

	const handleSelectOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValues = Array.from(event.target.selectedOptions).map((option) => option.value);
		setSelectedValues(selectedValues);
	};
	  
	const handleCheckboxOptionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedValue = event.target.value;
		setSelectedValues((prevState) => {
		  	if (prevState.includes(selectedValue)) {
				return prevState.filter((value) => value !== selectedValue);
		  	} else {
				return [...prevState, selectedValue];
			}
		});
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleOptionRemove = (selectedValue: string) => {
		setSelectedValues((prevState) =>
			prevState.filter((value) => value !== selectedValue)
		);
		setIsOpen(false);
	};

	const handleAllOptionsRemove = () => {
		setSelectedValues([]);
	};

	const handleDropdownToggle = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		setIsOpen(!isOpen);
	};

	return (
		<div
			className={
				isOpen
					? `${styles.multi_select_form_group_active}`
					: `${styles.multi_select_form_group}`
			}
			ref={selectRef}
		>
			<div
				className={styles.multi_select_container}
				onClick={(e) => handleDropdownToggle(e)}
			>
				<select
					name={name}
					className={styles.multi_select_form}
					style={style}
					multiple
					value={selectedValues}
					onChange={handleSelectOptionSelect}
				>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							className={styles.multi_select_form_option}
						>
							{option.label}
						</option>
					))}
				</select>
				{!isOpen && selectedValues.length !== 0 && (
					<div className={styles.btn_control}>
						<button
							className={styles.delete_all}
							onClick={handleAllOptionsRemove}
						>
							-
						</button>
						<button
							className={styles.add_more}
							onClick={(e) => e.preventDefault()}
						>
							+
						</button>
					</div>
				)}

				<span
					className={
						selectedValues.length === 0
							? styles.multi_select_placeholder
							: `${styles.multi_select_placeholder} ${styles.multi_select_placeholder_active}`
					}
				>
					{selectedValues.length === 0
						? `Add new ${name}`
						: `${name}`}
				</span>
			</div>
			<div
				className={
					selectedValues.length === 0
						? `${styles.selected_options} ${styles.selected_options_expanded}`
						: !isOpen
						? `${styles.selected_options} ${styles.selected_options_active}`
						: `${styles.selected_options} ${styles.selected_options_active} ${styles.selected_options_expanded}`
				}
			>
				{selectedValues.length !== 0 &&
					selectedValues.map((selectedValue) => (
						<span
							key={selectedValue}
							className={styles.selected_option}
						>
							{
								options.find(
									(option) => option.value === selectedValue
								)?.label
							}
							<button
								type="button"
								className={styles.remove_option}
								onClick={() =>
									handleOptionRemove(selectedValue)
								}
							>
								X
							</button>
						</span>
					))}
			</div>

			{isOpen && (
				<div className={styles.multi_select_dropdown_container}>
					{options.map((option) => (
						<div
							key={option.value}
							className={styles.multi_select_option}
						>
							<label>
								<input
									type="checkbox"
									value={option.value}
									checked={selectedValues.includes(
										option.value
									)}
									onChange={handleCheckboxOptionSelect}
								/>
								{option.label}
							</label>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MultiSelectFormAtoms;
