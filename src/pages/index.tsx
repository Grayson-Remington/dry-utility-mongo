import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [projectNumber, setProjectNumber] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const addProject = async (projectNumber: any) => {
    try {
      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectNumber: projectNumber }),
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
  }, []);

  return (
    <main className='p-8 flex flex-col gap-2 items-center w-full h-full bg-green-600 bg-opacity-75'>
      <div className='flex gap-2'>
        <input
          className='border border-black rounded-md'
          type='text'
          onChange={(e) => {
            setProjectNumber(e.target.value);
          }}
        />
        <button
          className='bg-white border-black border rounded-lg p-1'
          onClick={() => {
            addProject(projectNumber);
            setProjects((prevData) => [
              ...prevData,
              { projectNumber: projectNumber },
            ]);
          }}>
          Add Project
        </button>
      </div>

      {projects.map((project) => (
        <Link
          key={project._id}
          className='hover:bg-gray-200 border w-2/3 text-center border-black rounded-lg m-1 p-2'
          href={`/${project.projectNumber}`}
          as={`/${project.projectNumber}`}>
          {project.projectNumber}
        </Link>

        // Replace 'name' with the property you want to display
      ))}
    </main>
  );
}
