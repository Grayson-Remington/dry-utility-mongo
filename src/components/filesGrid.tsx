import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  S3Client,
  _Object,
} from "@aws-sdk/client-s3";
import Upload from "./Upload";
export default function FilesGrid({ projectNumber, files, setFiles }: any) {
  const { data: session, status } = useSession();
  const confirm = useConfirm();

  function shortenStringAfterLastBackslash(inputString: any) {
    const lastIndex = inputString.lastIndexOf("/");
    if (lastIndex === -1) {
      // If no backslash is found, return the original string
      return inputString;
    } else {
      // Return everything after the last backslash
      return inputString.substring(lastIndex + 1);
    }
  }
  const deleteS3File = async (fileNameToDelete: any) => {
    console.log(fileNameToDelete);
    confirm({ description: "This action is permanent!" }).then(async () => {
      try {
        if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
          alert("S3 bucket name is not set");
          return;
        }

        const client = new S3Client({
          region: "us-east-1",
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
          },
        });

        const params = {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: fileNameToDelete,
        };

        const command = new DeleteObjectCommand(params);

        await client.send(command);
        console.log(`File ${fileNameToDelete} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting file ${fileNameToDelete}:`, error);
      }
    });
  };
  const columns: GridColDef[] = [
    {
      field: "file",
      headerName: "File",
      width: 500,
      renderCell: (params) => (
        <Link
          className='hover:bg-blue-200 hover:font-bold hover:text-lg border w-full text-center border-black p-3 hover:scale-105 transition-transform'
          href={{
            pathname: `https://${
              process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            }.s3.amazonaws.com/${projectNumber}/${shortenStringAfterLastBackslash(
              params.row.Key
            )}`,
          }}>
          {shortenStringAfterLastBackslash(params.row.Key)}
        </Link>
      ),
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <button className='p-2' onClick={() => deleteS3File(params.row.Key)}>
          <FaRegTrashAlt />
        </button>
      ),
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    // },
  ];
  function getRowId(row: any) {
    return row.id;
  }
  return (
    <>
      {status === "authenticated" && files && (
        <div className='max-w-4xl bg-white rounded-b-lg w-full p-1'>
          <Upload projectNumber={projectNumber} />
          <div style={{ height: 500, width: "100%" }}>
            {files && (
              <DataGrid
                getRowId={getRowId}
                rows={files}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 10]}
              />
            )}
            {/* {projects.map((project) => (
          <div className='flex w-full max-w-xl' key={project._id}>
            <Link
              className='hover:bg-gray-200 border w-2/3 text-center border-black rounded-lg m-1 p-2'
              href={`/${project.projectNumber}`}
              as={`/${project.projectNumber}`}>
              {project.projectNumber}
            </Link>
            <button
              onClick={() => deleteProject(project._id, project.projectNumber)}>
              Delete
            </button>
          </div>
          // Replace 'name' with the property you want to display
        ))} */}
          </div>
        </div>
      )}
    </>
  );
}
