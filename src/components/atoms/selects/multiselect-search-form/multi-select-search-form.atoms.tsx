import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from "react";
import styles from "./multi-select-search-form.atoms.module.css";

interface Option {
	value: string;
	label: string;
}

interface Props {
	name: string;
	options: Option[];
	style?: React.CSSProperties;
}

const MultiSelectSearchFormAtoms: React.FC<Props> = ({
	name,
	options,
	style,
}) => {
	const [selectedValues, setSelectedValues] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const selectRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: Event) => {
		if (
			selectRef.current &&
			!selectRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleOptionSelect = (event: ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = event.target.value;
		setSelectedValues((prevState) => {
			if (prevState.includes(selectedValue)) {
				return prevState.filter((value) => value !== selectedValue);
			} else {
				return [...prevState, selectedValue];
			}
		});
	};

	const handleOptionRemove = (selectedValue: string) => {
		setSelectedValues(
			selectedValues.filter((value) => value !== selectedValue)
		);
		setIsOpen(false);
	};

	const handleDropdownToggle = (event: MouseEvent) => {
		event.stopPropagation();
		setIsOpen(!isOpen);
		setSearchTerm("");
	};

	const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setIsOpen(true);
	};

	const handleCheckboxOptionSelect = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const selectedValue = event.target.value;
		setSelectedValues((prevState) => {
			if (prevState.includes(selectedValue)) {
				return prevState.filter((value) => value !== selectedValue);
			} else {
				return [...prevState, selectedValue];
			}
		});
	};

	const handleSearchInputKeyDown = (
		event: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const firstMatchingOption = filteredOptions[0];
			selectRef.current?.blur();
			if (firstMatchingOption) {
				handleOptionSelect({
					target: { value: firstMatchingOption.value },
				} as ChangeEvent<HTMLSelectElement>);
			}
		}
	};

	const handleDeleteAllOptions = () => {
		setSelectedValues([]);
		selectRef.current?.blur();
	};

	const handleSelectClick = () => {
		if (!isOpen) {
			setIsOpen(true);
		}
	};

	const handleSelectBlur = () => {
		//setIsOpen(false);
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
				onClick={handleDropdownToggle}
			>
				<select
					name={name}
					className={styles.multi_select_form}
					style={style}
					multiple
					value={selectedValues}
					onChange={handleOptionSelect}
					onClick={handleSelectClick}
					onBlur={handleSelectBlur}
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
							onClick={handleDeleteAllOptions}
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
					<div
						className={
							styles.multi_select_search_dropdown_container
						}
					>
						<input
							type="text"
							className={styles.search_input}
							placeholder={`busca`}
							value={searchTerm}
							onChange={handleSearchInputChange}
							onKeyDown={handleSearchInputKeyDown}
						/>
					</div>
					<ul className={styles.multi_select_dropdown}>
						{filteredOptions.map((option) => (
							<li
								key={option.value}
								className={styles.multi_select_option}
							>
								<label>
									<input
										type="checkbox"
										className={styles.option_checkbox}
										value={option.value}
										checked={selectedValues.includes(
											option.value
										)}
										onChange={handleCheckboxOptionSelect}
									/>
									<span className={styles.option_text}>
										{option.label}
									</span>
								</label>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MultiSelectSearchFormAtoms;
