import styles from './button.atoms.module.css';

interface ButtonAtomsProps {
    actionClick?: {
        arg: any;
        action: ((arg: any) => void) | null;
    };
    type?: 'button' | 'submit' | 'reset';
    name?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    icon?: boolean;
    children: React.ReactNode;
    btnStyle?: {
        btnType: keyof typeof btn_type;
        txtAlgn: keyof typeof txt_align;
        btnRadius: boolean;
        btnShadow: boolean;
        btnBorderStyle: keyof typeof btn_border_style;
        btnTxtTransform: boolean;
        btnTxtWeight: keyof typeof txt_weight;
    };
    tabIndex?: number; //Optional properties of the component, if anyNueva prop tabIndex
}

const ButtonAtoms = ({
    actionClick,
    type = 'button',
    name,
    autoFocus,
    disabled,
    icon,
    children,
    btnStyle = {
        btnType: 'primary',
        txtAlgn: 'center',
        btnRadius: true,
        btnShadow: false,
        btnBorderStyle: 'dashed',
        btnTxtTransform: true,
        btnTxtWeight: 'bold',
    },
    tabIndex
}: ButtonAtomsProps) => {
    const {
        btnType,
        txtAlgn,
        btnRadius,
        btnShadow,
        btnBorderStyle,
        btnTxtTransform,
        btnTxtWeight,
    } = btnStyle;
    const arg = actionClick?.arg ?? null;
    const action = actionClick?.action ?? null;

    const actionButton = () => {
        if (arg !== null && action !== null) {
            action(arg);
        }
    };
    return (
        <button
            type={type}
            name={name}
            className={`${icon && styles.btn_icon || styles.btn} ${btn_type[btnType]} ${
                txt_align[txtAlgn]
            } ${btnRadius && styles.btn_border_radius} ${
                btnShadow && styles.btn_sdw
            } ${btnBorderStyle && btn_border_style[btnBorderStyle]} ${
                btnTxtTransform && styles.btn_txt_transform
            } ${btnTxtWeight && txt_weight[btnTxtWeight]}`}
            autoFocus={autoFocus}
            disabled={disabled}
            onClick={arg && action ? actionButton : () => {}}
            tabIndex={tabIndex}
        >
            {children}
        </button>
    );
};

export default ButtonAtoms;

const btn_type = {
    primary: styles.btn_primary,
    secondary: styles.btn_secondary,
    success: styles.btn_success,
    danger: styles.btn_danger,
    warning: styles.btn_warning,
    info: styles.btn_info,
    light: styles.btn_light,
    dark: styles.btn_dark,
    primary_r: styles.btn_primary_r,
    secondary_r: styles.btn_secondary_r,
    success_r: styles.btn_success_r,
    danger_r: styles.btn_danger_r,
    warning_r: styles.btn_warning_r,
    info_r: styles.btn_info_r,
    light_r: styles.btn_light_r,
    dark_r: styles.btn_dark_r,
};

const txt_align = {
    center: styles.btn_txt_center,
    left: styles.btn_txt_left,
    right: styles.btn_txt_right,
};

const txt_weight = {
    lighter: styles.btn_txt_weight_lighter,
    bold: styles.btn_txt_weight_bold,
};

const btn_border_style = {
    solid: styles.border_style_solid,
    dashed: styles.border_style_dashed,
    dotted: styles.border_style_dotted,
};
