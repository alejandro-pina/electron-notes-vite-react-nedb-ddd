import { app, BrowserWindow, dialog, shell, ipcMain, IpcMainEvent, JumpListCategory, JumpListItem, Menu, Tray, screen, nativeTheme,Notification, globalShortcut } from 'electron';
import path from 'path';
import fs from 'fs';
import Store from 'electron-store';
import csv from 'fast-csv';
import Datastore from 'nedb-promises';
import { release } from 'node:os';
import { join } from 'node:path';
import { container } from '../../backend/container';
import { ADD_NOTE_SCREEN_INFO } from '../../src/config/routes/paths';
import { messageSystem } from '../utils/messages';
import { BACKGROUND_DEFAULT } from '../../config/constants';
import { SYSTEM_CLICK_OPTIONS, SYSTEM_MSG, SYSTEM_DOCK_MENU, SYSTEM_BUTTON_DIALOG } from '../../languages/back/notes/system-messages.language';

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

let globalShortcutsEnabled = false;

const [pathAddNoteScreen, titleAddNoteScreen] = ADD_NOTE_SCREEN_INFO

if (release().startsWith('6.1')) app.disableHardwareAcceleration();
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let store = new Store();
let mainWindow: BrowserWindow | null = null;

const api = join(__dirname, '../preload/api.preload.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

// Icons paths
const iconPath =
process.platform === 'win32'
? path.join(__dirname, 'Icon', 'icon.ico')
: process.platform === 'darwin'
? path.join(__dirname, 'Icon', 'icon.icns') 
: path.join(__dirname, 'Icon', 'icon.png'); 

function formatTitleFromURL(url: string): string {
    if (url) {
        const urlFragments = url.split('/');
        const filteredFragments = urlFragments.filter(fragment => fragment);
        const lastFragment = filteredFragments[filteredFragments.length - 1];
        const titleFromURL = lastFragment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, firstLetter => firstLetter.toUpperCase());
        return titleFromURL;
    }
    return ''; 
}

async function createAppWindow() {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	const windowWidth = Math.floor(width * 0.8);
	const windowHeight = Math.floor(height * 0.8);

	mainWindow = new BrowserWindow({
		width: 1600,
		height: 900,
		minWidth: 1600, 
		minHeight: 900, 
		icon: iconPath,
		webPreferences: {
			preload: api,
			contextIsolation: true,
			devTools: true,
		},
	});
	
	mainWindow.setBackgroundColor(BACKGROUND_DEFAULT);

	if (url) {
		mainWindow.loadURL(url);
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(indexHtml);
	}

    mainWindow?.webContents.on('page-title-updated', (event, title) => {
        const formattedTitle = formatTitleFromURL(title);
        mainWindow?.setTitle(formattedTitle);
    });
	
	mainWindow.webContents.on('crashed', (e) => {});

	process.on('uncaughtException', (e) => {});
	
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow?.webContents.send(
			'main-process-message',
			new Date().toLocaleString()
		);
	});

	const commandLineArgs = process.argv
	if (commandLineArgs.length === 2)
	{
		const lineArg = commandLineArgs.slice(1).toString()
		if (lineArg === '__new_note')
		{
			newNote()
		}
	}

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});

	ipcMain.handle('sendMessageToMainWindow', async (event, message) => {
		mainWindow?.webContents.send('messageFromMainToRenderer', message);
	});

	ipcMain.handle('callMessageToMainWindow', async (event, message) => {
		const processedMessage = message + ' PING';
		return processedMessage;
	});
	
	mainWindow?.webContents.once('did-finish-load', () => {
		mainWindow?.webContents.executeJavaScript('localStorage.clear()');
	});

	mainWindow.on('close', async (event:any) => {
		event.preventDefault()
		return clearAndCloseWindows(event,true)
	});

	mainWindow.on('focus', () => {
		enableGlobalShortcuts();
	});
	
	 mainWindow.on('blur', () => {
		disableGlobalShortcuts();
	});

}

const newNote = () => {
	openNewWindow({
		title: titleAddNoteScreen,
		width: 600,
		height: 600,
		path: pathAddNoteScreen,
		params: { msg: SYSTEM_DOCK_MENU['message_example'] },
	});
}

const dockMenu = Menu.buildFromTemplate([
	{
		label: SYSTEM_DOCK_MENU['new_note'],
		click() {
			newNote()
			mainWindow?.webContents.send('messageFromMainToRenderer', {
				msg: SYSTEM_DOCK_MENU['message_example'],
				action: 'update',
			});
		},
	},
]);

