import VOFormatException from "../errors/vo-format.exception";
import ValueObject from "./value-object";

class DescriptionVO extends ValueObject<string> {
	constructor(value: string) {
		super(value);
	}

	equals(valueObject: DescriptionVO): boolean {
		return (
			valueObject instanceof DescriptionVO &&
			this.value === valueObject.value
		);
	}

	assertIsValid(value: string): void {
		if (typeof value !== "string" || value.split(" ").length > 1000) {
			throw new VOFormatException(DescriptionVO.name, value);
		}
	}
}

export default DescriptionVO;
