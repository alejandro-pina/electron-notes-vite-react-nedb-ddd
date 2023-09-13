import { CountNotesController } from "./notes/infrastucture/controllers/count-notes.controller";
import { AddNoteController } from "./notes/infrastucture/controllers/add-note.controller";
import { GetAllNotesController } from "./notes/infrastucture/controllers/get-all-notes.controller";
import { GetAllNotesToExportController } from "./notes/infrastucture/controllers/get-all-notes-to-export.controller";
import { GetAllNotesWithPaginationController } from "./notes/infrastucture/controllers/get-all-notes-with-pagination.controller";
import { GetNotesPerPageController } from "./notes/infrastucture/controllers/get-notes-per-page.controller";
import { GetNoteByIdController } from "./notes/infrastucture/controllers/get-note-by-id.controller";
import { UpdateNoteController } from "./notes/infrastucture/controllers/update-note.controller";
import { DeleteNoteController } from "./notes/infrastucture/controllers/delete-note.controller";
import { SearchNoteByDescriptionController } from "./notes/infrastucture/controllers/search-note-by-description.controller";
import { SearchNoteByDateController } from "./notes/infrastucture/controllers/search-note-by-date.controller";
import { ImportNotesController } from "./notes/infrastucture/controllers/import-notes.controller";

const countNotesController                = new CountNotesController();
const addNoteController                   = new AddNoteController();
const importNotesController               = new ImportNotesController();
const getAllNotesController               = new GetAllNotesController();
const getAllNotesToExportController       = new GetAllNotesToExportController();
const getAllNotesWithPaginationController = new GetAllNotesWithPaginationController();
const getNotesPerPageController           = new GetNotesPerPageController();
const getNoteByIdController               = new GetNoteByIdController();
const updateNoteController                = new UpdateNoteController();
const deleteNoteController                = new DeleteNoteController();
const searchNoteByDescriptionController   = new SearchNoteByDescriptionController();
const searchNoteByDateController          = new SearchNoteByDateController();

export const container = {
	countNotesController,
	addNoteController,
	importNotesController,
	getAllNotesController,
	getAllNotesToExportController,
	getAllNotesWithPaginationController,
	getNotesPerPageController,
	getNoteByIdController,
	updateNoteController,
	deleteNoteController,
	searchNoteByDescriptionController,
	searchNoteByDateController,
};
