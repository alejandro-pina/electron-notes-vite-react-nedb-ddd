import { SCREEN_MSG } from '../../languages/front/screen.language';
const getDefaultMessage = () => SCREEN_MSG['default'] || '';

export const getScreenMessage = (type_message: string,variables?: string[] | string) => {
	let message = SCREEN_MSG[type_message] || getDefaultMessage();

	if (variables) {
		if (typeof variables === 'string') {
			message = message.replace('${variable}', variables);
		} else if (Array.isArray(variables)) {
			for (let i = 0; i < variables.length; i++) {
				message = message.replace('${variable}', variables[i]);
			}
		}
	}
	return message
};

export const getScreenAsk = (action: string): string => {
	let message =  SCREEN_MSG['ask']
	
	if (action && action !== '') {
		message = message.replace('${action}', action);
	} 
	else {
		message = message.replace('${action}', '🤔');
	}
    return message;
};