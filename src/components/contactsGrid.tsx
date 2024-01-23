import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaRegTrashAlt } from "react-icons/fa";

export default function ContactsGrid({
  contacts,
  setContacts,
  projectNumber,
}: any) {
  const { data: session, status } = useSession();

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
      width: 130,
      cellClassName: (params) =>
        params.row.contactClass == "Power"
          ? "bg-red-500"
          : params.row.contactClass == "Gas"
          ? "bg-yellow-300"
          : params.row.contactClass == "Telco"
          ? "bg-orange-500"
          : "bg-purple-500",
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
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
          projectNumber: projectNumber,
          contactClass: newItem.contactClass,
          name: newItem.name,
          email: newItem.email,
          phoneNumber: newItem.phoneNumber,
          id: newItem.id,
        }),
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
    console.log("Form submitted:", contactFormData);
    const newItem = {
      projectNumber: projectNumber,
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
        console.log(data); // Handle success
      } else {
        console.error("Failed to sign up");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <>
      {status === "authenticated" && contacts && (
        <div className='max-w-4xl w-full bg-white rounded-lg p-1'>
          <form onSubmit={handleContactSubmit}>
            <div className='w-full flex items-center gap-2 py-1 border-b border-black'>
              <div className='border-r h-full pr-1 border-black font-bold'>
                <label htmlFor='' className='text-xs'>
                  Name
                </label>
                <input
                  type='text'
                  name='name' // Add name attribute to identify the input in handleInputChange
                  value={contactFormData.name}
                  className='border border-black rounded-md w-full'
                  onChange={handleContactInputChange}
                  required
                  placeholder='Name'
                />
                <label htmlFor='' className='text-xs'>
                  Email
                </label>
                <input
                  type='text'
                  name='email' // Add name attribute to identify the input in handleInputChange
                  value={contactFormData.email}
                  onChange={handleContactInputChange}
                  className='border border-black rounded-md w-full'
                  required
                  placeholder='Email'
                />
              </div>

              <div className='border-r h-full pr-1 border-black font-bold'>
                <label htmlFor='' className='text-xs'>
                  Phone Number
                </label>
                <input
                  type='text'
                  name='phoneNumber' // Add name attribute to identify the input in handleInputChange
                  value={contactFormData.phoneNumber}
                  onChange={handleContactInputChange}
                  className='border border-black rounded-md w-full'
                  required
                  placeholder='Phone Number'
                />
                <div className='flex flex-col'>
                  <label htmlFor='' className='text-xs py-1'>
                    Category
                  </label>
                  <select
                    className={`border border-black w-fit rounded-lg p-1  ${
                      contactFormData.contactClass == "Power"
                        ? "bg-red-500"
                        : contactFormData.contactClass === "Gas"
                        ? "bg-yellow-500"
                        : contactFormData.contactClass === "Telco"
                        ? "bg-orange-500"
                        : "bg-purple-500"
                    }`}
                    value={contactFormData.contactClass}
                    onChange={handleContactInputChange}
                    id='contactClass'
                    name='contactClass'>
                    <option className='bg-red-500' value='Power'>
                      Power
                    </option>
                    <option className='bg-yellow-500' value='Gas'>
                      Gas
                    </option>
                    <option className='bg-orange-500' value='Telco'>
                      Telco
                    </option>
                    <option className='bg-purple-500' value='Misc'>
                      Misc
                    </option>
                  </select>
                </div>
              </div>

              <button
                type='submit'
                className='border h-fit border-black rounded-lg p-1 hover:scale-105'>
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
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>
      )}
    </>
  );
}
