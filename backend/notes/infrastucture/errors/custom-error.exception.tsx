import InfrastructureFormatException from './infrastructure-format.exception';

export default class CustomErrorException extends InfrastructureFormatException {
  constructor(error: string) {
    super(error);
  }
}
