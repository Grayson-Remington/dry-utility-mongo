import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useConfirm } from 'material-ui-confirm';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
	GridActionsCellItem,
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

export default function ContactsGrid({
	contacts,
	setContacts,
	projectId,
}: any) {
	const { data: session, status } = useSession();
	const confirm = useConfirm();

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

		const editedRow = contacts.find((row: any) => row.id === id);
		if (editedRow!.isNew) {
			setContacts(contacts.filter((row: any) => row.id !== id));
		}
	};

	const processRowUpdate = async (newRow: GridRowModel) => {
		const updatedRow = { ...newRow };
		setContacts(
			contacts.map((row: any) =>
				row.id === newRow.id ? updatedRow : row
			)
		);
		console.log(updatedRow);

		try {
			const response = await fetch('/api/updateContact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					projectId: updatedRow.projectId,
					contactClass: updatedRow.contactClass,
					name: updatedRow.name,
					email: updatedRow.email,
					phoneNumber: updatedRow.phoneNumber,
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
			field: 'name',
			editable: true,
			headerName: 'Name',
			width: 130,
		},
		{
			field: 'phoneNumber',
			editable: true,
			headerName: 'Phone Number',
			width: 130,
		},
		{
			field: 'email',
			type: 'email',
			editable: true,
			headerName: 'Email',
			width: 130,
			flex: 3,
			minWidth: 200,
		},
		{
			field: 'contactClass',
			editable: true,
			type: 'singleSelect',
			valueOptions: ['Power', 'Gas', 'Telco', 'Misc'],
			headerName: 'Category',
			width: 100,
			cellClassName: (params) =>
				params.row.contactClass == 'Power'
					? 'bg-red-500'
					: params.row.contactClass == 'Gas'
					? 'bg-yellow-300'
					: params.row.contactClass == 'Telco'
					? 'bg-orange-500'
					: 'bg-purple-500',
			align: 'center',
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
						onClick={() => deleteContact(id)}
						color='inherit'
					/>,
				];
			},
		},
	];
	function getRowId(row: any) {
		return row.id;
	}
	const addContact = async (newItem: any) => {
		try {
			const response = await fetch('/api/addContact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					projectId: projectId,
					contactClass: newItem.contactClass,
					name: newItem.name,
					email: newItem.email,
					phoneNumber: newItem.phoneNumber,
					id: newItem.id,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				toast.success('Successfully added Contact');

				setContactFormData({
					name: '',
					email: '',
					phoneNumber: '',
					contactClass: 'Power',
				});
			} else {
				console.error('Failed to sign up');
				toast.error('Failed to add Contact');
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	const [contactFormData, setContactFormData] = useState({
		name: '',
		email: '',
		phoneNumber: '',
		contactClass: 'Power',
	});

	const handleContactInputChange = (e: any) => {
		const { name, value } = e.target;
		setContactFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleContactSubmit = (e: any) => {
		e.preventDefault();
		const newItem = {
			projectId: projectId,
			contactClass: contactFormData.contactClass,
			name: contactFormData.name,
			email: contactFormData.email,
			phoneNumber: contactFormData.phoneNumber,
			id: Math.floor(Math.random() * 1000000000),
		};
		addContact(newItem);
		setContacts((prevData: any) => [...prevData, newItem]);
	};
	const deleteContact = async (id: any) => {
		confirm({ description: 'This action is permanent!' })
			.then(async () => {
				try {
					const response = await fetch('/api/deleteContact', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: id }),
					});

					if (response.ok) {
						toast.success('Successfully deleted Contact');

						const data = await response.json();
						setContacts(
							contacts!.filter((obj: any) => obj.id !== id)
						);
					} else {
						console.error('Failed to sign up');
						toast.error('Failed to delete Contact');
					}
				} catch (error) {
					console.error('An error occurred:', error);
				}
			})
			.catch(() => {});
	};
	return (
		<>
			{status === 'authenticated' && contacts && (
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
							Add Contact
						</AccordionSummary>
						<AccordionDetails>
							<form onSubmit={handleContactSubmit}>
								<div className='hidden w-full sm:flex items-center gap-2 py-1 p-3'>
									<TextField
										type='text'
										name='name'
										value={contactFormData.name}
										onChange={handleContactInputChange}
										required
										className='border border-black rounded-md w-full'
										id='name'
										label='Name'
										variant='outlined'
									/>

									<TextField
										type='text'
										name='email'
										value={contactFormData.email}
										onChange={handleContactInputChange}
										required
										className='border border-black rounded-md w-full'
										id='email'
										label='Email'
										variant='outlined'
									/>
									<TextField
										type='text'
										name='phoneNumber'
										value={contactFormData.phoneNumber}
										onChange={handleContactInputChange}
										required
										className='border border-black rounded-md w-full'
										id='phoneNumber'
										label='Phone Number'
										variant='outlined'
									/>
									<FormControl
										fullWidth
										className='group max-w-48'
									>
										<InputLabel id='timelineItemClass-label'>
											Timline Item Class
										</InputLabel>
										<Select
											value={contactFormData.contactClass}
											onChange={handleContactInputChange}
											id='contactClass'
											name='contactClass'
											labelId='contactClass-label'
											label='Contact Class'
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
								<div className='sm:hidden w-full flex flex-col items-center gap-2 py-1 border-b border-black'>
									<TextField
										type='text'
										name='name'
										value={contactFormData.name}
										onChange={handleContactInputChange}
										required
										className='border border-black rounded-md w-full'
										id='name'
										label='Name'
										variant='outlined'
									/>

									<TextField
										type='text'
										name='email'
										value={contactFormData.email}
										onChange={handleContactInputChange}
										required
										className='border border-black rounded-md w-full'
										id='email'
										label='Email'
										variant='outlined'
									/>
									<div className='flex gap-2'>
										<TextField
											type='text'
											name='phoneNumber'
											value={contactFormData.phoneNumber}
											onChange={handleContactInputChange}
											required
											className='border border-black rounded-md w-full'
											id='phoneNumber'
											label='Phone Number'
											variant='outlined'
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
													contactFormData.contactClass
												}
												onChange={
													handleContactInputChange
												}
												id='contactClass'
												name='contactClass'
												labelId='contactClass-label'
												label='Contact Class'
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

					<div style={{ height: 400, width: '100%' }}>
						<DataGrid
							getRowId={getRowId}
							rows={contacts}
							columns={columns}
							editMode='row'
							rowModesModel={rowModesModel}
							onRowModesModelChange={handleRowModesModelChange}
							onRowEditStop={handleRowEditStop}
							processRowUpdate={processRowUpdate}
							slotProps={{
								toolbar: { setContacts, setRowModesModel },
							}}
							initialState={{
								pagination: {
									paginationModel: { page: 0, pageSize: 10 },
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
