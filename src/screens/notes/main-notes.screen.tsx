import React, { useEffect, useState } from 'react';
import styles from './main-notes.screen.module.css';
import useActions from '@/hooks/useActions';
import {useNavigate } from 'react-router-dom';
import { ITEMS_PER_PAGE } from '../../../config/constants';
import { HOME_SCREEN_INFO, NOTE_SCREEN_INFO, NOTE_ID_SCREEN_INFO, ADD_NOTE_SCREEN_INFO, CONFIGURATION_SCREEN_INFO } from '@/config/routes/paths';
import ButtonAtoms from '@/components/atoms/button/button.atoms';
import Pagination from '@/components/pagination/pagination.component';
import IconPlus from '@/components/atoms/icons/icon-plus.atoms';
import MainTemplate from '@/templates/main/main.template';
import FooterTemplate from '@/templates/footer/footer.template';
import HeaderTemplate from '@/templates/header/header.template';
import IconSetting from '@/components/atoms/icons/icon-setting.atoms';
import { Loading } from '@/components/loading/loading.component';
import { DIALOG_MSG } from 'languages/front/dialog.language';
import IconRefresh from '@/components/atoms/icons/icon-refresh.atoms';

interface Note {
	id: string;
	description: string;
	updatedAt: string;
	createdAt: string;
}

interface Notes {
	currentPage: number;
	nextPage: number;
	prevPage: number;
	totalPage: number;
    totalItems: number;
	listItems: Note[];
}

