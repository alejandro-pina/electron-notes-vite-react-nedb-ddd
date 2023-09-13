import { CountNotesUseCase } from '../../application/use-cases/count-notes.use-case';

export class CountNotesController {
  async execute() {
    const useCase = new CountNotesUseCase(); 
    return await useCase.execute(); 
  }
}
