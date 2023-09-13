import styles from './input-form.atoms.module.css';

interface Props {
  type: 'text' | 'number' | 'hidden' | 'password';
  placeholder?: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  autoComplete?: 'on' | 'off';
  list?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  size?: number;
  valDefault?: string | number;
  multiple?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  required?: boolean;
}

const InputFormAtoms = ({
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
  valDefault,
  multiple,
  autoFocus,
  disabled,
  style,
  required,
}: Props) => {
  
  
  return type === 'hidden' ? (
    <input type={type} name={name} defaultValue={valDefault} />
  ) : (
    <div className={styles.input_form_group}>
      <input
        type={type}
        name={name}
        defaultValue={valDefault}
        className={styles.input_form}
        style={style}
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
        placeholder=' '
      />
      <div className='cut'></div>
      <label htmlFor={name} className={styles.input_placeholder} style={style}>
        {placeholder}
      </label>
    </div>
  );
};

export default InputFormAtoms;