const MainNotesScreen: React.FC = () => {
	const initDefaultNotes = {
		currentPage: 1,
		nextPage: 0,
		prevPage: 0,
		totalPage: 0,
		totalItems: 0,
		listItems: [],
	}
	const [notes, setNotes] = useState<Notes>(initDefaultNotes);
	const [initApp,setInitApp] = useState(false)
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [typeLoading, setTypeLoading] = useState<'loading' | 'loading_read' | 'loading_diagonal_square' | 'loading_lineal_squares' | 'loading_open_file' | 'loading_long_time' | 'loading_donwload' | 'loading_send' | 'loading_save' |undefined>('loading');

	const callAction = useActions();
	const navigate = useNavigate();
	
	const [pathHomeScreen, titleHomeScreen] = HOME_SCREEN_INFO
	const [pathAddNoteScreen, titleNoteScreen] = ADD_NOTE_SCREEN_INFO
	const [pathConfigurationScreen] = CONFIGURATION_SCREEN_INFO
	const [pathNoteScreen] = NOTE_SCREEN_INFO
	const [pathNoteIdScreen, titleNoteIdScreen] = NOTE_ID_SCREEN_INFO
	
	document.title = titleHomeScreen

	const refreshPage = () => {
		setTypeLoading('loading')
		setIsLoading(true)
		setTimeout(() => {
			window.location.reload();
		}, 500);
	};
	

	const getNotes = async (page: number = 1) => {
		try {
			const argsNotes = {
				page: page,
				limit: ITEMS_PER_PAGE,
			};
	
			const { currentPage, nextPage, prevPage, totalPage, totalItems, listItems } = await callAction('getAllNotesWithPagination', argsNotes);

			const data: Notes = {
				currentPage: currentPage,
				nextPage: nextPage,
				prevPage: prevPage,
				totalPage: totalPage,
                totalItems: totalItems,
				listItems: listItems,
			};
			setNotes(data);
            
		} catch (error) {
			let errorMessage = (error as Error).message ?? error;
			let typeMessage = 'error';
			if (page===1)
			{
				errorMessage = errorMessage.split('Error:')[1].trim();
				typeMessage = 'info';
			}
			
			const argsAfter = {
				message: errorMessage,
				type: typeMessage,
				buttons: [{ label: DIALOG_MSG['ok'], id: 'ok' }],
			};
			
			const control = await callAction('alertMessage', argsAfter);
			
			if (control === 'ok') { 
				setInitApp(true);
				setNotes(initDefaultNotes)
			}
		}
	};

	useEffect(() => {
		

		const receiveMessage = async (data: any) => {
			await getNotes(notes.currentPage);
		};

		const subscribeMessage = () => {
			callAction('messageFromMainToRenderer', receiveMessage);
		};

		const unsubscribeMessage = () => {
			callAction('remove', 'messageFromMainToRenderer', receiveMessage);
			callAction('closeAllChildWindow');
		};

		const isSubscribe = localStorage.getItem('isSubscribe');
		if (!isSubscribe) {
			subscribeMessage();
			localStorage.setItem('isSubscribe', 'true');
		}

		getNotes();

		return () => {
			unsubscribeMessage();
		};
	}, []);

	const handleNewWindows = async (path: string = '', id: string = '', title = 'Note') => {
		try {
			if (id) {
				const getNoteById = await callAction('getNoteById', { id: id });

				if (!getNoteById) {
					const argsAfter = {
						message: getNoteById,
						type: 'error',
						buttons: [{ label: DIALOG_MSG['ok'], id: 'ok' }],
					};
					await callAction('alertMessage', argsAfter);
					await callAction('closeChildWindow');
					return;
				}

				path = path + id;
			}

			const windowClosedPromise = await callAction('openNewWindow', {
				title: title,
				path: path,
				width: 600,
				height: 600,
				params: { msg: 'ok' },
			});

			const eventClose = await windowClosedPromise;
			if (eventClose) {
				await getNotes(notes.currentPage);
			}
		} catch (error) {
			let errorMessage = (error as Error).message ?? error;
			const argsAfter = {
				message: errorMessage,
				type: 'error',
				buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
			};
			await callAction('alertMessage', argsAfter);
		}
	};

	const handleAnotherPage = () => {
		navigate('/configuration');
	};

	const { currentPage, nextPage, prevPage, totalPage, totalItems, listItems } = notes;

	return (
		
		<MainTemplate>
			{isLoading && !initApp ? <Loading animationClass={typeLoading}/> : ''}
			{totalItems === 0 && !initApp ? <Loading animationClass='loading_read'/> : ''}
			<HeaderTemplate typeHeader='home'>	
				<div className={styles.notes_header}>
					<Pagination
						totalItems={totalItems}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(selectedPage) =>
							getNotes(selectedPage)
						}
					/>

				</div>
				<div className={styles.container_btn}>
					<ButtonAtoms
						btnStyle={{
							btnType: 'primary',
							btnBorderStyle: 'solid',
							txtAlgn: 'center',
							btnRadius: true,
							btnShadow: true,
							btnTxtTransform: false,
							btnTxtWeight: 'bold',
						}}
						icon={true}
						actionClick={{
							arg: {},
							action: () => refreshPage(),
						}}
						tabIndex={1}
					>
						<IconRefresh />
					</ButtonAtoms>
					<ButtonAtoms
						btnStyle={{
							btnType: 'primary',
							btnBorderStyle: 'solid',
							txtAlgn: 'center',
							btnRadius: true,
							btnShadow: true,
							btnTxtTransform: false,
							btnTxtWeight: 'bold',
						}}
						icon={true}
						actionClick={{
							arg: pathConfigurationScreen,
							action: () => handleAnotherPage(),
						}}
						tabIndex={1}
					>
						<IconSetting />
					</ButtonAtoms>
				</div>
			</HeaderTemplate>
			<div className={styles.list_card_section}>
				{listItems?.map((item) => {
					const { id, description, createdAt, updatedAt } = item;
					return (
						<button
							onClick={() =>
								handleNewWindows(pathNoteScreen, id,  titleNoteIdScreen + `🗒️ `+description)
							}
							className={styles.card}
							key={id}
						>
							<div className={styles.notes_content}>
								<p>{description}</p>
								<span className={styles.createdAt}>
									{createdAt}
								</span>
								<span className={styles.updatedAt}>
									{updatedAt}
								</span>
							</div>
						</button>
					);
				})}
			</div>
			<FooterTemplate>
				<ButtonAtoms
						btnStyle={{
							btnType: 'primary',
							btnBorderStyle: 'solid',
							txtAlgn: 'center',
							btnRadius: true,
							btnShadow: true,
							btnTxtTransform: false,
							btnTxtWeight: 'bold',
						}}
						icon={true}
						actionClick={{
							arg: pathAddNoteScreen,
							action: () => handleNewWindows(pathAddNoteScreen,'',titleNoteScreen),
						}}
					>
						<IconPlus />
				</ButtonAtoms>
			</FooterTemplate>
		</MainTemplate>
	);
};

export default MainNotesScreen;
