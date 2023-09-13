import NotesRepository from '../../infrastucture/repositories/notes.repository';
import UuidVO from '../../domain/value-objects/uuid.vo';
import CustomError from '../errors/custom-error.exception';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import { getAplicationMessage } from '../messages/application-messages.messages';

export class DeleteNoteUseCase {
    async execute(id: UuidVO) {
        try {
            const deleteNote = await NotesRepository.delete(id.value);
            if (!deleteNote) {
                throw new CustomError(getAplicationErrorMessage('deleteNote'));
            }
            return getAplicationMessage('deleteNote');
        } catch (err) {
            if (err instanceof Error) {
                throw new CustomError(err.message);
            } else {
                throw new CustomError(getAplicationErrorMessage('default'));
            }
        }
    }
}
