import { useEffect, useState } from "react";
import * as React from "react";
import Navbar from "@/components/navbar";
import TimelineGrid from "@/components/timelineGrid";
import ContactsGrid from "@/components/contactsGrid";
import { Button, ButtonGroup } from "@mui/material";
import TaskGrid from "@/components/taskGrid";
import { useSession } from "next-auth/react";
import Upload from "@/components/Upload";
import MapComponent from "@/components/MapComponent";
import FilesGrid from "@/components/filesGrid";
import { ListObjectsV2Command, S3Client, _Object } from "@aws-sdk/client-s3";
import jsCookies from "js-cookie";
import serverCookies from "cookies";
import UsersGrid from "@/components/usersGrid";

export async function getServerSideProps(context: any) {
  let { projectName, projectNumber, projectId, role } = context.query;
  const cookies = new serverCookies(context.req, context.res);
  const cookieProjectNumber = cookies.get("projectNumber");
  const cookieProjectId = cookies.get("projectId");
  const cookieProjectName = cookies.get("projectName");
  const cookieRole = cookies.get("role");
  if (projectId !== undefined) {
    return {
      props: {
        projectName,
        projectNumber,
        projectId,
        role,
      },
    };
  } else {
    return {
      props: {
        projectName: decodeURIComponent(cookieProjectName!),
        projectNumber: decodeURIComponent(cookieProjectNumber!),
        projectId: decodeURIComponent(cookieProjectId!),
        role: decodeURIComponent(cookieRole!),
      },
    };
  }
}

export default function ProjectPage({
  projectName,
  projectNumber,
  projectId,
  role,
}: any) {
  const [timelineItems, setTimelineItems] = useState<any[] | undefined>();
  const [contacts, setContacts] = useState<any[] | undefined>();
  const [tasks, setTasks] = useState<any[] | undefined>();
  const [users, setUsers] = useState<any[] | undefined>();
  const [files, setFiles] = useState<_Object[]>();
  const [selectedGrid, setSelectedGrid] = useState<string>("Tasks");

  const { data: session, status } = useSession();

  useEffect(() => {
    // Set cookies
    jsCookies.set("projectName", projectName);
    jsCookies.set("projectNumber", projectNumber);
    jsCookies.set("projectId", projectId);
    jsCookies.set("role", role);
  }, []);
  const getUsers = async () => {
    try {
      const response = await fetch("/api/getUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data[0].users);
        console.log(role, "role");

        console.log(data, "users"); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getTimelineItems = async () => {
    try {
      const response = await fetch("/api/getTimelineItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
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
        body: JSON.stringify({ projectId: projectId }),
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
  const getTasks = async () => {
    try {
      const response = await fetch("/api/getTasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectId }),
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
  const fetchFiles = async () => {
    if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
      alert("S3 bucket name is not set");
      return;
    }

    let client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Prefix: projectName + "-" + projectId,
    });

    try {
      const response = await client.send(command);
      if (response.Contents) {
        // Assuming S3Object is the type defined earlier
        const filesWithIds = response.Contents.map((file, index) => ({
          ...file,
          id: index.toString(), // You can use any unique identifier here
        }));
        setFiles(filesWithIds as _Object[]);
      } else {
        setFiles([]);
      } // Remove the wrapping array brackets
      console.log(response);
      console.log(files);
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    if (!projectId) return;
    console.log(projectId, "projectId");
    getUsers();
    getTasks();
    getContacts();
    getTimelineItems();
    fetchFiles();
  }, [projectId]);

  const [emailFormData, setEmailFormData] = useState({
    email: null,
  });

  return (
    <main className='w-full h-full min-h-screen flex flex-col items-center bg-blue-200 px-4'>
      <Navbar />

      <div className='flex flex-col sm:flex-row justify-center items-center'>
        <div>
          <button
            className={`p-2  border border-blue-600 rounded-l-md  ${
              selectedGrid === "Timeline"
                ? "bg-blue-800 text-white hover:bg-blue-800"
                : "text-blue-600"
            }`}
            onClick={() => setSelectedGrid("Timeline")}>
            Timeline
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
            className={`p-2 border border-blue-600 rounded-r-md sm:rounded-r-none  ${
              selectedGrid === "Tasks"
                ? "bg-blue-800 text-white hover:bg-blue-800"
                : "text-blue-600"
            }`}
            onClick={() => setSelectedGrid("Tasks")}>
            Tasks
          </button>
        </div>
        <div>
          <button
            className={`p-2 border border-blue-600 rounded-l-md sm:rounded-none  ${
              selectedGrid === "Files"
                ? "bg-blue-800 text-white hover:bg-blue-800"
                : "text-blue-600"
            }`}
            onClick={() => setSelectedGrid("Files")}>
            Files
          </button>
          {role == "admin" && (
            <button
              className={`p-2 border border-blue-600  ${
                selectedGrid === "Users"
                  ? "bg-blue-800 text-white hover:bg-blue-800"
                  : "text-blue-600"
              }`}
              onClick={() => setSelectedGrid("Users")}>
              Users
            </button>
          )}

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
      </div>
      <div className='w-full max-w-4xl text-2xl p-1 text-center underline font-bold bg-white rounded-t-lg'>
        {projectName}
      </div>
      {selectedGrid === "Timeline" && (
        <TimelineGrid
          timelineItems={timelineItems}
          setTimelineItems={setTimelineItems}
          projectId={projectId}
        />
      )}
      {selectedGrid === "Contacts" && (
        <ContactsGrid
          contacts={contacts}
          setContacts={setContacts}
          projectId={projectId}
        />
      )}
      {selectedGrid === "Tasks" && (
        <TaskGrid
          tasks={tasks}
          setTasks={setTasks}
          projectName={projectName}
          projectId={projectId}
        />
      )}
      {selectedGrid === "Files" && (
        <FilesGrid
          projectId={projectId}
          projectName={projectName}
          files={files}
          setFiles={setFiles}
        />
      )}
      {role && role == "admin" && selectedGrid === "Users" && (
        <UsersGrid projectId={projectId} users={users} setUsers={setUsers} />
      )}
      {selectedGrid === "Map" && (
        <MapComponent
          projectId={projectId}
          projectName={projectName}
          files={files}
        />
      )}
    </main>
  );
}
