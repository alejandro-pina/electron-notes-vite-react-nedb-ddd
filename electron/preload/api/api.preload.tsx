import { contextBridge, ipcRenderer } from 'electron';
import {TITLE_APP_ACTIONS_MSG} from './../../../languages/back/notes/title-actions.language'
interface AppAPI {
    [methodName: string]: (args: any) => Promise<any>;
}

interface SystemAPI {
    openNewWindow: (hash: string) => Promise<any>;
    themeMode: (message: any) => Promise<any>;
    sendMessageToMainWindow: (message: any) => Promise<any>;
    callMessageToMainWindow: (args: any) => Promise<any>;
    closedNewWindow: (args: any) => Promise<any>;
    closeChildWindow: () => Promise<any>;
    closeAllChildWindow: () => Promise<any>;
    alertMessage: (args: any) => Promise<any>;
    openFile: (args: any) => Promise<any>;
    saveFile: (args: any) => Promise<any>;
    selectFileWithExtension: (args: any) => Promise<any>;
    readCsv: (args: any) => Promise<any>;
    messageFromMainToRenderer: (callback: (data: any) => void) => void;
    on: (channel: string, callback: (data: any) => void) => void;
    once: (channel: string, callback: (data: any) => void) => void;
    receive: (channel: string, callback: (data: any) => void) => void;
    remove: (channel: string, callback: (data: any) => void) => void;
}

const invoking = async (action: string, args: any = '', title: string = '') => {
    try {
        return await ipcRenderer.invoke(action, args);
    } catch (error) {
        const errorMessage = (error as Error).message;
        const regex = /'([^']+)': (.+)/;
        const matches = errorMessage.match(regex);
        if (matches && matches.length >= 3) {
            const method = title ?? matches[1].toUpperCase();
            const message = matches[2];
            throw `-${method}- \n ${message}`;
        }
        throw error;
    }
};

const appActions = {
    addNote                  : TITLE_APP_ACTIONS_MSG['addNote'],
    updateNote               : TITLE_APP_ACTIONS_MSG['updateNote'],
    deleteNote               : TITLE_APP_ACTIONS_MSG['deleteNote'],
    countNotes               : TITLE_APP_ACTIONS_MSG['countNotes'],
    getAllNotes              : TITLE_APP_ACTIONS_MSG['getAllNotes'],
    getAllNotesToExport      : TITLE_APP_ACTIONS_MSG['getAllNotesToExport'],
    getAllNotesWithPagination: TITLE_APP_ACTIONS_MSG['getAllNotesWithPagination'],
    getNotesPerPage          : TITLE_APP_ACTIONS_MSG['getNotesPerPage'],
    getNoteById              : TITLE_APP_ACTIONS_MSG['getNoteById'],
    searchNoteByDescription  : TITLE_APP_ACTIONS_MSG['searchNoteByDescription'],
    searchNoteByDate         : TITLE_APP_ACTIONS_MSG['searchNoteByDate'],
    importNotes              : TITLE_APP_ACTIONS_MSG['importNotes'],
    exportNotes              : TITLE_APP_ACTIONS_MSG['exportNotes'],
    saveFile                 : TITLE_APP_ACTIONS_MSG['saveFile']
};

const appAPI: AppAPI = Object.entries(appActions).reduce(
    (api: AppAPI, [methodName, methodTitle]) => {
        api[methodName] = (args: any) =>
            invoking(methodName, args, methodTitle);
        return api;
    },
    {}
);

const systemAPI: SystemAPI = {
    openNewWindow: (hash) => invoking('openWin', hash),
    sendMessageToMainWindow: (message) =>
        invoking('sendMessageToMainWindow', message),
    themeMode: (message) =>
        invoking('themeMode', message),
    callMessageToMainWindow: (args) =>
        invoking('callMessageToMainWindow', args),
    closedNewWindow: (args) => invoking('childWindowClosed', args),
    closeAllChildWindow: () => invoking('closeAllChildWindow'),
    closeChildWindow: () => invoking('closeChildWindow'),
    alertMessage: (args) => invoking('alertMessage', args),
    selectFileWithExtension: (args) => invoking('selectFileWithExtension', args),
    openFile: (args) => invoking('openFile', args),
    saveFile: (args) => invoking('saveFile', args),
    readCsv: (args) => invoking('readCsv', args),
    messageFromMainToRenderer: (callback) => {
        ipcRenderer.on('messageFromMainToRenderer', (_, data) =>
            callback(data)
        );
    },
    on: (channel, callback) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
    once: (channel, callback) => {
        ipcRenderer.once(channel, (_, data) => callback(data));
    },
    receive: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    remove: (channel, callback) => {
        ipcRenderer.removeListener(channel, callback);
    },
};

process.once('loaded', () => {
    
    contextBridge.exposeInMainWorld('api', {
        ...appAPI,
        ...systemAPI,
    });
});