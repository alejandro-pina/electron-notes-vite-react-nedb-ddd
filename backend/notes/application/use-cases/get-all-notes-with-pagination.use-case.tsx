import { NoteModel } from '../../domain/model/note.model';
import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { getAplicationErrorMessage } from '../errors/application-messages.error';
import CustomError from '../errors/application-format.exception';

interface PaginationParams {
	page: number;
	limit: number;
}

interface NotesWithPagination {
	currentPage: number;
	nextPage: number | null;
	prevPage: number | null;
	totalPage: number;
    totalItems: number;
	listItems: NoteModel[];
}

export class GetAllNotesWithPaginationUseCase {
	async execute({page,limit}: PaginationParams): Promise<NotesWithPagination> {
		try {
            
			const getData = await NotesRepository.getNotesWithPagination(page, limit);
			
			if (!getData) {
				if (page === 1)
				{
					throw new CustomError(getAplicationErrorMessage('init'));
				}
				else
				{
					throw new CustomError(getAplicationErrorMessage('notFound'));
				}
			}
			
			const notesList: NoteModel[] = getData.listItems.map((note) => {
				const noteModel = new NoteModel(
					note.id,
					note.description,
					note.createdAt,
					note.updatedAt
				);
				
				return noteModel;
			});
    		return {
				currentPage: getData.currentPage,
				nextPage: getData.nextPage,
				prevPage: getData.prevPage,
				totalPage: getData.totalPage,
				listItems: notesList,
                totalItems: getData.totalItems
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
