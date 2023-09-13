import { GetAllNotesToExportUseCase } from '../../application/use-cases/get-all-notes-to-export.use-case';

export class GetAllNotesToExportController {
	async execute() {
		const useCase = new GetAllNotesToExportUseCase();
		const res = await useCase.execute();
		
		return res;
	}
}
