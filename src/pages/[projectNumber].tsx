import Link from "next/link";
import { useRouter } from "next/router";
import BasicAccordion from "./accoridan";
import { useEffect, useState } from "react";
import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Navbar from "@/components/navbar";

const columns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 130 },
  { field: "text", headerName: "Information", width: 300 },
  { field: "taskClass", headerName: "Category", width: 130 },
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

export async function getServerSideProps(context: any) {
  const { projectNumber } = context.query;

  // Fetch tasks based on projectNumber (similar to your existing getTasks function)
  // ...

  return {
    props: {
      projectNumber,
      // Pass other data you need to the component
    },
  };
}

export default function ProjectPage({ projectNumber }: any) {
  const [tasks, setTasks] = useState<any[] | undefined>();
  const router = useRouter();

  const getTasks = async () => {
    try {
      const response = await fetch("/api/getTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectNumber: projectNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

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
    <main className='w-full h-full flex flex-col items-center bg-green-500'>
      <Navbar />

      {tasks && (
        <div className='max-w-4xl bg-white rounded-lg p-1'>
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
                value={taskFormData.taskClass}
                onChange={handleTaskInputChange}
                id='taskClass'
                name='taskClass'>
                <option value='Power'>Power</option>
                <option value='Gas'>Gas</option>
                <option value='Telco'>Telco</option>
                <option value='Misc'>Misc</option>
              </select>
              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              getRowId={getRowId}
              rows={tasks}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </div>
      )}
    </main>
  );

  // return (
  //   <main className='p-8 md:px-20 flex flex-col items-center overflow-hidden h-full'>
  //
  //     <h1 className='text-center'>{projectNumber}</h1>
  //     <div className='pt-8 max-w-[1000px]'>
  //       <BasicAccordion projectNumber={projectNumber} tasks={tasks} />
  //     </div>
  //   </main>
  // );
}
