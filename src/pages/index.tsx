import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useSession, signOut } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [projects, setProjects] = useState<any[] | undefined>();
  const { data: session, status } = useSession();
  const columns: GridColDef[] = [
    {
      field: "projectNumber",
      headerName: "Project Number",
      width: 500,
      renderCell: (params) => (
        <Link
          className='hover:bg-gray-200 border w-full text-center border-black rounded-lg m-1 p-2'
          href={`/${params.row.projectNumber}`}
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
  const getProjects = async () => {
    try {
      const response = await fetch("/api/getProjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const deleteProject = async (id: any, projectNumber: any) => {
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
        setProjects(projects!.filter((obj) => obj.id !== id));
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);
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
    <main className='w-full h-full flex flex-col items-center bg-blue-200'>
      <Navbar />
      {status === "authenticated" && (
        <div className='max-w-4xl bg-white rounded-lg p-1 min-w-[619.5px]'>
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
          <div style={{ height: 400, width: "100%" }}>
            {projects && (
              <DataGrid
                getRowId={getRowId}
                rows={projects}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
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
    </main>
  );
}
