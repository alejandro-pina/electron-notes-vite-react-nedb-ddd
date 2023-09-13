import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import CustomError from '../errors/application-format.exception';

interface Note {
    id: string;
    description: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
}

export class ExportNotesUseCase {
    async execute() {
        try {
            const getAllNotes = await NotesRepository.getAll();
            if (!getAllNotes) {
                throw new CustomError(getAplicationErrorMessage('notFound'));
            }
            const notesList: Note[] = getAllNotes.map((note) => ({
                id: note.id.value,
                description: note.description.value,
                createdAt: note.createdAt ? note.createdAt.toISOString() : undefined,
                updatedAt: note.updatedAt ? note.updatedAt.toISOString() : undefined,
            }));
            return notesList;
        } catch (err) {
            if (err instanceof Error) {
                throw new CustomError(err.message);
            } else {
                throw new CustomError(getAplicationErrorMessage('default'));
            }
        }
    }
}
