import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import CustomError from '../errors/application-format.exception';

export class CountNotesUseCase {
    async execute() {
        try {
            const countNotes = await NotesRepository.getTotalNotes();
            if (!countNotes) {
                throw new CustomError(getAplicationErrorMessage('notFound'));
            }

            return countNotes;
        } catch (err) {
            if (err instanceof Error) {
                throw new CustomError(err.message);
            } else {
                throw new CustomError(getAplicationErrorMessage('default'));
            }
        }
    }
}
