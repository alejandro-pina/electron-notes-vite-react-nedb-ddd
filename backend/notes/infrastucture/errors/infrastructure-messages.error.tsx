import { INFRACTUCTURE_ERROR_MSG } from '../../../../languages/back/notes/infractucture-dialog-messages.language';
const infrastructureMessages: { [key: string]: string } = INFRACTUCTURE_ERROR_MSG;
  
const getDefaultMessage = () => infrastructureMessages['unknown'] || '';
  
export const getInfrastructureErrorMessage = (action: string): string => {
    const message = infrastructureMessages[action] || getDefaultMessage();
    return message;
};