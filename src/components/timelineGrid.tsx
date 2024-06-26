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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function TimelineGrid({
	timelineItems,
	setTimelineItems,
	projectId,
}: any) {
	const { data: session, status } = useSession();
	const confirm = useConfirm();

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

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});

		const editedRow = timelineItems.find((row: any) => row.id === id);
		if (editedRow!.isNew) {
			setTimelineItems(timelineItems.filter((row: any) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow: GridRowModel) => {
		const updatedRow = { ...newRow };
		setTimelineItems(
			timelineItems.map((row: any) =>
				row.id === newRow.id ? updatedRow : row
			)
		);

		try {
			const response = await fetch('/api/updateTimelineItem', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					author: session?.user?.name,
					projectId: updatedRow.projectId,
					date: updatedRow.date.toString(),
					text: updatedRow.text,
					id: updatedRow.id,
					timelineItemClass: updatedRow.timelineItemClass,
				}),
			});

			if (response.ok) {
				const data = await response.json();
			} else {
			}
		} catch (error) {}
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};
	const columns: GridColDef[] = [
		{
			field: 'date',
			headerName: 'Date',
			type: 'date',
			editable: true,
			width: 130,
			valueGetter: (params) => {
				let date = new Date(params.row.date);

				// Adjust the time to UTC time zone
				date.setUTCHours(5);
				date.setUTCMinutes(0);
				date.setUTCSeconds(0);
				date.setUTCMilliseconds(0);

				// Format the date string
				let formattedDateStr = date.toISOString();

				return new Date(formattedDateStr);
			},
		},
		{
			field: 'text',
			editable: true,
			headerName: 'Information',
			width: 300,
			minWidth: 300,
			flex: 1,
		},
		{
			field: 'timelineItemClass',
			editable: true,
			type: 'singleSelect',
			valueOptions: ['Power', 'Gas', 'Telco', 'Misc'],
			headerName: 'Category',
			width: 100,
			cellClassName: (params) =>
				params.row.timelineItemClass == 'Power'
					? 'bg-red-500'
					: params.row.timelineItemClass == 'Gas'
					? 'bg-yellow-300'
					: params.row.timelineItemClass == 'Telco'
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
						onClick={() => deleteTimelineItem(id)}
						color='inherit'
					/>,
				];
			},
		},
	];
	function getRowId(row: any) {
		return row.id;
	}
	const addTimelineItem = async (newItem: any) => {
		try {
			const response = await fetch('/api/addTimelineItem', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					author: session?.user?.name,
					projectId: projectId,
					timelineItemClass: newItem.timelineItemClass,
					date: newItem.date,
					text: newItem.text,
					id: newItem.id,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				toast.success('Successfully added timeline item');

				setTimelineItemFormData({
					date: '',
					text: '',
					timelineItemClass: 'Power',
				});
			} else {
				toast.error('Failed to add timeline item');
			}
		} catch (error) {}
	};
	const deleteTimelineItem = async (id: any) => {
		confirm({ description: 'This action is permanent!' })
			.then(async () => {
				try {
					const response = await fetch('/api/deleteTimelineItem', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: id }),
					});

					if (response.ok) {
						const data = await response.json();
						toast.success('Successfully deleted timeline item');

						setTimelineItems(
							timelineItems!.filter((obj: any) => obj.id !== id)
						);
					} else {
						toast.error('Failed to delete timeline item');
					}
				} catch (error) {}
			})
			.catch(() => {
				/* ... */
			});
	};
	const [timelineItemFormData, setTimelineItemFormData] = useState({
		date: '',
		text: '',
		timelineItemClass: 'Power',
	});

	const handleTimelineItemInputChange = (e: any) => {
		const { name, value } = e.target;
		setTimelineItemFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleTimelineItemSubmit = (e: any) => {
		e.preventDefault();

		const newItem = {
			author: session?.user?.name,
			projectId: projectId,
			timelineItemClass: timelineItemFormData.timelineItemClass,
			date: timelineItemFormData.date,
			text: timelineItemFormData.text,
			id: Math.floor(Math.random() * 1000000000),
		};
		addTimelineItem(newItem);

		setTimelineItems((prevData: any) => [...prevData, newItem]);
	};
	const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
	const [rowSelectionModel, setRowSelectionModel] =
		useState<GridRowSelectionModel>([]);
	const handleSelectionChange = (newSelection: any) => {
		setSelectedRows(newSelection.selectionModel);
	};

	const handleDeleteRows = async () => {
		const filteredIds = timelineItems.filter(
			(task: any) => !selectedRows.includes(task.id)
		);
		confirm({ description: 'This action is permanent!' })
			.then(async () => {
				try {
					const response = await fetch(
						'/api/deleteManyTimelineItems',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ ids: selectedRows }),
						}
					);

					if (response.ok) {
						const data = await response.json();
						toast.success('Successfully added timeline item');

						setTimelineItems(filteredIds);
					} else {
					}
				} catch (error) {}
			})
			.catch(() => {});
	};
	return (
		<>
			{status === 'authenticated' && timelineItems && (
				<div className='max-w-4xl w-full bg-white rounded-b-lg p-1'>
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
							Add Timeline Item
						</AccordionSummary>
						<AccordionDetails>
							<form onSubmit={handleTimelineItemSubmit}>
								<div className='hidden sm:flex w-full p-3 gap-2 py-1'>
									<input
										type='date'
										name='date'
										value={timelineItemFormData.date}
										onChange={handleTimelineItemInputChange}
										required
										className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
									/>
									<TextField
										type='text'
										name='text'
										className='border border-black rounded-md w-full'
										required
										id='text'
										label='Timeline Item'
										variant='outlined'
										value={timelineItemFormData.text}
										onChange={handleTimelineItemInputChange}
									/>

									<FormControl
										fullWidth
										className='group max-w-48'
									>
										<InputLabel id='timelineItemClass-label'>
											Timline Item Class
										</InputLabel>
										<Select
											value={
												timelineItemFormData.timelineItemClass
											}
											onChange={
												handleTimelineItemInputChange
											}
											id='timelineItemClass'
											name='timelineItemClass'
											labelId='timelineItemClass-label'
											label='Timeline Item Class'
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
								<div className='sm:hidden w-full p-3 flex flex-col gap-2 py-1'>
									<TextField
										type='text'
										name='text'
										className='border border-black rounded-md w-full'
										required
										id='text'
										label='Timeline Item'
										variant='outlined'
										value={timelineItemFormData.text}
										onChange={handleTimelineItemInputChange}
									/>
									<div className='flex gap-2 justify-center'>
										<input
											type='date'
											name='date'
											value={timelineItemFormData.date}
											onChange={
												handleTimelineItemInputChange
											}
											required
											className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
										/>
										<FormControl
											fullWidth
											className='group max-w-48 min-w-32'
										>
											<InputLabel id='timelineItemClass-label'>
												Timline Item Class
											</InputLabel>
											<Select
												value={
													timelineItemFormData.timelineItemClass
												}
												onChange={
													handleTimelineItemInputChange
												}
												id='timelineItemClass'
												name='timelineItemClass'
												labelId='timelineItemClass-label'
												label='Timeline Item Class'
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
										className=' self-center w-full max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
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
							rows={timelineItems}
							columns={columns}
							editMode='row'
							checkboxSelection
							onRowSelectionModelChange={(
								newRowSelectionModel: GridRowSelectionModel
							) => {
								setRowSelectionModel(newRowSelectionModel);
								setSelectedRows(
									newRowSelectionModel as GridRowId[]
								);
							}}
							rowModesModel={rowModesModel}
							onRowModesModelChange={handleRowModesModelChange}
							onRowEditStop={handleRowEditStop}
							processRowUpdate={processRowUpdate}
							slotProps={{
								toolbar: { setTimelineItems, setRowModesModel },
							}}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 10 },
								},
								sorting: {
									sortModel: [
										{ field: 'date', sort: 'desc' },
									],
								},
							}}
							pageSizeOptions={[10, 20]}
						/>
					</div>
				</div>
			)}
		</>
	);
}
