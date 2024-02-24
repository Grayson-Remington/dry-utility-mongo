// pages/upload.js

import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
export default function Upload(data: any) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  let { projectName, projectId } = data;

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
      alert("S3 bucket name is not set");
      return;
    }

    setUploading(true);

    let client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    console.log(selectedFile, "selectedFile");

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${projectName + "-" + projectId}/${selectedFile.name}`,
      Body: selectedFile,
    });

    try {
      const response = await client.send(command);
      console.log(response);
      setSelectedFile(undefined);
      setUploading(false);
    } catch (err) {
      console.error(err);
    }
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <div className='bg-white w-full p-3 flex justify-between'>
      <div>
        <Button
          component='label'
          role={undefined}
          variant='contained'
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput
            type='file'
            accept='.kmz, application/vnd.google-earth.kmz, .kml, application/vnd.google-earth.kml, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf'
            onChange={handleFileChange}
          />
        </Button>
        <div>Selected File: {selectedFile && selectedFile.name}</div>
      </div>
      <button
        onClick={uploadFile}
        disabled={uploading}
        className=' self-center max-w-xs hover:scale-105 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-4 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none'>
        Add
      </button>
    </div>
  );
}
