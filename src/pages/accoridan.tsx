import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
export default function BasicAccordion({ projectNumber, tasks }: any) {
  const [power, setPower] = useState<any[]>([]);
  const [gas, setGas] = useState<any[]>([]);
  const [telco, setTelco] = useState<any[]>([]);

  const [powerFormData, setPowerFormData] = useState({
    date: "",
    text: "",
  });
  const [gasFormData, setGasFormData] = useState({
    date: "",
    text: "",
  });
  const [telcoFormData, setTelcoFormData] = useState({
    date: "",
    text: "",
  });
  const deleteTask = async (_id: any) => {
    try {
      const response = await fetch("/api/deleteTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: _id,
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
  const addTask = async (newItem: any) => {
    try {
      const response = await fetch("/api/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectNumber: projectNumber,
          taskClass: newItem.taskClass,
          date: newItem.date,
          text: newItem.text,
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
  useEffect(() => {
    // Function to categorize tasks
    if (tasks) {
      const categorizeTasks = () => {
        tasks.forEach((task: any) => {
          switch (task.taskClass) {
            case "power":
              setPower((prevPowerTasks) => [...prevPowerTasks, task]);
              break;
            case "gas":
              setGas((prevGasTasks) => [...prevGasTasks, task]);
              break;
            case "telco":
              setTelco((prevTelcoTasks) => [...prevTelcoTasks, task]);
              break;
            // Add more cases as needed
            default:
              break;
          }
        });
      };

      // Call the categorization function
      categorizeTasks();
    }
  }, [tasks]);
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
  const removePowerItemAtIndex = (index: any) => {
    if (index < 0 || index >= power.length) {
      console.error("Invalid index");
      return; // Return without updating the state if the index is invalid
    }

    // Create a new array without the item at the specified index
    const newArray = [...power.slice(0, index), ...power.slice(index + 1)];

    // Update the state with the new array
    setPower(newArray);
  };
  const handlePowerInputChange = (e: any) => {
    const { name, value } = e.target;
    setPowerFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePowerSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", powerFormData);
    const newItem = {
      projectNumber: projectNumber,
      taskClass: "power",
      date: powerFormData.date,
      text: powerFormData.text,
    };
    addTask(newItem);
    // Update the state by creating a new array with the new item
    setPower((prevData) => [...prevData, newItem]);
  };
  const removeGasItemAtIndex = (index: any) => {
    if (index < 0 || index >= gas.length) {
      console.error("Invalid index");
      return; // Return without updating the state if the index is invalid
    }

    // Create a new array without the item at the specified index
    const newArray = [...gas.slice(0, index), ...gas.slice(index + 1)];

    // Update the state with the new array
    setGas(newArray);
  };
  const handleGasInputChange = (e: any) => {
    const { name, value } = e.target;
    setGasFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGasSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", gasFormData);
    const newItem = {
      projectNumber: projectNumber,
      taskClass: "gas",
      date: gasFormData.date,
      text: gasFormData.text,
    };
    addTask(newItem);
    // Update the state by creating a new array with the new item
    setGas((prevData) => [...prevData, newItem]);
  };
  const removeTelcoItemAtIndex = (index: any) => {
    if (index < 0 || index >= telco.length) {
      console.error("Invalid index");
      return; // Return without updating the state if the index is invalid
    }

    // Create a new array without the item at the specified index
    const newArray = [...telco.slice(0, index), ...telco.slice(index + 1)];

    // Update the state with the new array
    setTelco(newArray);
  };
  const handleTelcoInputChange = (e: any) => {
    const { name, value } = e.target;
    setTelcoFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTelcoSubmit = (e: any) => {
    e.preventDefault();
    // You can now access the formData object and perform any actions (e.g., send data to the server)
    console.log("Form submitted:", telcoFormData);
    const newItem = {
      projectNumber: projectNumber,
      taskClass: "telco",
      date: telcoFormData.date,
      text: telcoFormData.text,
    };
    addTask(newItem);
    // Update the state by creating a new array with the new item
    setTelco((prevData) => [...prevData, newItem]);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <div className=' h-full w-full flex items-center justify-between pr-4'>
            <div>Power</div>
            <div className='flex h-full items-center text-xs'>
              Complete
              <div className='rounded-full w-4 h-4 bg-green-500 ml-2'></div>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          {power
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((item, index) => (
              <div
                key={index}
                className='w-full flex gap-2 py-1 border-b border-black items-center justify-between'>
                <div className='flex gap-2 py-1 items-center'>
                  <div className='border-r h-full pr-1 border-black font-bold'>
                    {formatDate(item.date)}
                  </div>
                  <div>{item.text}</div>
                </div>

                <button
                  className='border rounded-md justify-self-end'
                  onClick={() => {
                    removePowerItemAtIndex(index), deleteTask(item._id);
                  }}>
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          <form onSubmit={handlePowerSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className='border-r h-full pr-1 border-black font-bold'>
                <input
                  type='date'
                  name='date' // Add name attribute to identify the input in handleInputChange
                  value={powerFormData.date}
                  onChange={handlePowerInputChange}
                  required
                />
              </div>
              <input
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={powerFormData.text}
                onChange={handlePowerInputChange}
                className='border border-black rounded-md w-full'
                required
              />
              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <div className=' h-full w-full flex items-center justify-between pr-4'>
            <div>Gas</div>
            <div className='flex h-full items-center text-xs'>
              Engineering
              <div className='rounded-full w-4 h-4 bg-red-500 ml-2'></div>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          {gas
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((item, index) => (
              <div
                key={index}
                className='w-full flex gap-2 py-1 border-b border-black items-center justify-between'>
                <div className='flex gap-2 py-1 items-center'>
                  <div className='border-r h-full pr-1 border-black font-bold'>
                    {formatDate(item.date)}
                  </div>
                  <div>{item.text}</div>
                </div>

                <button
                  className='border rounded-md justify-self-end'
                  onClick={() => removeGasItemAtIndex(index)}>
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          <form onSubmit={handleGasSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className='border-r h-full pr-1 border-black font-bold'>
                <input
                  type='date'
                  name='date' // Add name attribute to identify the input in handleInputChange
                  value={gasFormData.date}
                  onChange={handleGasInputChange}
                  required
                />
              </div>
              <input
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={gasFormData.text}
                onChange={handleGasInputChange}
                className='border border-black rounded-md w-full'
                required
              />
              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'>
          <div className=' h-full w-full flex items-center justify-between pr-4'>
            <div>Telco</div>
            <div className='flex h-full items-center text-xs'>
              Contact
              <div className='rounded-full w-4 h-4 bg-yellow-500 ml-2'></div>
            </div>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          {telco
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((item, index) => (
              <div
                key={index}
                className='w-full flex gap-2 py-1 border-b border-black items-center justify-between'>
                <div className='flex gap-2 py-1 items-center'>
                  <div className='border-r h-full pr-1 border-black font-bold'>
                    {formatDate(item.date)}
                  </div>
                  <div>{item.text}</div>
                </div>

                <button
                  className='border rounded-md justify-self-end'
                  onClick={() => removeTelcoItemAtIndex(index)}>
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          <form onSubmit={handleTelcoSubmit}>
            <div className='w-full flex gap-2 py-1 border-b border-black'>
              <div className='border-r h-full pr-1 border-black font-bold'>
                <input
                  type='date'
                  name='date' // Add name attribute to identify the input in handleInputChange
                  value={telcoFormData.date}
                  onChange={handleTelcoInputChange}
                  required
                />
              </div>
              <input
                type='text'
                name='text' // Add name attribute to identify the input in handleInputChange
                value={telcoFormData.text}
                onChange={handleTelcoInputChange}
                className='border border-black rounded-md w-full'
                required
              />
              <button type='submit' className='border border-black rounded-lg'>
                Add
              </button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
