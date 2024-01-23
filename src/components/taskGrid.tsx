import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
export default function TaskGrid({ tasks, setTasks, projectNumber }: any) {
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
      field: "date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => <div>{formatDate(params.row.date)}</div>,
    },
    { field: "text", headerName: "Information", width: 300, flex: 1 },
    {
      field: "taskClass",
      headerName: "Category",
      width: 130,
      cellClassName: (params) =>
        params.row.taskClass == "Power"
          ? "bg-red-500"
          : params.row.taskClass == "Gas"
          ? "bg-yellow-300"
          : params.row.taskClass == "Telco"
          ? "bg-orange-500"
          : "bg-purple-500",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,

      renderCell: (params) => (
        <button className='p-2' onClick={() => deleteTask(params.row.id)}>
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
  const addTask = async (newItem: any) => {
    try {
      const response = await fetch("/api/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectNumber: projectNumber,
          taskClass: newItem.taskClass,
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
  const deleteTask = async (id: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteTask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
          });

          if (response.ok) {
            const data = await response.json();
            setTasks(tasks!.filter((obj: any) => obj.id !== id));
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
  const [taskFormData, setTaskFormData] = useState({
    date: "",
    text: "",
    taskClass: "Power",
  });

  const handleTaskInputChange = (e: any) => {
    const { name, value } = e.target;
    setTaskFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleTaskSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", taskFormData);
    const newItem = {
      projectNumber: projectNumber,
      taskClass: taskFormData.taskClass,
      date: taskFormData.date,
      text: taskFormData.text,
      id: Math.floor(Math.random() * 1000000000),
    };
    addTask(newItem);
    // Update the state by creating a new array with the new item
    setTasks((prevData: any) => [...prevData, newItem]);
  };
  return (
    <>
      {status === "authenticated" && tasks && (
        <div className='max-w-6xl w-full bg-white rounded-lg p-1'>
          <form onSubmit={handleTaskSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className='border-r h-full pr-1 border-black font-bold'>
                <input
                  type='date'
                  name='date' // Add name attribute to identify the input in handleInputChange
                  value={taskFormData.date}
                  onChange={handleTaskInputChange}
                  required
                />
              </div>
              <input
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={taskFormData.text}
                onChange={handleTaskInputChange}
                className='border border-black rounded-md w-full'
                required
              />
              <select
                className={`rounded-lg p-1 font-bold ${
                  taskFormData.taskClass == "Power"
                    ? "bg-red-500"
                    : taskFormData.taskClass === "Gas"
                    ? "bg-yellow-500"
                    : taskFormData.taskClass === "Telco"
                    ? "bg-orange-500"
                    : "bg-purple-500"
                }`}
                value={taskFormData.taskClass}
                onChange={handleTaskInputChange}
                id='taskClass'
                name='taskClass'>
                <option className='bg-red-500' value='Power'>
                  Power
                </option>
                <option className='bg-yellow-500' value='Gas'>
                  Gas
                </option>
                <option className='bg-orange-500' value='Telco'>
                  Telco
                </option>
                <option className='bg-purple-500' value='Misc'>
                  Misc
                </option>
              </select>
              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
          <div className='h-[400px] overflow-hidden'>
            <DataGrid
              getRowId={getRowId}
              rows={tasks}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
                sorting: {
                  sortModel: [{ field: "date", sort: "desc" }],
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>
      )}
    </>
  );
}
