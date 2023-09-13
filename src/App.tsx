import { Routes, Route, useLocation } from 'react-router-dom';
import {CONFIGURATION_SCREEN_INFO,HOME_SCREEN_INFO,NOTE_ID_SCREEN_INFO,ADD_NOTE_SCREEN_INFO} from './config/routes/paths';
import { useThemeContext } from './hooks/use-theme-context.hook';

import ConfigurationScreen from './screens/configuration/configuration.screen';
import NoteScreen from './screens/notes/notes.screen';
import AddNoteScreen from './screens/notes/add-notes.screen';
import MainNotesScreen from './screens/notes/main-notes.screen';

import ToggleButton from './components/atoms/toogle/toogle';
import './config/styles/root.css';
import './config/styles/reset.css';
import './config/styles/base.css';
import NotFoundScreen from './screens/not-found/not-found.screen';

function App(): JSX.Element {
	const { themeMode, changeTheme } = useThemeContext();
	const location = useLocation();
	const [pathHomeScreen]          = HOME_SCREEN_INFO
	const [pathConfigurationScreen, titleConfigurationScreen] = CONFIGURATION_SCREEN_INFO
	const [pathNoteIdScreen]        = NOTE_ID_SCREEN_INFO
	const [pathAddNoteScreen]       = ADD_NOTE_SCREEN_INFO

	const isHomePage = location.pathname === pathHomeScreen;

	return (
		<div className={themeMode}>
            <div className='thememode-container'>
                {isHomePage && (
                    <ToggleButton
                        active={themeMode === 'dark-theme'}
                        onToggle={() => changeTheme()}
                        onText={'🌕'}
                        offText={'☀️'}
                    />
                )}
            </div>
			<Routes>
				<Route path={pathHomeScreen} index element={<MainNotesScreen />} />
				<Route path={pathNoteIdScreen} element={<NoteScreen />} />
				<Route path={pathAddNoteScreen} element={<AddNoteScreen />} />
				<Route path={pathConfigurationScreen} element={<ConfigurationScreen title={titleConfigurationScreen}/>}/>
				<Route path='*' element={<NotFoundScreen />}/>
			</Routes>
		</div>
	);
}

export default App;
