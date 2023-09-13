import {APPLICATION_INFO_MSG} from '../../../../languages/back/notes/application-dialog-messages.language'
const aplicationMessages: { [key: string]: string } = APPLICATION_INFO_MSG;
  
const getDefaultMessage = () => aplicationMessages['unknown'] || '';

export const getAplicationMessage = (action: string,variables?: string[] | string) => {
	let message = aplicationMessages[action] || getDefaultMessage();

	if (variables) {
		if (typeof variables === 'string') {
			message = message.replace('${variable}', variables);
		} else if (Array.isArray(variables)) {
			for (let i = 0; i < variables.length; i++) {
				message = message.replace('${variable}', variables[i]);
			}
		}
	}

	return {
        'msg': message
    };
};