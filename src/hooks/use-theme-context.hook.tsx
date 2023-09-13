import { useContext } from 'react';
import {
	ThemeModeContext,
	ThemeModeContextData,
} from '../contexts/theme-mode.context';
import { APP_ERROR_MSG } from 'languages/front/app.language';

export const useThemeContext = (): ThemeModeContextData => {
	const context = useContext(ThemeModeContext);
	if (!context) {
		throw new Error(APP_ERROR_MSG['use_theme_context']);
	}
	return context;
};
