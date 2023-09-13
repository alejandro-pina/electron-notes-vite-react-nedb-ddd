import { DeleteNoteUseCase } from '../../application/use-cases/delete-note.use-case';
import UuidVO from '../../domain/value-objects/uuid.vo';
import { MissingFieldsFormatException } from '../errors/missing-fields.exception';

interface DeleteNoteArgs {
  id: string
}

export class DeleteNoteController {
  async execute(args: DeleteNoteArgs) {
    const { id } = args;
    if (!id) {
      throw new MissingFieldsFormatException();
    }
    const idNote = new UuidVO(id);
    const useCase = new DeleteNoteUseCase();
    return await useCase.execute(idNote); 
  }
}
