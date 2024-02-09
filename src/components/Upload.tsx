// pages/upload.js

import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export default function Upload(data: any) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  let { projectNumber } = data;

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
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${projectNumber}/${projectNumber}.kmz`,
      Body: selectedFile,
    });

    try {
      const response = await client.send(command);
      console.log(response);
      setSelectedFile(null);
      setUploading(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='bg-white w-full p-1 flex justify-around rounded-t-lg'>
      <input
        type='file'
        accept='.kmz, application/vnd.google-earth.kmz, .kml, application/vnd.google-earth.kml'
        onChange={handleFileChange}
      />
      <button className='' onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Update KMZ"}
      </button>
      {uploading && <div>Progress: {uploadProgress}%</div>}
    </div>
  );
}
