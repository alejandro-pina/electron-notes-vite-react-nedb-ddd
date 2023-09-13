import { INFRACTUCTURE_ERROR_MSG } from '../../../../languages/back/notes/infractucture-dialog-messages.language';
import InfrastructureFormatException from './infrastructure-format.exception';

export default class UnnecesaryFieldsFormatException extends InfrastructureFormatException {
  constructor() {
    super(INFRACTUCTURE_ERROR_MSG['unnecesary_fields']);
  }
}
