import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import { TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
export default function ProjectsGrid({
  projects,
  setProjects,
  setLoading,
}: any) {
  const { data: session, status } = useSession();
  const confirm = useConfirm();
  function formatDate(inputDate: any) {
    // Split the input date string into an array
    var dateArray = inputDate.split("-");

    // Extract year, month, and day from the array
    var year = dateArray[0];
    var month = dateArray[1];
    var day = dateArray[2];

    // Format the date as "MM/DD/YYYY"
    var formattedDate = month + "/" + day + "/" + year;

    return formattedDate;
  }
  const columns: GridColDef[] = [
    {
      field: "projectName",
      headerName: "Project Name",
      width: 500,
      renderCell: (params) => (
        <Link
          onClick={() => setLoading(true)}
          className='hover:bg-blue-200 hover:font-bold hover:text-lg border border-gray-300 rounded-lg w-full text-center  p-3 hover:scale-105 transition-transform'
          href={{
            pathname: `/${params.row.projectName}`,
            query: {
              projectName: params.row.projectName,
              projectId: params.row.id,
              projectNumber: params.row.projectNumber,
              role: params.row.users.find(
                (user: any) => user.email === session?.user?.email
              ).role,
            },
          }}
          as={`/${params.row.projectName}`}>
          {params.row.projectName}
        </Link>
      ),
      flex: 3,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "projectNumber",
      headerName: "Project Number",
      width: 500,
      renderCell: (params) => <>{params.row.projectNumber}</>,
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <>
          {params.row.users.find(
            (user: any) => user.email === session?.user?.email
          ).role === "admin" ? (
            <button
              className='p-2'
              onClick={() =>
                deleteProject(params.row.id, params.row.projectNumber)
              }>
              <FaRegTrashAlt />
            </button>
          ) : (
            <div></div>
          )}
        </>
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
  const addProject = async (newItem: any) => {
    try {
      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: newItem.projectName,
          projectNumber: newItem.projectNumber,
          id: newItem.id,
          email: session!.user!.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Successfully added Project");
      } else {
        console.error("Failed to sign up");
        toast.error("Unable to add Project");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const deleteProject = async (id: any, projectNumber: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteProject", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, projectNumber: projectNumber }),
          });

          if (response.ok) {
            const data = await response.json();
            setProjects(projects!.filter((obj: any) => obj.id !== id));
            toast.success("Successfully deleted Project");
          } else {
            console.error("Failed to sign up");
            toast.success("Unable to delete Project");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      })
      .catch(() => {
        /* ... */
      });
  };
  const [projectFormData, setProjectFormData] = useState({
    projectNumber: "",
    projectName: "",
  });
  const handleProjectInputChange = (e: any) => {
    const { name, value } = e.target;
    setProjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleProjectSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    const newItem = {
      projectName: projectFormData.projectName,
      projectNumber: projectFormData.projectNumber,
      id: Math.floor(Math.random() * 1000000000),
      users: [{ email: session?.user?.email, role: "admin" }],
    };
    addProject(newItem);
    // Update the state by creating a new array with the new item
    setProjects((prevData: any) => [...prevData, newItem]);
  };
  return (
    <>
      <Toaster />
      {status === "authenticated" && projects && (
        <div className='max-w-4xl bg-white rounded-lg w-full p-1'>
          <form onSubmit={handleProjectSubmit}>
            <div className='w-full flex gap-2 p-1 border-black'>
              <TextField
                id='outlined-basic'
                label='Project Name'
                variant='outlined'
                name='projectName' // Add name attribute to identify the input in handleInputChange
                value={projectFormData.projectName}
                onChange={handleProjectInputChange}
                required
                className='border border-black rounded-md w-full'
              />
              <TextField
                id='outlined-basic'
                label='Project Number'
                variant='outlined'
                name='projectNumber' // Add name attribute to identify the input in handleInputChange
                value={projectFormData.projectNumber}
                onChange={handleProjectInputChange}
                required
                className='border border-black rounded-md w-full'
              />

              <button
                type='submit'
                className=' hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                Add
              </button>
            </div>
          </form>
          <div style={{ height: 500, width: "100%" }}>
            {projects && (
              <DataGrid
                getRowId={getRowId}
                rows={projects}
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
