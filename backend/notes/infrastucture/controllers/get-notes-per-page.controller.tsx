import { GetNotesPerPageUseCase } from "../../application/use-cases/get-notes-per-page.use-case";
import { MissingFieldsFormatException } from "../errors/missing-fields.exception";

interface GetNotePerPageArgs {
	page: number;
	itemsPerPage: number;
}

export class GetNotesPerPageController {
	async execute(args: GetNotePerPageArgs) {
		const { page, itemsPerPage } = args;
		
		if (!Number.isInteger(page) || !Number.isInteger(itemsPerPage)) {
			throw new MissingFieldsFormatException();
		}
		const useCase = new GetNotesPerPageUseCase();
		return await useCase.execute(page, itemsPerPage);
	}
}
