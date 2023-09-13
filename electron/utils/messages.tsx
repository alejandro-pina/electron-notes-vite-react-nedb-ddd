import {SYSTEM_MSG} from '../../languages/back/notes/system-messages.language'

interface SystemMessage {
    [key: string]: string;
}

export const messageSystem = (message: string): string => {
    const systemMessages: SystemMessage = SYSTEM_MSG;
    return systemMessages[message] || systemMessages['error_system'];
};