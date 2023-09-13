import { GetAllNotesUseCase } from '../../application/use-cases/get-all-notes.use-case';

export class GetAllNotesController {
	async execute() {
		const useCase = new GetAllNotesUseCase();
		const res = await useCase.execute();
		
		return res;
	}
}
