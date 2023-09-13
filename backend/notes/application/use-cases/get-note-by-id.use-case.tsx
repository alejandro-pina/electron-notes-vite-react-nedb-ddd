import NotesRepository from '../../infrastucture/repositories/notes.repository';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DateTimeVO from '../../domain/value-objects/date.vo';
import CustomError from '../errors/custom-error.exception';
import { getAplicationErrorMessage } from '../errors/application-messages.error';

export class GetNoteByIdUseCase {
    async execute(id: UuidVO) {
        try {
            const getNote = await NotesRepository.getById(id.value);
            if (!getNote) {
                throw new CustomError(getAplicationErrorMessage('notFound'));
            }
            return {
                id: getNote.id.value,
                description: getNote.description.value,
                createdAt: getNote.createdAt instanceof DateTimeVO ? getNote.createdAt.getEuropeanDateWithDayString() : undefined,
                updatedAt: getNote.updatedAt instanceof DateTimeVO ? getNote.updatedAt.getEuropeanDateWithTimeString() : undefined,
            };
        } catch (err) {
            if (err instanceof Error) {
                throw new CustomError(err.message);
            } else {
                throw new CustomError(getAplicationErrorMessage('default'));
            }
        }
    }
}
