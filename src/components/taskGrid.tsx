import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
export default function TaskGrid({ todos, setTodos, projectNumber }: any) {
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
  const deleteTodo = async (id: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteTodo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
          });

          if (response.ok) {
            const data = await response.json();
            setTodos(todos!.filter((obj: any) => obj.id !== id));
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
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

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
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => <div>{formatDate(params.row.date)}</div>,
    },
    {
      field: "text",
      headerName: "Information",
      width: 300,
      flex: 1,
      renderCell: (params: any) => (
        <Tooltip title={params.row.text}>
          <span className='table-cell-trucate'>{params.row.text}</span>
        </Tooltip>
      ),
    },
    {
      field: "todoClass",
      headerName: "Category",
      width: 100,
      cellClassName: (params) =>
        params.row.todoClass == "Power"
          ? "bg-red-500"
          : params.row.todoClass == "Gas"
          ? "bg-yellow-300"
          : params.row.todoClass == "Telco"
          ? "bg-orange-500"
          : "bg-purple-500",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "author",
      headerName: "Author",
      width: 60,
      renderCell: (params) => (
        <Avatar
          className=' text-sm h-8 w-8 items-center justify-center flex'
          {...stringAvatar(
            `${params.row.author ? params.row.author : "Filler Name"}`
          )}
        />
      ),
      align: "right",
      headerAlign: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,

      renderCell: (params) => (
        <button className='p-2' onClick={() => deleteTodo(params.row.id)}>
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

  const addTodo = async (newItem: any) => {
    try {
      const response = await fetch("/api/addTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: session?.user?.name,
          projectNumber: projectNumber,
          todoClass: newItem.todoClass,
          date: newItem.date,
          text: newItem.text,
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

  const [todoFormData, setTodoFormData] = useState({
    date: "",
    text: "",
    todoClass: "Power",
  });

  const handleTodoInputChange = (e: any) => {
    const { name, value } = e.target;
    setTodoFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTodoSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", todoFormData);
    const newItem = {
      author: session?.user?.name,
      projectNumber: projectNumber,
      todoClass: todoFormData.todoClass,
      date: todoFormData.date,
      text: todoFormData.text,
      id: Math.floor(Math.random() * 1000000000),
    };
    addTodo(newItem);
    // Update the state by creating a new array with the new item
    setTodos((prevData: any) => [...prevData, newItem]);
  };
  return (
    <>
      {status === "authenticated" && todos && (
        <div className=' max-w-4xl w-full bg-white rounded-b-lg p-1'>
          <form onSubmit={handleTodoSubmit}>
            <div className='hidden p-3 w-full sm:flex gap-3 py-1 border-black sm:flex-row'>
              <input
                className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                type='date'
                name='date' // Add name attribute to identify the input in handleInputChange
                value={todoFormData.date}
                onChange={handleTodoInputChange}
                required
              />
              <TextField
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={todoFormData.text}
                onChange={handleTodoInputChange}
                className='border border-black rounded-md w-full'
                required
                id='text'
                label='Task'
                variant='outlined'
                // Add name attribute to identify the input in handleInputChange
              />

              <FormControl fullWidth className='group max-w-48'>
                <InputLabel id='todoClass-label'>Task Class</InputLabel>
                <Select
                  labelId='todoClass-label'
                  value={todoFormData.todoClass}
                  onChange={handleTodoInputChange}
                  id='todoClass'
                  name='todoClass'
                  label='To do Class'
                  className=''>
                  <MenuItem className='' value='Power'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Power</div>
                      <div className='rounded-full bg-red-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Gas'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Gas</div>
                      <div className='rounded-full bg-yellow-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Telco'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Telco</div>
                      <div className='rounded-full bg-orange-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Misc'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Misc</div>
                      <div className='rounded-full bg-purple-500 h-4 w-4'></div>
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
            <div className='sm:hidden p-3 w-full flex flex-col gap-3 py-1 border-black sm:flex-row'>
              <TextField
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={todoFormData.text}
                onChange={handleTodoInputChange}
                className='border border-black rounded-md w-full'
                required
                id='text'
                label='Task'
                variant='outlined'
                // Add name attribute to identify the input in handleInputChange
              />
              <div className='flex justify-between'>
                <input
                  className='max-w-48 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:cursor-text block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  type='date'
                  name='date' // Add name attribute to identify the input in handleInputChange
                  value={todoFormData.date}
                  onChange={handleTodoInputChange}
                  required
                />
                <FormControl fullWidth className='group max-w-48'>
                  <InputLabel id='todoClass-label'>Task Class</InputLabel>
                  <Select
                    labelId='todoClass-label'
                    value={todoFormData.todoClass}
                    onChange={handleTodoInputChange}
                    id='todoClass'
                    name='todoClass'
                    label='To do Class'
                    className=''>
                    <MenuItem className='' value='Power'>
                      <div className='flex justify-between items-center w-full'>
                        <div>Power</div>
                        <div className='rounded-full bg-red-500 h-4 w-4'></div>
                      </div>
                    </MenuItem>
                    <MenuItem className='' value='Gas'>
                      <div className='flex justify-between items-center w-full'>
                        <div>Gas</div>
                        <div className='rounded-full bg-yellow-500 h-4 w-4'></div>
                      </div>
                    </MenuItem>
                    <MenuItem className='' value='Telco'>
                      <div className='flex justify-between items-center w-full'>
                        <div>Telco</div>
                        <div className='rounded-full bg-orange-500 h-4 w-4'></div>
                      </div>
                    </MenuItem>
                    <MenuItem className='' value='Misc'>
                      <div className='flex justify-between items-center w-full'>
                        <div>Misc</div>
                        <div className='rounded-full bg-purple-500 h-4 w-4'></div>
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
          <div style={{ height: 450, width: "100%" }}>
            <DataGrid
              getRowId={getRowId}
              rows={todos}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
                sorting: {
                  sortModel: [{ field: "date", sort: "desc" }],
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
