import NotesRepository from '../../infrastucture/repositories/notes.repository';
import CustomError from '../errors/application-format.exception';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import DateTimeVO from '../../domain/value-objects/date.vo';


interface Note {
    id: string;
    description: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
}

export class GetNotesPerPageUseCase {
    async execute(page: number, itemsPerPage: number) {
        try {
            const getNotesPerPage = await NotesRepository.getPerPage(
                page,
                itemsPerPage
            );
            if (!getNotesPerPage) {
                throw new CustomError(getAplicationErrorMessage('notFound'));
            }
            const notesList: Note[] = getNotesPerPage.map((note) => ({
                id: note.id.value,
                description: note.description.value,
                createdAt: note.createdAt instanceof DateTimeVO ? note.createdAt.formatDateTime() : undefined,
                updatedAt: note.updatedAt instanceof DateTimeVO ? note.updatedAt.formatDateTime() : undefined,
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
