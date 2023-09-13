import React from 'react';
import styles from './input.atoms.module.css'

interface InputAtomsProps {
  type: string;
  placeholder?: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: string;
  list?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  size?: number;
  val?: string;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  required?: boolean;
}

const InputAtoms: React.FC<InputAtomsProps> = ({
  type,
  placeholder,
  name,
  min,
  max,
  step,
  autoComplete,
  list,
  minLength,
  maxLength,
  readOnly,
  size,
  val,
  multiple,
  autoFocus,
  disabled,
  style,
  required,
}) => (
  <input
    type={type}
    defaultValue={val}
    name={name}
    className={styles.input_form}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
    autoComplete={autoComplete}
    list={list}
    minLength={minLength}
    maxLength={maxLength}
    readOnly={readOnly}
    size={size}
    autoFocus={autoFocus}
    disabled={disabled}
    required={required}
    multiple={multiple}
    title=""
    style={style}
  />
);

export default InputAtoms;
