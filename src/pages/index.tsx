import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useSession, signOut } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button, ButtonGroup } from "@mui/material";
import ProjectsGrid from "@/components/projectsGrid";
import TodoGrid from "@/components/todoGrid";
import AllTodoGrid from "@/components/allTodoGrid";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [projects, setProjects] = useState<any[] | undefined>();
  const { data: session, status } = useSession();
  const [selectedGrid, setSelectedGrid] = useState<string>("Projects");
  const [allTodos, setAllTodos] = useState<any[] | undefined>();

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

  useEffect(() => {
    getProjects();
    getAllTodos();
  }, []);
  const getAllTodos = async () => {
    try {
      const response = await fetch("/api/getAllTodos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setAllTodos(data);
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <main className='w-full px-4 h-full flex flex-col items-center bg-blue-200'>
      <Navbar />
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className='bg-white text-black'>
        <Button
          className={`${
            selectedGrid === "Projects"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : ""
          }`}
          onClick={() => setSelectedGrid("Projects")}>
          Projects
        </Button>
        <Button
          className={`${
            selectedGrid === "Todos"
              ? "bg-blue-800 text-white hover:bg-blue-800"
              : ""
          }`}
          onClick={() => setSelectedGrid("Todos")}>
          Todos
        </Button>
      </ButtonGroup>
      {status === "authenticated" && selectedGrid === "Projects" && (
        <ProjectsGrid projects={projects} setProjects={setProjects} />
      )}
      {status === "authenticated" && selectedGrid === "Todos" && (
        <AllTodoGrid
          todos={allTodos}
          setTodos={setAllTodos}
          projects={projects}
        />
      )}
    </main>
  );
}
