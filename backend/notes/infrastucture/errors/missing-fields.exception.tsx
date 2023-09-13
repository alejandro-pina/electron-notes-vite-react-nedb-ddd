import { INFRACTUCTURE_ERROR_MSG } from '../../../../languages/back/notes/infractucture-dialog-messages.language';
import InfrastructureFormatException from './infrastructure-format.exception';

/**
 * Generic application unauthorized exception
 */
export class MissingFieldsFormatException extends InfrastructureFormatException {
  constructor() {
      super(INFRACTUCTURE_ERROR_MSG['fields']);
  }
}
