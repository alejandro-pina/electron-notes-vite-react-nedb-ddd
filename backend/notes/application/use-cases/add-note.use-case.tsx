import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { NoteModel } from '../../domain/model/note.model';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import CustomError from '../errors/custom-error.exception';
import { getAplicationMessage } from '../messages/application-messages.messages';
import { getAplicationErrorMessage } from '../errors/application-messages.error';

export class AddNoteUseCase {
    async execute(description: DescriptionVO) {
        try {
            const _id = UuidVO.create();
            const noteModel = new NoteModel(_id, description);
            const addNewNote = await NotesRepository.create(noteModel);
            if (!addNewNote) {
                throw new CustomError(getAplicationErrorMessage('updateNote'));
            }
            return {
                ...getAplicationMessage('createNote'),
                id: addNewNote.id,
                description: addNewNote.description,
                createdAt: addNewNote.createdAt,
                updatedAt: addNewNote.updatedAt,
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
