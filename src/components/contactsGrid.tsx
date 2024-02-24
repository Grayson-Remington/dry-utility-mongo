import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useConfirm } from "material-ui-confirm";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function ContactsGrid({
  contacts,
  setContacts,
  projectId,
}: any) {
  const { data: session, status } = useSession();
  const confirm = useConfirm();
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 130,
    },
    { field: "phoneNumber", headerName: "Phone Number", width: 130 },
    { field: "email", headerName: "Email", width: 130, flex: 1 },
    {
      field: "contactClass",
      headerName: "Category",
      width: 100,
      cellClassName: (params) =>
        params.row.contactClass == "Power"
          ? "bg-red-500"
          : params.row.contactClass == "Gas"
          ? "bg-yellow-300"
          : params.row.contactClass == "Telco"
          ? "bg-orange-500"
          : "bg-purple-500",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      renderCell: (params) => (
        <button className='p-2' onClick={() => deleteContact(params.row.id)}>
          <FaRegTrashAlt />
        </button>
      ),
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
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
  const addContact = async (newItem: any) => {
    try {
      const response = await fetch("/api/addContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          contactClass: newItem.contactClass,
          name: newItem.name,
          email: newItem.email,
          phoneNumber: newItem.phoneNumber,
          id: newItem.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    contactClass: "Power",
  });

  const handleContactInputChange = (e: any) => {
    const { name, value } = e.target;
    setContactFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleContactSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    const newItem = {
      projectId: projectId,
      contactClass: contactFormData.contactClass,
      name: contactFormData.name,
      email: contactFormData.email,
      phoneNumber: contactFormData.phoneNumber,
      id: Math.floor(Math.random() * 1000000000),
    };
    addContact(newItem);
    // Update the state by creating a new array with the new item
    setContacts((prevData: any) => [...prevData, newItem]);
  };
  const deleteContact = async (id: any) => {
    confirm({ description: "This action is permanent!" })
      .then(async () => {
        try {
          const response = await fetch("/api/deleteContact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
          });

          if (response.ok) {
            const data = await response.json();
            setContacts(contacts!.filter((obj: any) => obj.id !== id));
          } else {
            console.error("Failed to sign up");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      })
      .catch(() => {
        /* ... */
      });
  };
  return (
    <>
      {status === "authenticated" && contacts && (
        <div className='max-w-4xl w-full bg-white rounded-b-lg p-1'>
          <form onSubmit={handleContactSubmit}>
            <div className='w-full flex items-center gap-2 py-1 border-b border-black'>
              <TextField
                type='text'
                name='name' // Add name attribute to identify the input in handleInputChange
                value={contactFormData.name}
                onChange={handleContactInputChange}
                required
                className='border border-black rounded-md w-full'
                id='name'
                label='Name'
                variant='outlined'

                // Add name attribute to identify the input in handleInputChange
              />

              <TextField
                type='text'
                name='email' // Add name attribute to identify the input in handleInputChange
                value={contactFormData.email}
                onChange={handleContactInputChange}
                required
                className='border border-black rounded-md w-full'
                id='email'
                label='Email'
                variant='outlined'

                // Add name attribute to identify the input in handleInputChange
              />
              <TextField
                type='text'
                name='phoneNumber' // Add name attribute to identify the input in handleInputChange
                value={contactFormData.phoneNumber}
                onChange={handleContactInputChange}
                required
                className='border border-black rounded-md w-full'
                id='phoneNumber'
                label='Phone Number'
                variant='outlined'

                // Add name attribute to identify the input in handleInputChange
              />
              <FormControl fullWidth className='group max-w-48'>
                <InputLabel id='timelineItemClass-label'>
                  Timline Item Class
                </InputLabel>
                <Select
                  value={contactFormData.contactClass}
                  onChange={handleContactInputChange}
                  id='contactClass'
                  name='contactClass'
                  labelId='contactClass-label'
                  label='Contact Class'
                  className=''>
                  <MenuItem className='' value='Power'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Power</div>
                      <div className='rounded-full bg-red-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Gas'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Gas</div>
                      <div className='rounded-full bg-yellow-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Telco'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Telco</div>
                      <div className='rounded-full bg-orange-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                  <MenuItem className='' value='Misc'>
                    <div className='flex justify-between items-center w-full'>
                      <div>Misc</div>
                      <div className='rounded-full bg-purple-500 h-4 w-4'></div>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>

              <button
                type='submit'
                className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                Add
              </button>
            </div>
          </form>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              getRowId={getRowId}
              rows={contacts}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20]}
            />
          </div>
        </div>
      )}
    </>
  );
}
