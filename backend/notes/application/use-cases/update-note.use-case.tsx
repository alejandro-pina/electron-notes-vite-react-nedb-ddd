import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { NoteModel } from '../../domain/model/note.model';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import CustomError from '../errors/custom-error.exception';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import { getAplicationMessage } from '../messages/application-messages.messages';

export class UpdateNoteUseCase {
    async execute(id: UuidVO, description: DescriptionVO) {
        try {
            const noteModel = new NoteModel(id, description);
            const updatedNote = await NotesRepository.update(noteModel);
            if (!updatedNote) {
                throw new CustomError(getAplicationErrorMessage('updateNote'));
            }
            return {
                ...getAplicationMessage('updateNote'),
                id: updatedNote.id.value,
                description: updatedNote.description.value,
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
