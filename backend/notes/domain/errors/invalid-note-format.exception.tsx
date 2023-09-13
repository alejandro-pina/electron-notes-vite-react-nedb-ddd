import { DomainFormatException } from "./domain-format.exception";

class InvalidNoteFormatException extends DomainFormatException {
	constructor(message: string) {
		super(message);
	}
}

export default InvalidNoteFormatException;
