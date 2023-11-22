import React, { FC } from "react";
import EditableImage from "./EditableImage";

const Avatar: FC<AvatarProps> = ({
  src,
  big = false,
  onChange,
  editable = false,
}) => {
  const widthStyle = big ? "w-24 h-24" : "w-12 h-12";
  return (
    <div className="rounded-full overflow-hidden">
      <EditableImage
        src={src}
        onChange={onChange}
        customStyle={widthStyle}
        editable={editable}
        type={"image"}
      />
    </div>
  );
};

export default Avatar;

interface AvatarProps {
  src: string;
  big?: boolean;
  onChange?: (src:string,type:string) => void
  editable?:boolean
}
