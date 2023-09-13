import { GetNoteByIdUseCase } from '../../application/use-cases/get-note-by-id.use-case';
import UuidVO from '../../domain/value-objects/uuid.vo';
import { getInfrastructureErrorMessage } from '../errors/infrastructure-messages.error';
import { MissingFieldsFormatException } from '../errors/missing-fields.exception';

interface GetNoteArgs {
    id: string;
}

export class GetNoteByIdController {
    async execute(args: GetNoteArgs) {
        const { id } = args;
        if (!id) {
            throw new MissingFieldsFormatException();
        }
		try{
            new UuidVO(id);
        }
        catch{
            throw getInfrastructureErrorMessage('failed')
        }
        const idVO = new UuidVO(id);
        const useCase = new GetNoteByIdUseCase(); 
        return await useCase.execute(idVO);
    }
}