function createContextMenu(): Menu {
	const template: Electron.MenuItemConstructorOptions[] = [
		{ label: SYSTEM_CLICK_OPTIONS['copy'], role: 'copy' },
		{ label: SYSTEM_CLICK_OPTIONS['cut'], role: 'cut' },
		{ label: SYSTEM_CLICK_OPTIONS['paste'], role: 'paste' },
		{ label: SYSTEM_CLICK_OPTIONS['select_all'], role: 'selectAll' },
		{ type: 'separator' }
	];
  
	const contextMenu = Menu.buildFromTemplate(template);
	return contextMenu;
  }
  
app.on('browser-window-created', (event, window) => {
	window.webContents.on('context-menu', (e, params) => {
		e.preventDefault();
		const contextMenu = createContextMenu();
		contextMenu.popup({ window: window });
	});
});
   
interface WebContentsIndexSignature {[key: string]: any;}
  

const enableGlobalShortcuts = () => {
	if (!globalShortcutsEnabled) {
		globalShortcutsEnabled = true;
		const isMac = process.platform === 'darwin';
		const shortcuts = [
			{ accelerator: 'CommandOrControl+A', action: 'selectAll', label: SYSTEM_CLICK_OPTIONS['select_all'] },
			{ accelerator: 'CommandOrControl+C', action: 'copy', label: SYSTEM_CLICK_OPTIONS['copy'] },
			{ accelerator: 'CommandOrControl+X', action: 'cut', label: SYSTEM_CLICK_OPTIONS['cut'] },
			{ accelerator: 'CommandOrControl+V', action: 'paste', label: SYSTEM_CLICK_OPTIONS['paste'] },
			{ accelerator: 'CommandOrControl+Z', action: 'undo', label: SYSTEM_CLICK_OPTIONS['undo'] },
      		{ accelerator: 'CommandOrControl+Y', action: 'redo', label: SYSTEM_CLICK_OPTIONS['redo'] },
			{ accelerator: isMac ? 'CommandOrControl+Shift+Z' : 'Ctrl+Shift+Z', action: 'redo', label: SYSTEM_CLICK_OPTIONS['redo'] },
		];
  
		shortcuts.forEach(({ accelerator, action }) => {
			const success = globalShortcut.register(accelerator, () => {
			const win = BrowserWindow.getFocusedWindow();
			if (win) {
				const webContents: WebContentsIndexSignature = win.webContents;
				if (typeof webContents[action] === 'function') {
					webContents[action]();
				}
			}
			});
			
			if (!success) {
				console.error(`${SYSTEM_MSG['global_shortcut']} ${accelerator}`);
			}
		});
	}
}

const disableGlobalShortcuts = () => {
	if (globalShortcutsEnabled) {
	  	globalShortcutsEnabled = false;
		globalShortcut.unregisterAll();
		enableSpecificGlobalShortcut(); 
	}
}
const enableSpecificGlobalShortcut = () => {
	const success = globalShortcut.register('CommandOrControl+N', () => {
	  newNote();
	});
  
	if (!success) {
	  console.error(`${SYSTEM_MSG['global_shortcut']} CommandOrControl+N`);
	}
};
app.whenReady()
	.then(() => {

		if (process.platform === 'darwin') {
			app.dock.setMenu(dockMenu);
		}else if (process.platform === 'win32') {
			const jumpListItems = [
				{ type: 'task', title: 'New Note', program: process.execPath, args: '__new_note' }
			];

			
			app.setJumpList([
				{
				  type: 'tasks',
				  name: 'My Custom Tasks',
				  items: jumpListItems.filter((item) => item.type === 'task').map((item) => ({
					type: 'task',
					title: item.title,
					program: item.program,
					args: item.args,
				  })),
				}
			  ]);
		}
		
	})
	.then(createAppWindow)
	.catch((error) => {
		
		console.error(error);
	});

app.on('second-instance', (event, commandLine, workingDirectory) => {
	if(commandLine.length >= 3)
	{
		const lineArg = commandLine.slice(2).toString()
		if (lineArg === '__new_note')
		{
			newNote()
		}
	}
});


