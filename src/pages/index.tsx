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
  const [projectNumbers, setProjectNumbers] = useState<any[] | undefined>();
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
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (response.ok) {
        const data = await response.json();
        setProjectNumbers(data.map((project: any) => project.projectNumber));
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
    if (!session) return;

    getProjects();
  }, [session]);
  useEffect(() => {
    if (!projects) return;

    getAllTodos();
  }, [projects]);
  const getAllTodos = async () => {
    try {
      const response = await fetch("/api/getAllTodos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projects: projectNumbers }),
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
    <main className='w-full px-4 h-full min-h-screen flex flex-col items-center bg-blue-200'>
      <Navbar />
      {status === "authenticated" && (
        <>
          <div className=''>
            <button
              className={`p-2  border border-blue-600 rounded-l-md  ${
                selectedGrid === "Projects"
                  ? "bg-blue-800 text-white hover:bg-blue-800"
                  : "text-blue-600"
              }`}
              onClick={() => setSelectedGrid("Projects")}>
              Projects
            </button>
            <button
              className={`p-2 border border-blue-600 rounded-r-md  ${
                selectedGrid === "Todos"
                  ? "bg-blue-800 text-white hover:bg-blue-800"
                  : "text-blue-600"
              }`}
              onClick={() => setSelectedGrid("Todos")}>
              Todos
            </button>
          </div>
          {selectedGrid === "Projects" && (
            <ProjectsGrid projects={projects} setProjects={setProjects} />
          )}
          {selectedGrid === "Todos" && (
            <AllTodoGrid
              todos={allTodos}
              setTodos={setAllTodos}
              projects={projects}
            />
          )}
        </>
      )}
    </main>
  );
}
