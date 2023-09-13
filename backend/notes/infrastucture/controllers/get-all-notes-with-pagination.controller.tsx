import DateTimeVO from '../../domain/value-objects/date.vo';
import { GetAllNotesWithPaginationUseCase } from '../../application/use-cases/get-all-notes-with-pagination.use-case';

export class GetAllNotesWithPaginationController {
    async execute({ page, limit }: { page: number; limit: number }) {
        const useCase = new GetAllNotesWithPaginationUseCase();
        const notes = await useCase.execute({ page, limit });
        
        const listNotes = notes.listItems
            .map((note) => ({
                id: note.id.value,
                description: note.description.value,
                createdAt: note.createdAt instanceof DateTimeVO ? note.createdAt.getEuropeanDateWithDayString() : undefined,
                updatedAt: note.updatedAt instanceof DateTimeVO ? note.updatedAt.getEuropeanDateWithTimeString() : undefined,
        }));
        
        const dateNotes = {
            currentPage: notes.currentPage,
            nextPage: notes.nextPage,
            prevPage: notes.prevPage,
            totalPage: notes.totalPage,
            totalItems: notes.totalItems,
            listItems: listNotes,
        }
        return dateNotes;
    }
}
