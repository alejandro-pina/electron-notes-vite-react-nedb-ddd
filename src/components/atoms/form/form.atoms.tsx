import styles from './form.atoms.module.css';
import React from 'react';

interface FormAtomsProps {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	customStyle?: React.CSSProperties;
	customClass?: string;
	children: React.ReactNode;
	ref?: React.Ref<HTMLFormElement>;
	formRef?: React.Ref<HTMLFormElement>;
}

const FormAtoms = (
	{ customStyle, customClass, onSubmit, children }: FormAtomsProps,
	formRef: React.Ref<HTMLFormElement>
) => {
	const formClassName = `${customClass ?? ''}`;
	return (
		<form
			className={formClassName}
			onSubmit={onSubmit}
			style={customStyle}
			ref={formRef}
		>
			{children}
		</form>
	);
};

export default React.forwardRef(FormAtoms);