const clearAndCloseWindows = async (event:any, message:boolean = false) => {

	event.preventDefault();


	const persistClose = async () => {
		if (mainWindow instanceof BrowserWindow) {
			try {
				await mainWindow?.webContents.executeJavaScript('localStorage.clear()');
				closeAllChildWindow();
				app.exit(0);
			} catch (error) {
				console.error(error);
			}
		}
	}
	if (message)
	{
		const result = dialog.showMessageBoxSync({
			type: 'question',
			buttons: [SYSTEM_BUTTON_DIALOG['yes'],SYSTEM_BUTTON_DIALOG['cancel']],
			title: 'Atention',
			message: messageSystem('exit_app')
		  });
		if (result === 1) {
			return;
		} 
	}
	persistClose()
}

app.on('window-all-closed', async (event:any) => {
	clearAndCloseWindows(event,true)
});

app.on('before-quit', (event) => {
	return clearAndCloseWindows(event)
});

app.on('will-quit', (event) => {
	mainWindow = null;
	return clearAndCloseWindows(event)
});

app.on('quit', (event) => {
	return clearAndCloseWindows(event)
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createAppWindow();
	}
});


ipcMain.handle('themeMode', async (event, message) => {
	const currentTheme =
		store.get('themeMode') ??
		(nativeTheme.shouldUseDarkColors && 'dark-theme');

	if (message) {

		let changeTheme = currentTheme === 'dark-theme' ? '' : 'dark-theme';
		store.set('themeMode', changeTheme);
		mainWindow?.webContents.send('updateTheme', changeTheme);
		BrowserWindow.getAllWindows().forEach((window) => {
			window.webContents.send('updateTheme', changeTheme);
		});
		return changeTheme;
	}
	return currentTheme;
});

const controllers = {
	countNotes               : container.countNotesController,
	getNoteById              : container.getNoteByIdController,
	updateNote               : container.updateNoteController,
	deleteNote               : container.deleteNoteController,
	searchNoteByDescription  : container.searchNoteByDescriptionController,
	searchNoteByDate         : container.searchNoteByDateController,
	addNote                  : container.addNoteController,
	importNotes              : container.importNotesController,
	getAllNotes              : container.getAllNotesController,
	getAllNotesToExport      : container.getAllNotesToExportController,
	getAllNotesWithPagination: container.getAllNotesWithPaginationController,
	getNotesPerPage          : container.getNotesPerPageController,
};

for (const [eventName, controller] of Object.entries(controllers)) {
	ipcMain.handle(eventName, async (_, args) => {
		return controller.execute(args);
	});
}

const closeAllChildWindow = () => {
	const windows = BrowserWindow.getAllWindows();
	windows.forEach((window) => {
		if (window !== mainWindow) {
			window.close();
		}
	});
};

const openNewWindow = (arg: any) => {
	const { path, title, width, height, params } = arg; 
	
	if (!path) {
		dialog.showErrorBox('Error',messageSystem('error_open_window'));
		return Promise.resolve(false);
	}
	const windowsTitle = title.length > 100 ? title.slice(0, 50) + ',,,' : title;

	const childWindow = new BrowserWindow({
		title: windowsTitle,
		width: width || 1280,
		height: height || 1024,
		minWidth: 400, 
		minHeight: 600, 
		skipTaskbar: true,
		transparent: false,
		show: false, 
		webPreferences: {
			preload: api,
			contextIsolation: true,
			devTools: true,
		},
	});

	
	const windowClosedPromise = new Promise<boolean>((resolve) => {
		childWindow.on('closed', () => {
			resolve(true);
		});
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		childWindow.loadURL(`${url}#${path}`);
		childWindow.webContents.openDevTools();
	} else {
		childWindow.loadFile(indexHtml, { hash: path });
	}
	
	childWindow.webContents.once('dom-ready', () => {
		setTimeout(() => {
			childWindow.show(); 
		}, 100);
	});

	childWindow.setMenu(null);
	const emptyMenu = Menu.buildFromTemplate([]);

	if (params) {
		
		const mainWindow = BrowserWindow.getFocusedWindow();
		
		if (mainWindow) {
			mainWindow.webContents.send('params-from-child', params);
		}
	}

	childWindow.on('focus', () => {
		enableGlobalShortcuts();
	});
	
	childWindow.on('blur', () => {
		disableGlobalShortcuts();
	});

    childWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            childWindow.close();
        }
    });
	
	return windowClosedPromise;
};


ipcMain.handle('openWin', (_, arg) => {
	return openNewWindow(arg);
});

ipcMain.handle('closeAllChildWindow', () => {
	return closeAllChildWindow();
});

