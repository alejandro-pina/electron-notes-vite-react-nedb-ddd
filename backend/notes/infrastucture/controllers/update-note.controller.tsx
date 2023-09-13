import { UpdateNoteUseCase } from '../../application/use-cases/update-note.use-case';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import { MissingFieldsFormatException } from '../errors/missing-fields.exception';
import { getInfrastructureErrorMessage } from '../errors/infrastructure-messages.error';

interface UpdateNoteArgs {
    id: string;
    description: string;
}

export class UpdateNoteController {
    async execute(args: UpdateNoteArgs) {

        const { id, description } = args;

        if (!id) {
            throw new MissingFieldsFormatException();
        }
        if (!description) {
            throw new MissingFieldsFormatException();
        }

        try{
            new UuidVO(id);
            new DescriptionVO(description);
        }
        catch{
            throw getInfrastructureErrorMessage('failed')
        }
        const idVO = new UuidVO(id);
        const descriptionVO = new DescriptionVO(description);
        const useCase = new UpdateNoteUseCase();
        return await useCase.execute(idVO, descriptionVO);
    }
}
