import Datastore from 'nedb-promises';
import fse from 'fs-extra';
import { app } from 'electron';
import UuidVO from '../../domain/value-objects/uuid.vo';
import DescriptionVO from '../../domain/value-objects/description.vo';
import { NoteModel } from '../../domain/model/note.model';
import DateTimeVO from '../../domain/value-objects/date.vo';

interface Database {
    find(query: any): Promise<any[]>;
    insert(document: any): Promise<any>;
    findOne(query: any): Promise<any>;
    update(query: any, document: any, options?: any): Promise<number>;
    remove(query: any): Promise<string>;
}

class NotesRepository {
    private db!: Datastore<{ _id: string; createdAt: Date; updatedAt: Date }>;
    private dbPath: string;

    constructor() {
        this.dbPath = `${app.getPath('userData')}/db/notes.db`;
        fse.ensureDir(`${app.getPath('userData')}/db`).then(() => {
            this.db = Datastore.create({
                filename: this.dbPath,
                timestampData: true, 
            });
        });
    }

    /**
     * Transforms a database note into a domain note
     * @param persistanceNote Database note
     * @returns Domain note
     */
    toDomain(persistanceNote: any): NoteModel {
        const { _id, description, createdAt, updatedAt } = persistanceNote; 
        return new NoteModel(
            new UuidVO(_id),
            new DescriptionVO(description),
            new DateTimeVO(createdAt), 
            new DateTimeVO(updatedAt)
        );
    }

    /**
     * Transforms a domain note into a database note
     * @param domainNote Domain note
     * @returns Database note
     */
    toPersistance(domainNote: NoteModel): any {
        const { id, description, createdAt, updatedAt } = domainNote;

        return {
            _id: id.value,
            description: description.value,
            createdAt: createdAt instanceof DateTimeVO ? createdAt.toISOString() : createdAt,
            updatedAt: updatedAt instanceof DateTimeVO ? updatedAt.toISOString() : updatedAt,
        };
    }

    async getTotalNotes(): Promise<number> {
        const totalNotes = await this.db.count({});
        return totalNotes;
    }

    async create(note: NoteModel): Promise<NoteModel> {
        const persistanceNote = this.toPersistance(note);
        const newNote = await this.db.insert(persistanceNote);
        return this.toDomain(newNote);
    }

    async getAll(): Promise<NoteModel[]> {
        const persistanceNotes = await this.db.find({}).sort({ updatedAt: -1 });
        const domainNotes = persistanceNotes.map((note) => this.toDomain(note));
        return domainNotes;
    }

    formatTime = (milliseconds: number): string => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
	
		return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
	};

    padZero = (value: number): string => {
        return value.toString().padStart(2, '0');
    };

    async getNotesWithPagination( page: number, limit: number): Promise<{
        currentPage: number;
        nextPage: number | null;
        prevPage: number | null;
        totalPage: number;
        totalItems: number;
        listItems: NoteModel[];
      } | null> {
        const startTime = performance.now();
        const totalNotes = await this.getTotalNotes();
        const endTime = performance.now(); 
        const totalPages = Math.ceil(totalNotes / limit);
      
        if (page < 1 || page > totalPages) {
            return null;
        }
      
        const skip = (page - 1) * limit;
      
        const persistanceNotes = await this.db
          .find({})
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit);
          
        const domainNotes = persistanceNotes.map((note) => this.toDomain(note));
      
        return {
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            totalPage: totalPages,
            totalItems: totalNotes,
            listItems: domainNotes,
        };
    }
      

    async getPerPage(page: number, perPage: number): Promise<NoteModel[]> {
        const skip = (page - 1) * perPage;
        const persistanceNotes = await this.db
            .find({})
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(perPage);

        const domainNotes = persistanceNotes.map((note) => this.toDomain(note));

        return domainNotes;
    }

    async getById(id: string): Promise<NoteModel | null> {
        const persistanceNote = await this.db.findOne({ _id: id });
        if (!persistanceNote) {
            return null;
        }
        return this.toDomain(persistanceNote);
    }

    async update(note: NoteModel): Promise<NoteModel | null> {
        const persistanceNote = this.toPersistance(note);
        const numReplaced = await this.db.update(
            { _id: persistanceNote._id },
            persistanceNote
        );
        if (numReplaced === 0) {
            return null;
        }
        return this.toDomain(persistanceNote);
    }

    async delete(id: string): Promise<string | null> {

        const numRemoved = await this.db.remove({ _id: id }, {});
        if (numRemoved === 0) {
            return null;
        }
        this.db.persistence.compactDatafile()
        return id;
    }

    async findByDescription(description: string): Promise<NoteModel | null> {
        const persistanceNote = await this.db.findOne({ description });
        if (!persistanceNote) {
          return null;
        }
        return this.toDomain(persistanceNote);
    }
}

export default new NotesRepository();
