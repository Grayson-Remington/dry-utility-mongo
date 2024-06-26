import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useConfirm } from 'material-ui-confirm';
import {
	Avatar,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
	GridRowSelectionModel,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
	AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion
		disableGutters
		elevation={0}
		square
		{...props}
	/>
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {},
	'& .MuiAccordionSummary-content': {
		flexGrow: 0,
		justifyContent: 'center',
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
export default function AllTasksGrid({ tasks, setTasks, projects }: any) {
	const { data: session, status } = useSession();
	const confirm = useConfirm();

	const deleteTask = async (id: any) => {
		confirm({ description: 'This action is permanent!' })
			.then(async () => {
				try {
					const response = await fetch('/api/deleteTask', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: id }),
					});

					if (response.ok) {
						const data = await response.json();
						setTasks(tasks!.filter((obj: any) => obj.id !== id));
						toast.success('Successfully deleted To do');
					} else {
						console.error('Failed to sign up');
						toast.error('Unable to delete To do');
					}
				} catch (error) {
					console.error('An error occurred:', error);
				}
			})
			.catch(() => {
				/* ... */
			});
	};
	function stringToColor(string: string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}

	function stringAvatar(name: string) {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	}

	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.Edit },
		});
	};

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View },
		});
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		setTasks(tasks.filter((row: any) => row.id !== id));
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = tasks.find((row: any) => row.id === id);
		if (editedRow!.isNew) {
			setTasks(tasks.filter((row: any) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow: GridRowModel) => {
		const updatedRow = { ...newRow };
		setTasks(
			tasks.map((row: any) => (row.id === newRow.id ? updatedRow : row))
		);
		console.log(updatedRow);
		console.log(
			projects.find(
				(project: any) => updatedRow.projectName === project.projectName
			)?.id,
			'id'
		);
		try {
			const response = await fetch('/api/updateTask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					author: session?.user?.name,
					projectName: updatedRow.projectName,
					projectId:
						projects.find(
							(project: any) =>
								updatedRow.projectName === project.projectName
						)?.id || '',
					taskClass: updatedRow.taskClass,
					date: updatedRow.date.toString(),
					text: updatedRow.text,
					id: updatedRow.id,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data, 'update reply');
			} else {
				console.error('Failed to sign up');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
		{
			field: 'date',
			type: 'date',
			editable: true,
			headerName: 'Date',
			width: 100,
			valueGetter: (params) => {
				let date = new Date(params.row.date);

				// Adjust the time to UTC time zone
				date.setUTCHours(5);
				date.setUTCMinutes(0);
				date.setUTCSeconds(0);
				date.setUTCMilliseconds(0);

				let formattedDateStr = date.toISOString();

				return new Date(formattedDateStr);
			},
		},

		{
			field: 'projectName',
			editable: true,
			type: 'singleSelect',
			valueOptions: projects.map((project: any) => project.projectName),

			headerName: 'Project Number',
			width: 130,
		},
		{
			field: 'text',
			editable: true,
			headerName: 'Tasks',
			width: 300,
			flex: 1,
			minWidth: 180,
		},
		{
			field: 'taskClass',
			editable: true,
			type: 'singleSelect',
			valueOptions: ['Power', 'Gas', 'Telco', 'Misc'],
			headerName: 'Category',
			width: 100,
			cellClassName: (params) =>
				params.row.taskClass == 'Power'
					? 'bg-red-500'
					: params.row.taskClass == 'Gas'
					? 'bg-yellow-300'
					: params.row.taskClass == 'Telco'
					? 'bg-orange-500'
					: 'bg-purple-500',
			align: 'center',
			headerAlign: 'center',
		},
		{
			field: 'author',
			headerName: 'Author',
			width: 60,
			renderCell: (params) => (
				<Avatar
					className=' text-sm h-8 w-8 items-center justify-center flex'
					{...stringAvatar(
						`${
							params.row.author
								? params.row.author
								: 'Filler Name'
						}`
					)}
				/>
			),
			align: 'right',
			headerAlign: 'center',
		},
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Actions',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				const isInEditMode =
					rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							key={1}
							icon={<SaveIcon />}
							label='Save'
							sx={{
								color: 'primary.main',
							}}
							onClick={handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							key={1}
							icon={<CancelIcon />}
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(id)}
							color='inherit'
						/>,
					];
				}

				return [
					<GridActionsCellItem
						key='1'
						icon={<EditIcon />}
						label='Edit'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
					/>,
					<GridActionsCellItem
						key='2'
						icon={<DeleteIcon />}
						label='Delete'
						onClick={() => deleteTask(id)}
						color='inherit'
					/>,
				];
			},
		},
	];
	function getRowId(row: any) {
		return row.id;
	}

	const addTask = async (newItem: any) => {
		try {
			const response = await fetch('/api/addTask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					author: session?.user?.name,
					projectId: newItem.projectId,
					projectName: newItem.projectName,
					taskClass: newItem.taskClass,
					date: newItem.date,
					text: newItem.text,
					id: newItem.id,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				toast.success('Successfully added Task');
				setTasks((prevData: any) => [...prevData, newItem]);

				setTaskFormData({
					date: '',
					text: '',
					taskClass: 'Power',
					projectId: '',
					projectName: '',
				});
			} else {
				console.error('Failed to sign up');
				toast.error('Unable to add Task');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	const [taskFormData, setTaskFormData] = useState({
		date: '',
		text: '',
		taskClass: 'Power',
		projectId: '',
		projectName: '',
	});

	const handleTaskInputChange = (e: any) => {
		const { name, value } = e.target;
		setTaskFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleProjectNameInputChange = (e: any) => {
		const selectedProjectString = e.target.value;
		const projectObject = JSON.parse(selectedProjectString);
		setTaskFormData((prevData) => ({
			...prevData,
			projectName: projectObject.projectName,
			projectId: projectObject.projectId,
		}));
	};
	const handleTaskSubmit = (e: any) => {
		e.preventDefault();

		const newItem = {
			author: session?.user?.name,

			projectId: taskFormData.projectId,
			projectName: taskFormData.projectName,
			taskClass: taskFormData.taskClass,
			date: taskFormData.date,
			text: taskFormData.text,
			id: Math.floor(Math.random() * 1000000000),
		};
		addTask(newItem);
	};
	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
	const [rowSelectionModel, setRowSelectionModel] =
		useState<GridRowSelectionModel>([]);

	const handleDeleteRows = async () => {
		const filteredIds = tasks.filter(
			(task: any) => !selectedRows.includes(task.id)
		);
		confirm({ description: 'This action is permanent!' })
			.then(async () => {
				try {
					const response = await fetch('/api/deleteManyTasks', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ ids: selectedRows }),
					});

					if (response.ok) {
						const data = await response.json();
						toast.success('Successfully deleted tasks');

						setTasks(filteredIds);
						console.log(data);
					} else {
						console.error('Failed to sign up');
						toast.error('Failed to delete tasks');
					}
				} catch (error) {
					console.error('An error occurred:', error);
				}
			})
			.catch(() => {});

		console.log('Selected rows to delete:', selectedRows);
	};
	return (
		<>
			{status === 'authenticated' && tasks && (
				<div className=' max-w-4xl w-full bg-white rounded-lg p-3'>
					<Accordion>
						<AccordionSummary
							sx={{
								root: {
									flexDirection: 'column',
								},
								content: {
									marginBottom: 0,
								},
								expandIcon: {
									marginRight: 0,
									paddingTop: 0,
								},
							}}
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1-content'
							id='panel1-header'
						>
							Add Task
						</AccordionSummary>
						<AccordionDetails>
							<form onSubmit={handleTaskSubmit}>
								<div className='hidden p-3 w-full md:flex gap-2 py-1 border-black flex-row'>
									<div className='w-full flex gap-2'>
										<input
											className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
											type='date'
											name='date'
											value={taskFormData.date}
											onChange={handleTaskInputChange}
											required
										/>

										<TextField
											type='text'
											name='text'
											value={taskFormData.text}
											onChange={handleTaskInputChange}
											className='border border-black rounded-md w-full'
											required
											id='text'
											label='Task'
											variant='outlined'
										/>
									</div>
									<div className='w-full flex gap-3'>
										<FormControl
											fullWidth
											className=''
										>
											<InputLabel id='projectNumber-label'>
												Project Number
											</InputLabel>
											<Select
												required
												labelId='projectNumber-label'
												value={JSON.stringify({
													projectId:
														taskFormData.projectId,
													projectName:
														taskFormData.projectName,
												})}
												onChange={
													handleProjectNameInputChange
												}
												id='projectId'
												name='projectId'
												label='Project Number'
											>
												{projects.map(
													(project: any) => (
														<MenuItem
															key={project.id}
															value={JSON.stringify(
																{
																	projectId:
																		project.id.toString(),
																	projectName:
																		project.projectName,
																}
															)}
														>
															{
																project.projectName
															}
														</MenuItem>
													)
												)}
											</Select>
										</FormControl>
										<FormControl
											fullWidth
											className='group w-44 min-w-32'
										>
											<InputLabel id='taskClass-label'>
												Task Class
											</InputLabel>
											<Select
												labelId='taskClass-label'
												value={taskFormData.taskClass}
												onChange={handleTaskInputChange}
												id='taskClass'
												name='taskClass'
												label='To do Class'
												className=''
											>
												<MenuItem
													className=''
													value='Power'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Power</div>
														<div className='rounded-full bg-red-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Gas'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Gas</div>
														<div className='rounded-full bg-yellow-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Telco'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Telco</div>
														<div className='rounded-full bg-orange-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Misc'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Misc</div>
														<div className='rounded-full bg-purple-500 h-4 w-4'></div>
													</div>
												</MenuItem>
											</Select>
										</FormControl>

										<button
											type='submit'
											className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
										>
											Add
										</button>
									</div>
								</div>
								<div className='md:hidden p-3 w-full flex gap-2 py-1 border-black flex-col md:flex-row'>
									<div className='w-full flex gap-2'>
										<input
											className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
											type='date'
											name='date'
											value={taskFormData.date}
											onChange={handleTaskInputChange}
											required
										/>

										<TextField
											type='text'
											name='text'
											value={taskFormData.text}
											onChange={handleTaskInputChange}
											className='border border-black rounded-md w-full'
											required
											id='text'
											label='Task'
											variant='outlined'
										/>
									</div>
									<div className=' w-full flex gap-3'>
										<FormControl
											fullWidth
											className=''
										>
											<InputLabel id='projectNumber-label'>
												Project Number
											</InputLabel>
											<Select
												required
												labelId='projectNumber-label'
												value={JSON.stringify({
													projectId:
														taskFormData.projectId,
													projectName:
														taskFormData.projectName,
												})}
												onChange={
													handleProjectNameInputChange
												}
												id='projectId'
												name='projectId'
												label='Project Number'
											>
												{projects.map(
													(project: any) => (
														<MenuItem
															key={project.id}
															value={JSON.stringify(
																{
																	projectId:
																		project.id.toString(),
																	projectName:
																		project.projectName,
																}
															)}
														>
															{
																project.projectName
															}
														</MenuItem>
													)
												)}
											</Select>
										</FormControl>
										<FormControl
											fullWidth
											className='group w-44 min-w-32'
										>
											<InputLabel id='taskClass-label'>
												Task Class
											</InputLabel>
											<Select
												labelId='taskClass-label'
												value={taskFormData.taskClass}
												onChange={handleTaskInputChange}
												id='taskClass'
												name='taskClass'
												label='To do Class'
												className=''
											>
												<MenuItem
													className=''
													value='Power'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Power</div>
														<div className='rounded-full bg-red-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Gas'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Gas</div>
														<div className='rounded-full bg-yellow-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Telco'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Telco</div>
														<div className='rounded-full bg-orange-500 h-4 w-4'></div>
													</div>
												</MenuItem>
												<MenuItem
													className=''
													value='Misc'
												>
													<div className='flex justify-between items-center w-full'>
														<div>Misc</div>
														<div className='rounded-full bg-purple-500 h-4 w-4'></div>
													</div>
												</MenuItem>
											</Select>
										</FormControl>
									</div>
									<button
										type='submit'
										className='w-full self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
									>
										Add
									</button>
								</div>
							</form>
						</AccordionDetails>
					</Accordion>
					{selectedRows.length >= 1 && (
						<Button onClick={handleDeleteRows}>
							Delete Selected Rows
						</Button>
					)}
					<div style={{ height: 450, width: '100%' }}>
						<DataGrid
							getRowId={getRowId}
							rows={tasks}
							columns={columns}
							checkboxSelection
							onRowSelectionModelChange={(
								newRowSelectionModel: GridRowSelectionModel
							) => {
								setRowSelectionModel(newRowSelectionModel);
								setSelectedRows(
									newRowSelectionModel as GridRowId[]
								);
							}}
							rowSelectionModel={rowSelectionModel}
							editMode='row'
							rowModesModel={rowModesModel}
							onRowModesModelChange={handleRowModesModelChange}
							onRowEditStop={handleRowEditStop}
							processRowUpdate={processRowUpdate}
							slotProps={{
								toolbar: { setTasks, setRowModesModel },
							}}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 30 },
								},
								sorting: {
									sortModel: [
										{ field: 'date', sort: 'desc' },
									],
								},
							}}
							pageSizeOptions={[5, 10]}
						/>
					</div>
				</div>
			)}
		</>
	);
}
