import Link from "next/link";
import { useRouter } from "next/router";
import BasicAccordion from "./accoridan";
import { useEffect, useState } from "react";

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
  const [tasks, setTasks] = useState();
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
  });

  return (
    <main className='p-8 md:px-20 flex flex-col items-center overflow-hidden h-full'>
      <button className='absolute left-10' onClick={() => router.push("/")}>
        Home
      </button>
      <h1 className='text-center'>{projectNumber}</h1>
      <div className='pt-8 max-w-[1000px]'>
        <BasicAccordion projectNumber={projectNumber} tasks={tasks} />
      </div>
    </main>
  );
}
