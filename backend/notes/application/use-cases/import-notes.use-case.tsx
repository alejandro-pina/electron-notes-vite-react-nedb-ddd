import NotesRepository from '../../infrastucture/repositories/notes.repository';
import { NoteModel } from '../../domain/model/note.model';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import DateTimeVO from '../../domain/value-objects/date.vo';
import CustomError from '../errors/custom-error.exception';
import { getAplicationMessage } from '../messages/application-messages.messages';
import { getAplicationErrorMessage } from '../errors/application-messages.error';


export class ImportNotesUseCase {
    async execute(notes: { id: UuidVO, description: DescriptionVO, createdAt: DateTimeVO, updatedAt: DateTimeVO }[], modeResult: 'bulk' | 'individual' = 'bulk') {

		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        let count = 0

        try {
            for (const note of notes) {
                const existingNote = await NotesRepository.findByDescription(note.description.value);
                if (existingNote) {
                    if (modeResult !== 'bulk') return count
                    continue;
                }


                try {
                    const noteModel = new NoteModel(note.id, note.description, note.createdAt.toDate(), note.updatedAt.toDate());
                    try {
                        const createNote = await NotesRepository.create(noteModel);
                        
                        if (!createNote) {
                            throw new CustomError(getAplicationErrorMessage('createNoteImport', [note.id.value,String(count)]));
                        }
                    } catch (err) {
                        if (err instanceof Error) {
                            throw new CustomError(err.message)
                        } else {
                            throw new CustomError(getAplicationErrorMessage('createNoteImport', [note.id.value,String(count)]));
                        }
                    }
                } catch (err) {
                    if (err instanceof Error) {
                        throw new CustomError(err.message)
                    } else {
                        throw new CustomError(getAplicationErrorMessage('modelNoteImport', [note.id.value,String(count)]));
                    }
                }
                count++
                if (modeResult !== 'bulk') return count
                
            }
            return {
                ...getAplicationMessage('importNotes',String(count))
            };
        } catch (err: any) {
            if (err instanceof Error) {
                throw new CustomError(err.message)
            } else {
                throw new CustomError(getAplicationErrorMessage('importNotes',String(count)));
            }
        }
        
    }
}
