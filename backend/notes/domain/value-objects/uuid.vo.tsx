import { v4 as uuidv4, validate } from "uuid";
import VOFormatException from "../errors/vo-format.exception";
import ValueObject from "./value-object";

class UuidVO extends ValueObject<string> {
	equals(valueObject: UuidVO): boolean {
		return (
			valueObject instanceof UuidVO && this.value === valueObject.value
		);
	}

	assertIsValid(value: string): void {
		if (!validate(value)) {
			throw new VOFormatException(UuidVO.name, value);
		}
	}

	static create(): UuidVO {
		const uuid = uuidv4();

		return new UuidVO(uuid);
	}

	static validate(value: string): boolean {
		return validate(value);
	}
}

export default UuidVO;
