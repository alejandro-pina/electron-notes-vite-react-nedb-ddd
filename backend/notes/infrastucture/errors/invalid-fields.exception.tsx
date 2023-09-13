import InfrastructureFormatException from './infrastructure-format.exception';

export default class InvalidFormatException extends InfrastructureFormatException {
  constructor(error: string) {
    super(error);
  }
}
