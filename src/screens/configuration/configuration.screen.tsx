import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainTemplate from '@/templates/main/main.template';
import styles from './configuration.screen.module.css';
import IconSetting from '@/components/atoms/icons/icon-setting.atoms';
import ButtonAtoms from '@/components/atoms/button/button.atoms';
import { HOME_SCREEN_INFO } from '@/config/routes/paths';
import IconArrowLeft from '@/components/atoms/icons/icon-arrow-left.atoms';
import HeaderTemplate from '@/templates/header/header.template';
import HeaderInfoTemplate from '@/templates/header/info/header-info.template';
import IconImport from '@/components/atoms/icons/icon-import.atoms';
import IconExport from '@/components/atoms/icons/icon-export.atoms';
import useActions from '@/hooks/useActions';
import { Loading } from '@/components/loading/loading.component';
import { ProgressBar } from '@/components/progressbar/progressbar.component';
import { getScreenMessage } from '@/messages/screen.messages';
import { DIALOG_MSG } from 'languages/front/dialog.language';
import { SCREEN_MSG } from 'languages/front/screen.language';

interface ConfigurationScreenProps {
	title: string;
}

const ConfigurationScreen: React.FC<ConfigurationScreenProps> = ({ title }) => {
	const callAction = useActions();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [typeLoading, setTypeLoading] = useState<'loading' | 'loading_read' | 'loading_diagonal_square' | 'loading_lineal_squares' | 'loading_open_file' | 'loading_long_time' | 'loading_donwload' | 'loading_send' | 'loading_save' |undefined>('loading');
	const [isProgessbar, setIsProgessbar] = useState<Boolean>(false);
	const [countNotesResult, setCountNotesResult] = useState<number>(0);
	const [countTotalNotes, setCountTotalNotes] = useState<number>(0);
	const [operationTime, setOperationTime] = useState<string>('');
	const isCancelledRef = useRef(false); 
	const fileInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const [pathHomeScreen] = HOME_SCREEN_INFO
	document.title = title
	
	const handleMainScreen = (goTo: string) => {
		navigate(goTo);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		setSelectedFile(file);
	};

	const resetOperation = (totalNotes:number) => {
		setIsLoading(false);
		setTypeLoading('loading');
		setIsProgessbar(false);
		setCountNotesResult(0)
		setCountTotalNotes(totalNotes)
		setOperationTime('')
		isCancelledRef.current = false;
	};

	const handleCancel = async (arg: boolean) => {
		setIsLoading(false);
		setTypeLoading('loading');
		setIsProgessbar(false);
		const argsAfter = {
			message: getScreenMessage('user_cancel'),
			type: 'error',
			buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
		};
		await callAction('alertMessage', argsAfter);
		isCancelledRef.current = arg;
	};

	const formatTime = (milliseconds: number): string => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
	};

	const padZero = (value: number): string => {
		return value.toString().padStart(2, '0');
	};

	const exportData = async () => {
		setTypeLoading('loading_open_file');
		setIsLoading(true);
		try {
			const args = {
				extension: 'csv',
			};
			const getPathFile = await callAction('selectFileWithExtension',args);

			if (!getPathFile) {
				setIsLoading(false);
				setTypeLoading('loading');
				return;
			}

			const getAllNotes = await callAction('getAllNotesToExport');
			
			setTypeLoading('loading_read');
			if (!getAllNotes || getAllNotes.length == 0) {
				setIsLoading(false);
				setTypeLoading('loading');
				const argsAfter = {
					message: getAllNotes.msg || getScreenMessage('void_import'),
					type: 'error',
					buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
				};
				await callAction('alertMessage', argsAfter);
			}
			
			if (!Array.isArray(getAllNotes) || getAllNotes.length === 0) {
				setIsLoading(false);
				setTypeLoading('loading');
				const argsAfter = {
					message: getAllNotes?.msg || getScreenMessage('no_records'),
					type: 'error',
					buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
				};
				await callAction('alertMessage', argsAfter);
			}
			const createFile = {
				data: getAllNotes,
				extension: 'csv',
				filePath: getPathFile,
				typeData: 'data',
			};
			setTypeLoading('loading_save');
			const saveFile = await callAction('saveFile', createFile);
			if (saveFile) {
				const message = saveFile.msg
					? saveFile?.msg
					: getScreenMessage('fail');
				const typeDialog = saveFile.msg
					? 'info'
					: 'error';
				const argsAfter = {
					message: message,
					type: typeDialog,
					buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
				};
				await callAction('alertMessage', argsAfter);
				setIsLoading(false);
				setTypeLoading('loading');
			}
		} catch (error) {
			setIsLoading(false);
			setTypeLoading('loading');
			let errorMessage = (error as Error).message ?? error;
			const argsAfter = {
				message: errorMessage || getScreenMessage('user_cancel'),
				type: 'error',
				buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
			};
			await callAction('alertMessage', argsAfter);
		}
	};

	const handleImport = async () => {
		setTypeLoading('loading_open_file');
		
		try {
			const typeFile = {
				extensions: ['csv'],
				mode: 'once',
			};
			setIsLoading(true);
			const getPathFile = await callAction('openFile', typeFile);
		
			if (!getPathFile || getPathFile.length === 0) {
				setIsLoading(false);
				setTypeLoading('loading');
				return;
			}

			if (getPathFile.length !== 1) { throw new Error(getScreenMessage('error_open_file')); }

			const csvPathFile = getPathFile[0];
			if (csvPathFile) {
				const getData = await callAction('readCsv', csvPathFile);
				const totalNotes = getData.length
				setIsLoading(false);
				setTypeLoading('loading');
				if (getData) {
					const getLanguage = getData.language != '' ? getData.language : ''
					setIsProgessbar(true);
					try {
						setCountTotalNotes(totalNotes);
						setIsProgessbar(true);
						try {
							let listError : Array<String> = [];
							let timeOperation = ''
							let countResult = 0;
							let isCancelled = false;
							const importData = async () => {
								let lastId = ''
								const startTime = performance.now();
								
								for (const item of getData) {
									if (isCancelledRef.current) {
										isCancelled = true;
										break;
									}
									let importNotesResults = ''
									try{
										const { id } = item;
										lastId  = id;
										importNotesResults = await callAction('importNotes', {
											notes: [item],
											modeResult: 'individual',
											language: getLanguage
										});
										if (!importNotesResults)
										{
											listError.push(id)
										}
									}
									catch{
										setIsLoading(false);
										setTypeLoading('loading');
										setIsProgessbar(false);
										isCancelled = true;
										const argsAfter = {
											message: getScreenMessage('fail_data',lastId),
											type: 'error',
											buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
										};
										await callAction('alertMessage', argsAfter);
										return
									}
									countResult++
									setCountNotesResult(countResult);
								
									const endTime = performance.now();
									const elapsed = endTime - startTime;
									const formattedTime = formatTime(elapsed);
									timeOperation = formattedTime
									setOperationTime(formattedTime);
								}
								if (listError.length > 0)
								{
									const argsAfter = {
										message: getScreenMessage('partial_fail_data',[String(listError.length), listError.toString()]),
										type: 'error',
										buttons: [{ label: DIALOG_MSG['ok'], id: 'ok' }],
									};
									const resp = await callAction('alertMessage', argsAfter);
									if (resp === 'ok')
									{
										resetOperation(totalNotes)			
									}
								}
							};
							await importData();
							const failedImport = listError.length
							const totalNotesSuccess = isCancelled ? countResult - failedImport : totalNotes - failedImport
							const argsAfter = {
								message: getScreenMessage('imported',[String(timeOperation), String(totalNotesSuccess)]),
								type: 'info',
								buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
							};
							const resp = await callAction('alertMessage', argsAfter);
							resetOperation(totalNotes)
							return
						} catch (error) {
						
							setIsLoading(false);
							setTypeLoading('loading');
							setIsProgessbar(false);
							let errorMessage = (error as Error).message ?? error;
							
							if (
								!errorMessage.includes(
									'User canceled the operation.'
								)
							) {
								const argsAfter = {
									message: errorMessage || getScreenMessage('user_cancel'),
									type: 'error',
									buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
								};
								await callAction('alertMessage', argsAfter);
							}
						}
					} catch (error) {
						console.error(error);
						setIsProgessbar(false);
						setIsLoading(false);
						setTypeLoading('loading');
					}
				}
			}
		} catch (error) {
			setIsLoading(false);
			setTypeLoading('loading');
			setIsProgessbar(false);
			let errorMessage = (error as Error).message ?? error;

			const argsAfter = {
				message: errorMessage || getScreenMessage('user_cancel'),
				type: 'error',
				buttons: [{ label: DIALOG_MSG['ok'], id: '' }],
			};
			await callAction('alertMessage', argsAfter);

		}
	};

	return (
		<MainTemplate>
			{isLoading && <Loading animationClass={typeLoading} />}
			{isProgessbar && (
				<ProgressBar
					currentCount={countNotesResult}
					totalCount={countTotalNotes}
					showTime={operationTime}
					setCancel={handleCancel}
				/>
			)}
			<HeaderTemplate>
				<HeaderInfoTemplate>
					<IconSetting />
					<h1>Configuration</h1>
				</HeaderInfoTemplate>
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
						arg: pathHomeScreen,
						action: () => handleMainScreen(pathHomeScreen),
					}}
				>
					<IconArrowLeft />
				</ButtonAtoms>
			</HeaderTemplate>
			<main>
				<div className={`${styles.card} ${styles.card_4}`}>
					<h2 className={styles.card__title}>{`${SCREEN_MSG['conf_export']}`}</h2>

					<div>
						<ButtonAtoms
							actionClick={{
								arg: { directory: '', nameFile: '' },
								action: exportData,
							}}
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
						>
							<IconExport />
						</ButtonAtoms>
						<input
							type='file'
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
					</div>
				</div>
				<div className={`${styles.card} ${styles.card_4}`}>
					<h2 className={styles.card__title}>{`${SCREEN_MSG['conf_import']}`}</h2>

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
							action: () => handleImport(),
						}}
					>
						<IconImport />
					</ButtonAtoms>
				</div>
			</main>
			<footer className={styles.footer_copyright}>
				Alejandro Piña 2023
			</footer>
		</MainTemplate>
	);
};

export default ConfigurationScreen;
