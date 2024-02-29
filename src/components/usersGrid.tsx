import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Toaster } from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {},
  "& .MuiAccordionSummary-content": {
    flexGrow: 0,
    justifyContent: "center",
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function UsersGrid({ users, setUsers, projectId }: any) {
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
    role: "",
  });
  const addUserToProject = async (newItem: any) => {
    try {
      const response = await fetch("/api/addUserToProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
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
              projectId: projectId,
              email: email,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(users!.filter((obj: any) => obj.email !== email));
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
      <Toaster />
      {status === "authenticated" && users && (
        <div className='max-w-4xl bg-white rounded-b-lg w-full p-1'>
          <Accordion>
            <AccordionSummary
              sx={{
                root: {
                  flexDirection: "column",
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
              id='panel1-header'>
              Add User
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleUserSubmit}>
                <div className='hidden w-full p-3 sm:flex gap-2 py-1 border-b border-black'>
                  <TextField
                    type='email'
                    name='email' // Add name attribute to identify the input in handleInputChange
                    value={userFormData.email || undefined}
                    onChange={handleUserInputChange}
                    required
                    className='border border-black rounded-md w-full'
                    id='text'
                    label='Email'
                    variant='outlined'

                    // Add name attribute to identify the input in handleInputChange
                  />

                  <FormControl fullWidth className='group max-w-48'>
                    <InputLabel id='Role-label'>Role</InputLabel>
                    <Select
                      value={userFormData.role}
                      onChange={handleUserInputChange}
                      id='role'
                      name='role'
                      labelId='role-label'
                      label='Role'
                      className=''
                      required>
                      <MenuItem className='' value='user'>
                        <div className='flex justify-between items-center w-full'>
                          <div>User</div>
                        </div>
                      </MenuItem>
                      <MenuItem className='' value='admin'>
                        <div className='flex justify-between items-center w-full'>
                          <div>Admin</div>
                        </div>
                      </MenuItem>
                      <MenuItem className='' value='shareholder'>
                        <div className='flex justify-between items-center w-full'>
                          <div>Shareholder</div>
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <button
                    type='submit'
                    className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                    Add
                  </button>
                </div>
                <div className='sm:hidden w-full p-3 flex flex-col gap-2 py-1 border-b border-black'>
                  <TextField
                    type='email'
                    name='email' // Add name attribute to identify the input in handleInputChange
                    value={userFormData.email || undefined}
                    onChange={handleUserInputChange}
                    required
                    className='border border-black rounded-md w-full'
                    id='text'
                    label='Email'
                    variant='outlined'

                    // Add name attribute to identify the input in handleInputChange
                  />
                  <div className='flex justify-center gap-2'>
                    <FormControl fullWidth className='group max-w-48'>
                      <InputLabel id='Role-label'>Role</InputLabel>
                      <Select
                        value={userFormData.role}
                        onChange={handleUserInputChange}
                        id='role'
                        name='role'
                        labelId='role-label'
                        label='Role'
                        className=''
                        required>
                        <MenuItem className='' value='user'>
                          <div className='flex justify-between items-center w-full'>
                            <div>User</div>
                          </div>
                        </MenuItem>
                        <MenuItem className='' value='admin'>
                          <div className='flex justify-between items-center w-full'>
                            <div>Admin</div>
                          </div>
                        </MenuItem>
                        <MenuItem className='' value='shareholder'>
                          <div className='flex justify-between items-center w-full'>
                            <div>Shareholder</div>
                          </div>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <button
                      type='submit'
                      className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </AccordionDetails>
          </Accordion>

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
              href={`/${project.projectId}`}
              as={`/${project.projectId}`}>
              {project.projectId}
            </Link>
            <button
              onClick={() => deleteProject(project._id, project.projectId)}>
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
