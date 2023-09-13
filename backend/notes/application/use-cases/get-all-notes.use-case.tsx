import NotesRepository from "../../infrastucture/repositories/notes.repository";
import { getAplicationErrorMessage } from "../errors/application-messages.error";
import CustomError from "../errors/application-format.exception";
import DateTimeVO from "../../domain/value-objects/date.vo";

interface Note {
	id: string;
	description: string;
	createdAt: string | undefined;
	updatedAt: string | undefined;
}

export class GetAllNotesUseCase {
	async execute() {
		try {
			const getAllNotes = await NotesRepository.getAll();
			if (!getAllNotes) {
				throw new CustomError(getAplicationErrorMessage("notFound"));
			}

			const notesList: Note[] = getAllNotes.map((note) => ({
				id: note.id.value,
				description: note.description.value,
				createdAt: note.createdAt instanceof DateTimeVO ? note.createdAt.formatDateTime() : undefined,
				updatedAt: note.updatedAt instanceof DateTimeVO ? note.updatedAt.formatDateTime() : undefined,
			}));

			return notesList;
		} catch (err) {
			if (err instanceof Error) {
				throw new CustomError(err.message);
			} else {
				throw new CustomError(getAplicationErrorMessage("default"));
			}
		}
	}
}
