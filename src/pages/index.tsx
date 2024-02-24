import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useSession, signOut } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import ProjectsGrid from "@/components/projectsGrid";
import TodoGrid from "@/components/taskGrid";

import AllTasksGrid from "@/components/allTasksGrid";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [projects, setProjects] = useState<any[] | undefined>();
  const [projectIds, setProjectIds] = useState<any[] | undefined>();
  const { data: session, status } = useSession();
  const [selectedGrid, setSelectedGrid] = useState<string>("Projects");
  const [allTasks, setAllTasks] = useState<any[] | undefined>();
  const [loading, setLoading] = useState(true);
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
        setProjectIds(data.map((project: any) => project.id));
        setProjects(data);
        setLoading(false);
      } else {
        console.error("Failed to sign up");
        setLoading(false);
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

    getAllTasks();
  }, [projects]);
  const getAllTasks = async () => {
    try {
      const response = await fetch("/api/getAllTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectIds: projectIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setAllTasks(data);
        setLoading(false);
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  if (session && loading)
    return (
      <main className='w-full px-4 h-full min-h-screen flex flex-col justify-center items-center bg-blue-200'>
        <CircularProgress />
      </main>
    );
  return (
    <main className='w-full px-4 h-full min-h-screen flex flex-col items-center bg-blue-200'>
      <Navbar />

      {status === "authenticated" ? (
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
                selectedGrid === "Tasks"
                  ? "bg-blue-800 text-white hover:bg-blue-800"
                  : "text-blue-600"
              }`}
              onClick={() => setSelectedGrid("Tasks")}>
              Tasks
            </button>
          </div>
          {selectedGrid === "Projects" && (
            <ProjectsGrid
              projects={projects}
              setProjects={setProjects}
              setLoading={setLoading}
            />
          )}
          {selectedGrid === "Tasks" && (
            <AllTasksGrid
              tasks={allTasks}
              setTasks={setAllTasks}
              projects={projects}
            />
          )}
        </>
      ) : (
        <div></div>
      )}
    </main>
  );
}
