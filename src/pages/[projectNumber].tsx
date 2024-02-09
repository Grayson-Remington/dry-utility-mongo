import { useEffect, useState } from "react";
import * as React from "react";
import Navbar from "@/components/navbar";
import TaskGrid from "@/components/taskGrid";
import ContactsGrid from "@/components/contactsGrid";
import { Button, ButtonGroup } from "@mui/material";
import TodoGrid from "@/components/todoGrid";
import { useSession } from "next-auth/react";
import Upload from "@/components/Upload";
import MapComponent from "@/components/MapComponent";

export async function getServerSideProps(context: any) {
  const { projectNumber, projects } = context.query;

  // Fetch tasks based on projectNumber (similar to your existing getTasks function)
  // ...

  return {
    props: {
      projects,
      projectNumber,
      // Pass other data you need to the component
    },
  };
}

export default function ProjectPage({ projectNumber, projects }: any) {
  const [tasks, setTasks] = useState<any[] | undefined>();
  const [contacts, setContacts] = useState<any[] | undefined>();
  const [todos, setTodos] = useState<any[] | undefined>();
  const [selectedGrid, setSelectedGrid] = useState<string>("Tasks");
  const { data: session, status } = useSession();
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
  const getContacts = async () => {
    try {
      const response = await fetch("/api/getContacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectNumber: projectNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getTodos = async () => {
    try {
      const response = await fetch("/api/getTodos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectNumber: projectNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmailFormData({
          email: null,
        });
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
    getContacts();
    getTodos();
  }, []);
  const [emailFormData, setEmailFormData] = useState({
    email: null,
  });
  const handleEmailInputChange = (e: any) => {
    const { name, value } = e.target;
    setEmailFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEmailSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", emailFormData);
    const newItem = {
      email: emailFormData.email,
    };
    addUserToProject(newItem);
    // Update the state by creating a new array with the new item
  };

  return (
    <main className='w-full h-full min-h-screen flex flex-col items-center bg-blue-200 px-4'>
      <Navbar />
      <h1 className='text-2xl underline py-2'>{projectNumber}</h1>

      <form onSubmit={handleEmailSubmit}>
        <div className='w-full flex gap-2 py-1 border-b border-black'>
          <div className=' h-full w-full pr-1 border-black font-bold'>
            <input
              type='text'
              name='email' // Add name attribute to identify the input in handleInputChange
              value={emailFormData.email || ""}
              onChange={handleEmailInputChange}
              required
              className='border border-black rounded-md w-full'
            />
          </div>

          <button type='submit' className='border border-black rounded-lg'>
            Add
          </button>
        </div>
      </form>
      <div className=''>
        <button
          className={`p-2  border border-blue-600 rounded-l-md  ${
            selectedGrid === "Tasks"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : "text-blue-600"
          }`}
          onClick={() => setSelectedGrid("Tasks")}>
          Tasks
        </button>
        <button
          className={`p-2 border border-blue-600  ${
            selectedGrid === "Contacts"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : "text-blue-600"
          }`}
          onClick={() => setSelectedGrid("Contacts")}>
          Contacts
        </button>
        <button
          className={`p-2 border border-blue-600  ${
            selectedGrid === "Todos"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : "text-blue-600"
          }`}
          onClick={() => setSelectedGrid("Todos")}>
          Todos
        </button>
        <button
          className={`p-2 border border-blue-600 rounded-r-md  ${
            selectedGrid === "Map"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : "text-blue-600"
          }`}
          onClick={() => setSelectedGrid("Map")}>
          Map
        </button>
      </div>

      {selectedGrid === "Tasks" && (
        <TaskGrid
          tasks={tasks}
          setTasks={setTasks}
          projectNumber={projectNumber}
        />
      )}
      {selectedGrid === "Contacts" && (
        <ContactsGrid
          contacts={contacts}
          setContacts={setContacts}
          projectNumber={projectNumber}
        />
      )}
      {selectedGrid === "Todos" && (
        <TodoGrid
          todos={todos}
          setTodos={setTodos}
          projectNumber={projectNumber}
        />
      )}
      {selectedGrid === "Map" && <MapComponent projectNumber={projectNumber} />}
    </main>
  );
}
