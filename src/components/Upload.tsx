// pages/upload.js

import { useState } from "react";
import AWS from "aws-sdk";

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

    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${projectNumber}/${projectNumber}.kmz`,
      Body: selectedFile,
    };

    const options = {
      partSize: 10 * 1024 * 1024, // 10 MB part size
      queueSize: 1, // Number of parallel uploads
    };

    s3.upload(params, options)
      .on("httpUploadProgress", (progress) => {
        setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
      })
      .send((err: any, data: any) => {
        if (err) {
        } else {
          setSelectedFile(null);
        }
        setUploading(false);
      });
  };

  return (
    <div className='bg-white w-full p-1 flex justify-around rounded-t-lg'>
      <input
        type='file'
        accept='.kmz, application/vnd.google-earth.kmz'
        onChange={handleFileChange}
      />
      <button className='' onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Update KMZ"}
      </button>
      {uploading && <div>Progress: {uploadProgress}%</div>}
    </div>
  );
}
