import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
export default function ProjectsGrid({ projects, setProjects }: any) {
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
      field: "projectNumber",
      headerName: "Project Number",
      width: 500,
      renderCell: (params) => (
        <Link
          className='hover:bg-blue-200 hover:font-bold hover:text-lg border w-full text-center border-black p-3 hover:scale-105 transition-transform'
          href={{
            pathname: `/${params.row.projectNumber}`,
            query: {
              projectId: params.row.id,
              projectNumber: params.row.projectNumber,
              users: params.row.users,
            },
          }}
          as={`/${params.row.projectNumber}`}>
          {params.row.projectNumber}
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
        <button
          className='p-2'
          onClick={() =>
            deleteProject(params.row.id, params.row.projectNumber)
          }>
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
  const addProject = async (newItem: any) => {
    try {
      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectNumber: newItem.projectNumber,
          id: newItem.id,
          email: session!.user!.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
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
            console.log(data); // Handle success
          } else {
            console.error("Failed to sign up");
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
    console.log("Form submitted:", projectFormData);
    const newItem = {
      projectNumber: projectFormData.projectNumber,
      id: Math.floor(Math.random() * 1000000000),
    };
    addProject(newItem);
    // Update the state by creating a new array with the new item
    setProjects((prevData: any) => [...prevData, newItem]);
  };
  return (
    <>
      {status === "authenticated" && projects && (
        <div className='max-w-4xl bg-white rounded-lg w-full p-1'>
          <form onSubmit={handleProjectSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className=' h-full w-full pr-1 border-black font-bold'>
                <input
                  type='text'
                  name='projectNumber' // Add name attribute to identify the input in handleInputChange
                  value={projectFormData.projectNumber}
                  onChange={handleProjectInputChange}
                  required
                  className='border border-black rounded-md w-full'
                />
              </div>

              <button type='submit' className='border border-black rounded-lg'>
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
