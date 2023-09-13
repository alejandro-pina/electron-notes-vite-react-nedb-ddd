import { APPLICATION_ERROR_MSG } from "../../../../languages/back/notes/application-dialog-messages.language";
const aplicationErrorMessages: { [key: string]: string } = APPLICATION_ERROR_MSG;

const getDefaultMessage = () => aplicationErrorMessages['unknown'] || '';

export const getAplicationErrorMessage = (action: string,variables?: string[] | string) => {
	let message = aplicationErrorMessages[action] || getDefaultMessage();

	if (variables) {
		if (typeof variables === 'string') {
			message = message.replace('${variable}', variables);
		} else if (Array.isArray(variables)) {
			for (let i = 0; i < variables.length; i++) {
				message = message.replace('${variable}', variables[i]);
			}
		}
	}

	return message;
};
