import { ImportNotesUseCase } from '../../application/use-cases/import-notes.use-case';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import DateTimeVO from '../../domain/value-objects/date.vo';
import { MissingFieldsFormatException } from '../errors/missing-fields.exception';

interface ImportNote {
	id: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}
interface ExecuteParams {
	notes: ImportNote[];
	modeResult?: 'bulk' | 'individual';
}
export class ImportNotesController {

	async execute({notes, modeResult = 'bulk'}:ExecuteParams) {
		const useCase = new ImportNotesUseCase();
		const listNotesVO = [];
		
		for (let i = 0; i < notes.length; i++) {
			const { id, description, createdAt, updatedAt } = notes[i];

			if (!id || !description || !createdAt || !updatedAt) {
				throw new MissingFieldsFormatException();
			}

			listNotesVO.push({
				id         : new UuidVO(id),
				description: new DescriptionVO(description),
				createdAt  : new DateTimeVO(createdAt),
				updatedAt  : new DateTimeVO(updatedAt)
			});
		}
		return await useCase.execute(listNotesVO, modeResult);
	}
}
