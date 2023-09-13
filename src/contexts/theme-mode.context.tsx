import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import useActions from '@/hooks/useActions';

export type ThemeMode = 'light-theme' | 'dark-theme';

export type ThemeModeContextData = {
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	changeTheme: () => Promise<void>;
};

export interface ThemeModeContextProviderProps {
	children: React.ReactNode;
}

export const ThemeModeContext = createContext<ThemeModeContextData | undefined>(
	undefined
);

export const ThemeModeContextProvider: React.FC<
	ThemeModeContextProviderProps
> = ({ children }) => {
	const [themeMode, setThemeMode] = useState<ThemeMode>('light-theme');
	const callAction = useActions();

	const checkTheme = useCallback(async () => {
		const getThemeMode = await callAction('themeMode', false);
		setThemeMode(getThemeMode);
	}, [callAction]);

	const changeTheme = useCallback(async () => {
		const getThemeMode = await callAction('themeMode', true);
		setThemeMode(getThemeMode);
	}, [callAction]);

	useEffect(() => {
		checkTheme();

		const updateThemeHandler = (updatedTheme: ThemeMode) => {
			setThemeMode(updatedTheme);
		};

		callAction('on', 'updateTheme', updateThemeHandler);

		return () => {
			callAction('remove', 'updateTheme', updateThemeHandler);
		};
	}, [checkTheme, callAction]);

	const contextValue = useMemo(
		() => ({
			themeMode,
			setThemeMode,
			changeTheme,
		}),
		[themeMode, setThemeMode, changeTheme]
	);

	return (
		<ThemeModeContext.Provider value={contextValue}>
			{children}
		</ThemeModeContext.Provider>
	);
};
