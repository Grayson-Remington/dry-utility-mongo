import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useConfirm } from 'material-ui-confirm';
import Link from 'next/link';
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
	_Object,
} from '@aws-sdk/client-s3';
import { Button, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
export default function FilesGrid({
	projectId,
	projectName,
	files,
	setFiles,
}: any) {
	const { data: session, status } = useSession();
	const confirm = useConfirm();

	function shortenStringAfterLastBackslash(inputString: any) {
		const lastIndex = inputString.lastIndexOf('/');
		if (lastIndex === -1) {
			return inputString;
		} else {
			return inputString.substring(lastIndex + 1);
		}
	}
	const deleteS3File = async (fileNameToDelete: any) => {
		confirm({ description: 'This action is permanent!' }).then(async () => {
			try {
				if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
					alert('S3 bucket name is not set');
					return;
				}

				const client = new S3Client({
					region: 'us-east-1',
					credentials: {
						accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
						secretAccessKey:
							process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
					},
				});

				const params = {
					Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
					Key: fileNameToDelete,
				};

				const command = new DeleteObjectCommand(params);

				await client.send(command);
				setFiles(
					files!.filter((obj: any) => obj.Key !== fileNameToDelete)
				);
			} catch (error) {
				console.error(
					`Error deleting file ${fileNameToDelete}:`,
					error
				);
			}
		});
	};
	const columns: GridColDef[] = [
		{
			field: 'file',
			headerName: 'File',
			width: 500,
			renderCell: (params) => (
				<Link
					className='hover:bg-blue-200 hover:font-bold hover:text-lg border w-full text-center border-gray-300 p-3 hover:scale-105 transition-transform'
					href={{
						pathname: `https://${
							process.env.NEXT_PUBLIC_S3_BUCKET_NAME
						}.s3.amazonaws.com/${
							projectName + '-' + projectId
						}/${shortenStringAfterLastBackslash(params.row.Key)}`,
					}}
				>
					{shortenStringAfterLastBackslash(params.row.Key)}
				</Link>
			),
			flex: 1,
			headerAlign: 'center',
		},
		{
			field: 'delete',
			headerName: 'Delete',
			width: 100,
			renderCell: (params) => (
				<button
					className='p-2'
					onClick={() => deleteS3File(params.row.Key)}
				>
					<FaRegTrashAlt />
				</button>
			),
			disableColumnMenu: true,
			sortable: false,
			align: 'center',
			headerAlign: 'center',
		},
	];
	function getRowId(row: any) {
		return row.id;
	}
	const [selectedFile, setSelectedFile] = useState<File | undefined>(
		undefined
	);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = (event: any) => {
		setSelectedFile(event.target.files[0]);
	};
	const uploadFile = async () => {
		if (!selectedFile) {
			alert('Please select a file');
			return;
		}

		if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
			alert('S3 bucket name is not set');
			return;
		}

		setUploading(true);

		let client = new S3Client({
			region: 'us-east-1',
			credentials: {
				accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
				secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
			},
		});

		const command = new PutObjectCommand({
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Key: `${projectName + '-' + projectId}/${selectedFile.name}`,
			Body: selectedFile,
		});

		try {
			const response = await client.send(command);
			setFiles((prevData: any) => [
				...prevData,
				{
					Key: selectedFile.name,
					id: Math.floor(Math.random() * 1000000000),
				},
			]);
			setSelectedFile(undefined);
			setUploading(false);
		} catch (err) {
			console.error(err);
		}
	};
	const VisuallyHiddenInput = styled('input')({
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(50%)',
		height: 1,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0,
		left: 0,
		whiteSpace: 'nowrap',
		width: 1,
	});
	return (
		<>
			{status === 'authenticated' && files && (
				<div className='max-w-4xl bg-white rounded-b-lg w-full p-1'>
					<div className='bg-white w-full p-3 flex justify-between'>
						<div>
							<Button
								component='label'
								role={undefined}
								variant='contained'
								tabIndex={-1}
								startIcon={<CloudUploadIcon />}
							>
								Upload file
								<VisuallyHiddenInput
									type='file'
									accept='.kmz, application/vnd.google-earth.kmz, .kml, application/vnd.google-earth.kml, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf'
									onChange={handleFileChange}
								/>
							</Button>
							<div>
								Selected File:{' '}
								{selectedFile && selectedFile.name}
							</div>
						</div>
						<button
							onClick={uploadFile}
							disabled={uploading}
							className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'
						>
							Add
						</button>
					</div>
					<div style={{ height: 500, width: '100%' }}>
						{files && (
							<DataGrid
								getRowId={getRowId}
								rows={files}
								columns={columns}
								initialState={{
									pagination: {
										paginationModel: {
											page: 0,
											pageSize: 10,
										},
									},
								}}
								pageSizeOptions={[10, 10]}
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
}
