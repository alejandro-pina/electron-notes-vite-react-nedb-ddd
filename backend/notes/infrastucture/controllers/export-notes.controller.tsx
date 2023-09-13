import { ExportNotesUseCase } from 'backend/notes/application/use-cases/export-notes.use-case';

export class ExportAllNotesController {
	async execute() {
	  const useCase = new ExportNotesUseCase(); 
	  return await useCase.execute(); 
	}
}