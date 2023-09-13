import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeContextProvider } from './contexts/theme-mode.context';
import { APP_ERROR_MSG } from 'languages/front/app.language';

const Root: React.FC = () => {
	return (
		<StrictMode>
			<ThemeModeContextProvider>
				<HashRouter>
					<App />
				</HashRouter>
			</ThemeModeContextProvider>
		</StrictMode>
	);
};

const rootElement = document.getElementById('root');
if (rootElement) {
	createRoot(rootElement).render(<Root />);
} else {
	console.error(APP_ERROR_MSG['root']);
}