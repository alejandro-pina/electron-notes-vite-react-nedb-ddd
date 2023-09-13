export const SCREEN_MSG: Record<string, string> = {
    'unknown'          : '❓',
    'ask'              : 'Are you sure you want to ${action} the note?',
    'fail'             : 'Something strange has happened 🤔, try again',
    'default'          : '${variable}',
    'imported'         : 'Time: ${variable} \nImported: ${variable} notes.',
    'error_imported'   : ' ${variable} \nlast id read: ${variable}',
    'no_records'       : 'There are no records in the database.',
    'void_import'      : 'There are not valid records in the file.',
    'user_cancel'      : 'The operation has been canceled.',
    'fail_data'        : 'Something strange has happened 🤔, try again. \nLast item read id: ${variable}',
    'partial_fail_data': 'Failed to import ${variable} notes. The ids are ${variable}',
    'error_open_file'  : 'Error opening file.',
    'conf_export'      : 'Export data',
    'conf_import'      : 'Import data'
};