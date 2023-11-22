import axios from "axios";
import React, { DragEvent, FC, useState } from "react";
import { FileDrop } from "react-file-drop";
import { PulseLoader } from "react-spinners";
import EditableImage from "./EditableImage";

const Cover: FC<CoverProps> = ({src,onChange,editable}) => {
  return <>
  <EditableImage type="cover" src={src} onChange={onChange} customStyle={'h-36'} editable={editable}/>
  </>
};

export default Cover;


interface CoverProps{
  src: string
  onChange: (src:string,type:string)=>void
  editable:boolean
}