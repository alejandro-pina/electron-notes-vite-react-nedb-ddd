import { DomainFormatException } from "./domain-format.exception";
import { getVOMessage } from "./domain-messages.error";

class VOFormatException extends DomainFormatException {
	constructor(vo: string, customMessage: string = getVOMessage("default")) {
		super(`${getVOMessage(vo)} - ${customMessage}`);
	}
}

export default VOFormatException;