ipcMain.handle('closeChildWindow', () => {
	const childWindow = BrowserWindow.getFocusedWindow();
	if (childWindow) {
		childWindow.close();
		return Promise.resolve(true);
	} else {
		return Promise.resolve(false);
	}
});


ipcMain.handle('alertMessage', (_, args = {}) => {
	
	interface Button {
		label: string;
		id: string;
	}

	const { message, type = 'info', title = 'Alert', buttons = [], actionAfter = '' } = args;

	const validTypes = ['info', 'warning', 'error'];
	if (!validTypes.includes(type)) {
		throw new Error(`${messageSystem('invalid_alert_type')} ${type}`);
	}

	const focusedWindow = BrowserWindow.getFocusedWindow();
	const options = {
		type,
		title,
		message,
		buttons:
			buttons.length > 0
				? buttons.map((btn: Button) => btn.label)
				: ['OK'],
		defaultId: 0,
		parent: focusedWindow,
		center: true,
	};

	
	if (focusedWindow) {
		options.parent = focusedWindow;
	}

	const result = dialog.showMessageBoxSync(options);
	const pressedButton = buttons.find(
		(btn: Button) => btn.label === options.buttons[result]
	);

	if (pressedButton) {
		const actionId = pressedButton.id;

		switch (actionAfter) {
			case 'closeAllWindows':
				app.quit();
				break;
			case 'closeCurrentWindow':
				if (focusedWindow && focusedWindow.isFocused()) {
					focusedWindow.close();
				}
				break;
			default:
				break;
		}

		return actionId;
	}
	
	return -1;
});

const convertToCSV = async (data: any[], filePath: string) => {
    if (filePath) {
        const writableStream = fs.createWriteStream(filePath);
        const csvStream = csv.format({ headers: true });
        csvStream.pipe(writableStream);

        if (data.length > 0) {
            const header = Object.keys(data[0]);
            csvStream.write(header);
        }

        for (let i = 0; i < data.length; i++) {
            csvStream.write(data[i]);
        }

        csvStream.end();

        return {
            msg: messageSystem('export_csv_file'),
        };
    }
};

const saveFile = async (data: any, filePath?: string, extension?: string, typeData?: 'file' | 'data' ) => {

	try {
		if (!data) { throw new Error(messageSystem('no_records'));}

		if (!filePath) {
			filePath = path.join(app.getPath('desktop'), 'exported_data');
		}

		if (typeData === 'file') {
			if (typeof data !== 'string') {
				throw new Error(messageSystem('name_file'));
			}
			await fs.promises.copyFile(data, filePath);
			return { msg: messageSystem('success_export_file') };
		} else if (typeData === 'data') {
			if (!extension && filePath) {
				extension = path.extname(filePath).slice(1);
			}

			if (!extension) {
				extension = 'txt';
			}

			let fileContent = '';

			if (typeof data === 'string') {
				if (extension === 'txt' || extension === 'csv') {
					fileContent = data;
				} else {
					throw new Error(messageSystem('error_extension'));
				}
			} else if (Array.isArray(data) || typeof data === 'object') {
				if (extension === 'csv') {
					try{
						return await convertToCSV(data, filePath)
					}
					catch(error)
					{
						console.log(error)
					}
					
				} else if (extension === 'json') {
					fileContent = JSON.stringify(data);
				} else {
					throw new Error(messageSystem('error_data_extension'));
				}
			} else {
				throw new Error(messageSystem('error_data_extension'));
			}

			const currentDate = new Date();
			const formattedDate = currentDate
				.toLocaleString('es', {
					year: '2-digit',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					hour12: false,
				})
				.replace(/[/:]/g, '-');

			const fileName = `exported_data_${formattedDate}.${extension}`;
			const fileFullPath = path.join(filePath, fileName);
			await fs.promises.writeFile(fileFullPath, fileContent);
			return { msg: messageSystem('success_export_file') };
		} else {
			throw new Error(messageSystem('error_data_extension'));
		}
	} catch (error) {
		let errorMessage = (error as Error).message ?? error;
		dialog.showErrorBox('Error', errorMessage);
		throw new Error(messageSystem('error_name_extension'));
	}
};
  
ipcMain.handle('saveFile', async (_, args = {}) => {
	const { data, filePath, extension, typeData } = args;
	if (!data) {
		throw new Error(messageSystem('error_extension'));
	}

	return await saveFile(data, filePath, extension, typeData);
});
  

