import axios from "axios";
import React, { DragEvent, useState } from "react";
import { FileDrop } from "react-file-drop";
import { PulseLoader } from "react-spinners";

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  onChange,
  type,
  customStyle,
  editable = false,
}) => {
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateImage = async (
    files: FileList | null,
    e: DragEvent<HTMLDivElement>
  ) => {
    if (!editable || !onChange) {
      return;
    }
    e.preventDefault();
    if (!files) {
      return;
    }

    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append(type, files[0]);
    try {
      const { data: dataUpload } = await axios.post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uri = dataUpload.user[type];

      onChange(uri, type);
      setIsUploading(false);
    } catch (e) {
      console.error("Error sending file:", e);
    }
  };

  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
    >
      <div
        className={
          "flex items-center overflow-hidden bg-twitterBorder relative " +
          customStyle
        }
      >
        <div
          className={
            "absolute inset-0 " +
            (isFileOver && editable ? "bg-blue-200 opacity-50" : "")
          }
        ></div>
        {isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(8, 8, 8, 0.767)" }}
          >
            <PulseLoader size={14} color="rgba(255, 255, 255, 0.751)0.767)" />
          </div>
        )}
        {src && <img src={src} className="w-full h-full object-cover" alt="" />}
      </div>
    </FileDrop>
  );
};

export default EditableImage;

interface EditableImageProps {
  src: string;
  onChange?: (src: string, type: string) => void;
  type: string;
  customStyle: string;
  editable: boolean;
}
