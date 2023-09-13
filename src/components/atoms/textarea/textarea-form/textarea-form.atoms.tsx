import styles from './textarea-form.atoms.module.css';
import React, { CSSProperties } from 'react';

interface TextareaFormAtomsProps {
	placeholder: string;
	name: string;
	valDefault?: string;
	style?: CSSProperties;
	required?: boolean;
	onEvent?: (event: React.FormEvent<HTMLTextAreaElement>) => void;
	customClass?: string;
	autoFocus?: boolean;
}

const TextareaFormAtoms: React.FC<TextareaFormAtomsProps> = ({
	placeholder,
	name,
	valDefault,
	style,
	required,
	onEvent,
	customClass,
	autoFocus,
}) => {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (autoFocus && textareaRef.current) {
			const textarea = textareaRef.current;
			textarea.focus();
			textarea.setSelectionRange(
				textarea.value.length,
				textarea.value.length
			); 
		}
	}, [autoFocus]);

	return (
		<div className={styles.textarea_form_group}>
			<textarea
				defaultValue={valDefault}
				name={name}
				className={`${styles.textarea_form} ${customClass}`}
				style={style}
				placeholder=' '
				required={required}
				onChange={onEvent}
				ref={textareaRef}
			/>
			<div className={styles.textarea_cut}></div>
			<label
				htmlFor={name}
				className={styles.textarea_placeholder}
				style={style}
			>
				{placeholder}
			</label>
		</div>
	);
};

export default TextareaFormAtoms;