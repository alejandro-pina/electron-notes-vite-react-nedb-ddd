abstract class ValueObject<T> {
	value: T;

	constructor(value: T) {
		this.assertIsValid(value);
		this.value = value;
	}

	abstract equals(valueObject: ValueObject<T>): boolean;

	abstract assertIsValid(value: T): void;

	protected assertIsString(value: any): value is string {
		return typeof value === "string";
	}

	protected assertIsNumber(value: any): value is number {
		return typeof value === "number";
	}

	protected assertIsValidUuid(value: string): boolean {
		const uuidRegex =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
		return uuidRegex.test(value);
	}

	protected assertIsValidEmail(value: string): boolean {
		const emailRegex = /\S+@\S+\.\S+/;
		return emailRegex.test(value);
	}

	protected assertIsValidNumberInRange(
		value: number,
		min: number,
		max: number
	): boolean {
		return value >= min && value <= max;
	}

	protected assertIsValidStringNotEmpty(value: string): boolean {
		return value.trim().length > 0;
	}

	protected assertIsValidString(value: string): boolean {
		return value.trim().length <= 1000;
	}
}

export default ValueObject;
