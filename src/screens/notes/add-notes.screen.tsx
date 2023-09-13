import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTE_SCREEN_INFO } from '@/config/routes/paths';
import styles from './add-notes.screen.module.css';
import useActions from '@/hooks/useActions';
import ButtonAtoms from '@/components/atoms/button/button.atoms';
import FormAtoms from '@/components/atoms/form/form.atoms';
import TextareaFormAtoms from '@/components/atoms/textarea/textarea-form/textarea-form.atoms';

import getFormValues from '@/libs/utils/get-form-values.utils';
import { isCustomActionForm } from '@/libs/utils/custom-action-form.utils';
import { getScreenMessage } from '@/messages/screen.messages';
import IconCheck from '@/components/atoms/icons/icon-check.atoms';
import { DIALOG_MSG } from 'languages/front/dialog.language';

interface Note {
    id         : string;
    description: string;
    updatedAt  : Date;
    createdAt  : Date;
    msg?       : string;
}

const AddNoteScreen: React.FC = () => {
    const [note, setNote] = useState<string>('');
    const formRef = useRef<HTMLFormElement>(null);
    const callAction = useActions();
    const navigate = useNavigate();
	const [pathNoteScreen] = NOTE_SCREEN_INFO


    const handleActionNote = async (e: React.FormEvent<HTMLFormElement>) => {
        isCustomActionForm(e);
        try {
            
            const form = formRef.current as HTMLFormElement;
            let deleteEmpty = true;
            let data = getFormValues({ form, deleteEmpty });
            data.description = data.description.toString(); 
            const addNote: Note  = await callAction('addNote', data);
            
            if (addNote) {
                const args = {
                    message: addNote?.msg,
                    type: 'info',
                    buttons: [{ label: DIALOG_MSG['continue_editing'], id: 'no' },{ label: DIALOG_MSG['go_out'], id: 'yes' }],
                };
                const control = await callAction('alertMessage', args);
                if (control == 'no')
                {
                    await callAction('sendMessageToMainWindow',{'action':'update'});
                    navigate(pathNoteScreen + addNote.id)
                }
                if (control == 'yes')
                {
                    await callAction('sendMessageToMainWindow',{'action':'update'});
                    await callAction('closeChildWindow');
                }
                return;
            } 
            
            throw new Error(getScreenMessage('fail'))
        } catch (error) {
            let errorMessage = (error as Error).message ?? error;
            const argsAfter = {
                message: errorMessage,
                type: 'error',
                buttons: [{ label: DIALOG_MSG['ok'], id: 'ok' }],
            };
            await callAction('alertMessage', argsAfter);
        }
    };

    return (
        <div className={styles.container_bg}>
            <FormAtoms
                onSubmit={(e) => handleActionNote(e)}
                customStyle={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                    position: 'relative',
                }}
                customClass={styles.custom_form}
                ref={formRef}
            >
                <TextareaFormAtoms
                    name='description'
                    onEvent={(e) => setNote(e.currentTarget.value)}
                    customClass={styles.text_area}
                    placeholder='🖋️ Create new note'
                    autoFocus={true}
                />
                <div className={styles.container_btn}>
                    {note.trim() !== '' && (
                        <ButtonAtoms
                            type={`submit`}
                            btnStyle={{
                                btnType: 'secondary',
                                txtAlgn: 'center',
                                btnRadius: true,
                                btnShadow: true,
                                btnBorderStyle: 'dotted',
                                btnTxtTransform: false,
                                btnTxtWeight: 'bold',
                            }}
                            icon={true}
                            tabIndex={2} 
                            
                        >
                            <IconCheck/>
                        </ButtonAtoms>
                    )}
                </div>
            </FormAtoms>
        </div>
    );
};

export default AddNoteScreen;
