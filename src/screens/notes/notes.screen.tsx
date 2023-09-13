import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './notes.screen.module.css';
import useActions from '../../hooks/useActions';
import ButtonAtoms from '@/components/atoms/button/button.atoms';
import FormAtoms from '@/components/atoms/form/form.atoms';
import TextareaFormAtoms from '@/components/atoms/textarea/textarea-form/textarea-form.atoms';

import getFormValues from '../../libs/utils/get-form-values.utils';
import { isCustomActionForm } from '@/libs/utils/custom-action-form.utils';
import InputFormAtoms from '@/components/atoms/inputs/input-form/input-form.atoms';
import { getScreenAsk } from '@/messages/screen.messages';
import IconTrash from '@/components/atoms/icons/icon-trash.atoms';
import IconCheck from '@/components/atoms/icons/icon-check.atoms';
import {DIALOG_MSG} from '../../../languages/front/dialog.language';
import {TEXT_FRONT} from '../../../languages/front/text.language';

interface Note {
    id: string;
    description: string;
    updatedAt: string;
    createdAt: string;
}

const NoteScreen: React.FC = () => {
    const [note, setNote] = useState<Note | undefined>();
    const [content, setContent] = useState<string>('');
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<HTMLFormElement>(null);
    const callAction = useActions();

    const fetchNote = async () => {
        const argsGetIdById = {
            id: id,
        };
        const getNote = await callAction('getNoteById', argsGetIdById);
        if (getNote) {
            setNote(getNote);
        } else {
            setNote(undefined);
        }
    };

    useEffect(() => {
        fetchNote();
    }, []);

    const handleActionNote = async ( e: React.FormEvent<HTMLFormElement>, action: string) => {
        isCustomActionForm(e);
        try {
            const form = formRef.current as HTMLFormElement;
            let deleteEmpty = true;
            let data = getFormValues({ form, deleteEmpty });
            data.description = data.description.toString(); 

            if (action == 'save') {
                const updateNote = await callAction('updateNote', data);

                if (updateNote) {
                    const args = {
                        message: updateNote?.msg,
                        type: 'info',
                    };
                    await callAction('alertMessage', args);
                    await callAction('sendMessageToMainWindow',{'action':'update'});
                }
            } else if (action == 'delete') {
                const argsAfter = {
                    message:getScreenAsk('delete'),
                    type: 'warning',
                    buttons: [
                        { label: DIALOG_MSG['yes'], id: 'yes' },
                        { label: DIALOG_MSG['no'], id: 'no' },
                    ],
                };
                const checkSelect = await callAction('alertMessage', argsAfter);
                if (checkSelect === 'yes') {
                    const { id } = data;
                    const argsDelete = {
                        id: id,
                    };
                    
                    const deleteNote = await callAction(
                        'deleteNote',
                        argsDelete
                    );
                    if (deleteNote) {
                        await callAction('sendMessageToMainWindow',{'action':'delete'});
                        const args = {
                            message: deleteNote?.msg,
                            type: 'info',
                            actionAfter: 'closeCurrentWindow',
                            buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
                        };
                        await callAction('alertMessage', args);
                    } 
                }
            }
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
            {note && (
                <>
                    <FormAtoms
                        onSubmit={(e) => {
                            handleActionNote(e, 'save');
                        }}
                        customStyle={{
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            padding: 0,
                            position: 'relative',
                        }}
                        customClass={styles.custom_form}
                        ref={formRef}
                    >
                        <InputFormAtoms
                            type={`hidden`}
                            name='id'
                            valDefault={note.id}
                        />
                        <TextareaFormAtoms
                            valDefault={note.description}
                            name='description'
                            onEvent={(e) => setContent(e.currentTarget.value)}
                            customClass={styles.text_area}
                            placeholder={TEXT_FRONT['edit_note']}
                            autoFocus={true}
                        />
                        <div className={styles.container_btn}>
                            {content.trim() !== '' && (
                                <ButtonAtoms
                                    type={`submit`}
                                    btnStyle={{
                                        btnType: 'secondary',
                                        txtAlgn: 'center',
                                        btnBorderStyle: 'solid',
                                        btnRadius: true,
                                        btnShadow: true,
                                        btnTxtTransform: false,
                                        btnTxtWeight: 'bold',
                                    }}
                                    icon={true}
                                    tabIndex={1}
                                >
                                    <IconCheck/>
                                </ButtonAtoms>
                            )}
                            <ButtonAtoms
                                btnStyle={{
                                    btnType: 'danger',
                                    txtAlgn: 'center',
                                    btnRadius: true,
                                    btnShadow: true,
                                    btnBorderStyle: 'dotted',
                                    btnTxtTransform: false,
                                    btnTxtWeight: 'bold',
                                }}
                                icon={true}
                                tabIndex={2}
                                actionClick={{
                                    arg: 'delete',
                                    action: (e) =>
                                        handleActionNote(e, 'delete'),
                                }}
                            >
                                <IconTrash/>
                            </ButtonAtoms>
                        </div>
                    </FormAtoms>
                    <p className={styles.date_created}>
                        <strong>
                            {note.createdAt}
                        </strong>
                    </p>
                    <p className={styles.date_updated}>
                        <strong>
                            {note.updatedAt}
                        </strong>
                    </p>
                </>
            )}
        </div>
    );
};

export default NoteScreen;