const selectFileWithExtension = (extension: string, basePath?: string): Promise<string | undefined> => {
	return new Promise((resolve) => {
		if (!basePath) {
			basePath = path.join(app.getPath('desktop'), '');
		}
		const filters = [
			{
				name: `${extension.toUpperCase()} Files`,
				extensions: [extension],
			},
		];

		const win = BrowserWindow.getFocusedWindow();
		if (win) {
			dialog
				.showSaveDialog(win, {
					defaultPath: basePath,
					filters,
				})
				.then((result) => {
					if (!result.canceled && result.filePath) {
						const selectedExtension = path
							.extname(result.filePath)
							.slice(1);

						if (selectedExtension === extension) {
							resolve(result.filePath);
						} else {
							dialog.showErrorBox('Error',messageSystem('error_extension'));
							resolve(undefined);
						}
					} else {
						resolve(undefined);
					}
				})
				.catch((error) => {
					console.error(messageSystem('error_displaying_dialog'),error);
					resolve(undefined);
				});
		} else {
			console.error(messageSystem('error_focus_windows'));
			resolve(undefined);
		}
	});
};


ipcMain.handle('selectFileWithExtension', (_, args = {}) => {
    
    const { extension, basePath } = args;
    if (typeof extension !== 'string' || !/^[a-zA-Z0-9]+$/.test(extension)) {
        dialog.showErrorBox('Error', messageSystem('error_name_extension') );
        return Promise.resolve(undefined);
    }
    return selectFileWithExtension(extension, basePath);
});


const exportDBToCSV = async () => {
	const dbPath = `${app.getPath('userData')}/db/notes.db`;
	const db = Datastore.create({ filename: dbPath, autoload: true });
	try {
		const notes = await db.find({}); 

		if (notes.length > 0) {
            
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear().toString().slice(-2);
            const hours = currentDate.getHours().toString().padStart(2, '0');
            const minutes = currentDate.getMinutes().toString().padStart(2, '0');
            const fileName = `exported_data_${day}-${month}-${year}_${hours}-${minutes}.csv`;

			const defaultPath = path.join(
				app.getPath('desktop'),
				fileName
			);
			const filePath = dialog.showSaveDialogSync({
				defaultPath,
				filters: [{ name: 'CSV Files', extensions: ['csv'] }],
			});

			if (filePath) {
				
				const writableStream = fs.createWriteStream(filePath);
				const csvStream = csv.format({ headers: true });
				csvStream.pipe(writableStream);

				notes.forEach((note) => {
					csvStream.write(note);
				});

				csvStream.end();
				return {msg: messageSystem('export_csv_file')};
			}
		} else {
			return {msg: messageSystem('no_records')};
		}
	} catch (error) {
        dialog.showErrorBox('Error',messageSystem('error_export_csv_file'));
		throw new Error(messageSystem('error_export_csv_file'));
	}
};

ipcMain.handle('exportCsv', (_, args = {}) => {
	return exportDBToCSV();
});

const openFile = async (extensions: string[] = [], mode: 'once' | 'multi' = 'once'): Promise<string[]> => {
    try {
        const properties: any[] = mode === 'multi' ? ['openFile', 'multiSelections'] : ['openFile'];
        const name = mode === 'multi' ? 'Select multiple files' : 'Select file';
        
		const win = BrowserWindow.getFocusedWindow();
		if (win) {
			const result = await dialog.showOpenDialog({
				properties,
				filters: [
					{
						name,
						extensions,
					},
				],
			});

			if (!result.canceled && result.filePaths.length > 0) {
				const filePaths = result.filePaths.map((filePath: string) => path.resolve(filePath));
				
				return filePaths;
			}
		} 
        return [];
    } catch (error) {
        dialog.showErrorBox('Error',messageSystem('error_open_file'));
        return [];
    }
};

ipcMain.handle('openFile', (_, args = {}) => {
    const { extensions, mode} = args;
	return openFile(extensions, mode);
});

const importCSVToDB = async (csvPath: string) => {
    try {
        const results: any[] = [];
        
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv.parse({ headers: true }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    if (results.length > 0) {
                        resolve();
                    } else {
                        reject(new Error(messageSystem('failed_import_csv')));
                    }
                })
                .on('error', (error) => reject(error));
        });

        return results;
    } catch (error) {
        dialog.showErrorBox('Error', messageSystem('corrupt_csv'));
        throw error;
    }
};


ipcMain.handle('readCsv', (_, csvPath) => {
    return importCSVToDB(csvPath)
});
