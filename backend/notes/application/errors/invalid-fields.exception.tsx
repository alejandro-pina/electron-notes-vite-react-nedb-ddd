import ApplicationFormatException from './application-format.exception';

export default class InvalidFormatException extends ApplicationFormatException {
	constructor(error: string) {
		super(error);
	}
}
