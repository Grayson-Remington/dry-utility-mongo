import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
export default function UsersGrid({ users, setUsers, projectNumber }: any) {
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
  console.log(users);
  const columns: GridColDef[] = [
    {
      field: "users",
      headerName: "Users",
      width: 500,
      renderCell: (params) => <div>{params.row.email}</div>,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      renderCell: (params) => <div>{params.row.role}</div>,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <button className='p-2' onClick={() => deleteUser(params.row.email)}>
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
    return row.id | Math.floor(Math.random() * 1000000000);
  }
  const [userFormData, setUserFormData] = useState({
    email: "",
    role: "user",
  });
  const addUserToProject = async (newItem: any) => {
    try {
      const response = await fetch("/api/addUserToProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectNumber: projectNumber,
          email: newItem.email,
          role: newItem.role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserFormData({
          email: "",
          role: "",
        });
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleUserInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleUserSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", userFormData);
    const newItem = {
      email: userFormData.email,
      role: userFormData.role,
    };
    addUserToProject(newItem);
    // Update the state by creating a new array with the new item
  };
  const deleteUser = async (email: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectNumber: projectNumber,
              email: email,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(users!.filter((obj: any) => obj.email !== email));
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

  return (
    <>
      {status === "authenticated" && users && (
        <div className='max-w-4xl bg-white rounded-b-lg w-full p-1'>
          <form onSubmit={handleUserSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className='flex h-full w-full pr-1 border-black font-bold'>
                <input
                  type='email'
                  name='email' // Add name attribute to identify the input in handleInputChange
                  value={userFormData.email || undefined}
                  onChange={handleUserInputChange}
                  required
                  className='border border-black rounded-md w-full'
                />
                <select
                  className={`rounded-lg p-1 font-bold `}
                  value={userFormData.role}
                  onChange={handleUserInputChange}
                  id='role'
                  name='role'>
                  <option className='' value='user'>
                    User
                  </option>
                  <option className='' value='admin'>
                    Admin
                  </option>
                  <option className='' value='shareholder'>
                    Shareholder
                  </option>
                </select>
              </div>

              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
          <div style={{ height: 500, width: "100%" }}>
            {users && (
              <DataGrid
                getRowId={getRowId}
                rows={users}
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
