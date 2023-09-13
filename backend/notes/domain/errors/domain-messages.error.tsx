import { DOMAIN_ERROR_MSG } from '../../../../languages/back/notes/domain-dialog-messages.language';
export const VOMessages: { [key: string]: string } = DOMAIN_ERROR_MSG;
  
const getDefaultMessage = () => VOMessages['unknown'] || '';
  
export const getVOMessage = (vo: string): string => {
    const message = VOMessages[vo] || getDefaultMessage();
    return message;
};