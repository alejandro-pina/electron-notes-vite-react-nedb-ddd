import ApplicationFormatException from './application-format.exception';

export default class CustomError extends ApplicationFormatException {
	constructor(error: string, customMessage?: string) {
		super(`${error} ${customMessage ? '-' + customMessage : ''}`);
	}
}
