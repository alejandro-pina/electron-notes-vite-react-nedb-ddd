import { AddNoteUseCase } from '../../application/use-cases/add-note.use-case';
import DescriptionVO from '../../domain/value-objects/description.vo';
import { getInfrastructureErrorMessage } from '../errors/infrastructure-messages.error';
import { MissingFieldsFormatException } from '../errors/missing-fields.exception';

interface AddNoteArgs {
	description: string
}

export class AddNoteController {
	async execute(args: AddNoteArgs) {
		const { description } = args;
		if (!description) throw new MissingFieldsFormatException();
		try{
            new DescriptionVO(description);
        }
        catch{
            throw getInfrastructureErrorMessage('failed')
        }
		const descriptionVO = new DescriptionVO(description);
		const useCase = new AddNoteUseCase();
		const addNewNote = await useCase.execute(descriptionVO);
		
		return {
			msg:addNewNote.msg,
			id: addNewNote.id.value,
			description: addNewNote.description.value,
			createdAt: addNewNote.createdAt,
			updatedAt: addNewNote.updatedAt,
		};
	}
}
