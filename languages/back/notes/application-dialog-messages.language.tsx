export const APPLICATION_INFO_MSG = {
    'unknown'    : '🟢 Unknown message.',
    'database'   : 'Failed to perform action on database.',
    'default'    : 'The action could not be performed for some unexpected reason.',
    'notFound'   : 'No note found or there was an error.',
    'updateNote' : 'Note successfully saved.',
    'deleteNote' : 'Note successfully removed.',
    'createNote' : 'Note successfully created.',
    'importNotes': '${variable} notes successfully imported.',
    'exportNotes': '${variable} notes successfully exported.',
}

export const APPLICATION_ERROR_MSG = {
	unknown         : '🔴 Unknown action.',
	init            : 'It seems that it is the first time you start the application, create your first note.',
	database        : 'Failed to perform action on database.',
	default         : 'The action could not be performed for some unexpected reason.',
	notFound        : 'No note found or there was an error.',
	updateNote      : 'The note could not be saved. It is possible that the note no longer exists or that an error has occurred with the database.',
	deleteNote      : 'The note could not be deleted. It is possible that the note no longer exists or that an error has occurred with the database.',
	importNotes     : 'Something has gone wrong. ${variable} notes have been imported.',
	createNoteImport: 'Failed to create note with id ${variable}, please review the data. ${variable} notes have been imported.',
	modelNoteImport : 'The note with ID ${variable} has corrupted data, please check. ${variable} imported notes',
}
