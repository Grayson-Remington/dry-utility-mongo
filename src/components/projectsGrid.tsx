import {
  DataGrid,
  GridRowModes,
  GridRowEditStopReasons,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowModesModel,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import { TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {},
  "& .MuiAccordionSummary-content": {
    flexGrow: 0,
    justifyContent: "center",
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));
export default function ProjectsGrid({
  projects,
  setProjects,
  setLoading,
}: any) {
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
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setProjects(projects.filter((row: any) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = projects.find((row: any) => row.id === id);
    if (editedRow!.isNew) {
      setProjects(projects.filter((row: any) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    setProjects(
      projects.map((row: any) => (row.id === newRow.id ? updatedRow : row))
    );
    console.log(updatedRow);
    try {
      const response = await fetch("/api/updateProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: updatedRow.projectName,
          projectNumber: updatedRow.projectNumber,
          id: updatedRow.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data, "update reply");
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns: GridColDef[] = [
    {
      field: "projectName",
      headerName: "Project Name",
      width: 500,
      editable: true,
      renderCell: (params) => (
        <Link
          onClick={() => setLoading(true)}
          className='hover:bg-blue-200 hover:font-bold hover:text-lg border border-gray-300 rounded-lg w-full text-center  p-3 hover:scale-105 transition-transform'
          href={{
            pathname: `/${params.row.projectName}`,
            query: {
              projectName: params.row.projectName,
              projectId: params.row.id,
              projectNumber: params.row.projectNumber,
              role: params.row.users.find(
                (user: any) => user.email === session?.user?.email
              ).role,
            },
          }}
          as={`/${params.row.projectName}`}>
          {params.row.projectName}
        </Link>
      ),
      flex: 3,
      minWidth: 200,
      headerAlign: "center",
    },
    {
      field: "projectNumber",
      headerName: "Project Number",
      editable: true,

      width: 500,
      renderCell: (params) => <>{params.row.projectNumber}</>,
      flex: 1,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(params.row.id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<CancelIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(params.row.id)}
              color='inherit'
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key='1'
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(params.row.id)}
            color='inherit'
          />,
          <GridActionsCellItem
            key='2'
            icon={<DeleteIcon />}
            label='Delete'
            onClick={() =>
              deleteProject(params.row.id, params.row.projectNumber)
            }
            color='inherit'
          />,
        ];
      },
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
  const addProject = async (newItem: any) => {
    try {
      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: newItem.projectName,
          projectNumber: newItem.projectNumber,
          id: newItem.id,
          email: session!.user!.email,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        toast.success("Successfully added project");
        setProjects((prevData: any) => [...prevData, newItem]);

        setProjectFormData({
          projectNumber: "",
          projectName: "",
        });
      } else {
        console.error("Failed to sign up");
        toast.error("Failed to add project");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const deleteProject = async (id: any, projectNumber: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteProject", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, projectNumber: projectNumber }),
          });

          if (response.ok) {
            const data = await response.json();
            setProjects(projects!.filter((obj: any) => obj.id !== id));
            toast.success("Successfully deleted project");
          } else {
            console.error("Failed to sign up");
            toast.success("Failed to delete project");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      })
      .catch(() => {
        /* ... */
      });
  };
  const [projectFormData, setProjectFormData] = useState({
    projectNumber: "",
    projectName: "",
  });
  const handleProjectInputChange = (e: any) => {
    const { name, value } = e.target;
    setProjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleProjectSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    const newItem = {
      projectName: projectFormData.projectName,
      projectNumber: projectFormData.projectNumber,
      id: Math.floor(Math.random() * 1000000000),
      users: [{ email: session?.user?.email, role: "admin" }],
    };
    addProject(newItem);
    // Update the state by creating a new array with the new item
  };
  return (
    <>
      {status === "authenticated" && projects && (
        <div className='max-w-4xl bg-white rounded-lg w-full p-3'>
          <Accordion>
            <AccordionSummary
              sx={{
                root: {
                  flexDirection: "column",
                },
                content: {
                  marginBottom: 0,
                },
                expandIcon: {
                  marginRight: 0,
                  paddingTop: 0,
                },
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1-content'
              id='panel1-header'>
              Add Project
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleProjectSubmit}>
                <div className='w-full flex gap-2 p-1 border-black'>
                  <TextField
                    id='outlined-basic'
                    label='Project Name'
                    variant='outlined'
                    name='projectName' // Add name attribute to identify the input in handleInputChange
                    value={projectFormData.projectName}
                    onChange={handleProjectInputChange}
                    required
                    className='border border-black rounded-md w-full'
                  />
                  <TextField
                    id='outlined-basic'
                    label='Project Number'
                    variant='outlined'
                    name='projectNumber' // Add name attribute to identify the input in handleInputChange
                    value={projectFormData.projectNumber}
                    onChange={handleProjectInputChange}
                    required
                    className='border border-black rounded-md w-full'
                  />

                  <button
                    type='submit'
                    className=' hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                    Add
                  </button>
                </div>
              </form>
            </AccordionDetails>
          </Accordion>

          <div style={{ height: 500, width: "100%" }}>
            {projects && (
              <DataGrid
                getRowId={getRowId}
                rows={projects}
                columns={columns}
                editMode='row'
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slotProps={{
                  toolbar: { setProjects, setRowModesModel },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 10]}
              />
            )}
            {/* {projects.map((project) => (
          <div className='flex w-full max-w-xl' key={project._id}>
            <Link
              className='hover:bg-gray-200 border w-2/3 text-center border-black rounded-lg m-1 p-2'
              href={`/${project.projectNumber}`}
              as={`/${project.projectNumber}`}>
              {project.projectNumber}
            </Link>
            <button
              onClick={() => deleteProject(project._id, project.projectNumber)}>
              Delete
            </button>
          </div>
          // Replace 'name' with the property you want to display
        ))} */}
          </div>
        </div>
      )}
    </>
  );
}
