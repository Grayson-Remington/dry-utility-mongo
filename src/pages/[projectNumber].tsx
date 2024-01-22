import { useEffect, useState } from "react";
import * as React from "react";
import Navbar from "@/components/navbar";
import TaskGrid from "@/components/taskGrid";
import ContactsGrid from "@/components/contactsGrid";
import { Button, ButtonGroup } from "@mui/material";
import TodoGrid from "@/components/todoGrid";

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
  const [contacts, setContacts] = useState<any[] | undefined>();
  const [todos, setTodos] = useState<any[] | undefined>();
  const [selectedGrid, setSelectedGrid] = useState<string>("Tasks");
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

  useEffect(() => {
    getTasks();
    getContacts();
    getTodos();
  }, []);

  return (
    <main className='w-full h-full flex flex-col gap-2 items-center bg-blue-200 p-4'>
      <Navbar />
      <h1 className='text-2xl underline'>{projectNumber}</h1>
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className='bg-white text-black'>
        <Button
          className={`${
            selectedGrid === "Tasks"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : ""
          }`}
          onClick={() => setSelectedGrid("Tasks")}>
          Tasks
        </Button>
        <Button
          className={`${
            selectedGrid === "Contacts"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : ""
          }`}
          onClick={() => setSelectedGrid("Contacts")}>
          Contacts
        </Button>
        <Button
          className={`${
            selectedGrid === "Todos"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : ""
          }`}
          onClick={() => setSelectedGrid("Todos")}>
          To Dos
        </Button>
      </ButtonGroup>

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
    </main>
  );
}
