import axios from "axios";
import React, { DragEvent, ReactNode, useState } from "react";
import { FileDrop } from "react-file-drop";

const Upload: React.FC<UploadProps> = ({ children, onUploadFinish }) => {
  const [isFileOver, setIsFileOver] = useState(false);
  const [isFileNearby, setIsFileNearby] = useState(false)
  const [isUploading, setIsUploading] = useState(false);
  const uploadImage = async (files: FileList | null,
    e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!files) {
      return;
    }

    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append('post', files[0]);
    try {
      const { data: dataUpload } = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const src = dataUpload.post     
      onUploadFinish(src) 
      setIsUploading(false);
    } catch (e) {
      console.error("Error sending file:", e);
    }
  };
  return (
    <FileDrop
      onDrop={uploadImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={()=> setIsFileNearby(true)}
      onFrameDragLeave={()=>setIsFileNearby(false)}
      onFrameDrop={()=>{
        setIsFileNearby(false)
        setIsFileOver(false)
      }}
    >
      <div className="relative ">
        {(isFileOver || isFileNearby) && (
          <div className="bg-twitterBlue absolute inset-0 flex items-center justify-center">
            Drop your images here
          </div>
        )}
        {children(isUploading)}
      </div>
    </FileDrop>
  );
};

export default Upload;

interface UploadProps{
  children: (isUploading:boolean)=>ReactNode
  onUploadFinish: (src:string) => void
}