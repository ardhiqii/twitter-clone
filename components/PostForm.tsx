import React, { FormEvent, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import axios from "axios";
import Avatar from "./Avatar";
import Link from "next/link";
import Upload from "./Upload";
import { PulseLoader } from "react-spinners";

const PostForm: React.FC<PostFormProps> = ({
  onPost,
  parent,
  compact = false,
}) => {
  const { userInfo, status } = useUserInfo();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("/api/posts", { text, parent, images });
    setText("");
    setImages([]);
    onPost();
  };

  if (status === "loading") {
    return "";
  }
  return (
    <form
      className={"flex " + (compact ? "items-center mt-4 " : "mx-5")}
      onSubmit={handlePostSubmit}
    >
      <Link href={`/${userInfo?.username}`}>
        {userInfo && userInfo.image && <Avatar src={userInfo?.image} />}
      </Link>
      <div className={"grow pl-4 " + (compact && "flex items-center gap-x-2")}>
        <Upload onUploadFinish={(src) => setImages((prev) => [...prev, src])}>
          {(isUploading) => (
            <div className="">
              <textarea
                className={
                  "w-full bg-transparent text-twitterWhite resize-none " +
                  (compact && "h-10 mt-1")
                }
                placeholder={compact ? "Tweet your reply" : "What's happening?"}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex gap-2">
                {images.length > 0 &&
                  images.map((img, i) => (
                    <div key={i} className="h-24">
                      <img src={img} alt="" className="h-full" />
                    </div>
                  ))}
                {isUploading && (
                  <div className="h-24 w-24 bg-twitterBorder flex items-center justify-center">
                    <PulseLoader size={10} color="#fff" />
                  </div>
                )}
              </div>
            </div>
          )}
        </Upload>

        <div
          className={
            compact ? "" : "text-right border-t border-twitterBorder pt-2 pb-2"
          }
        >
          {!compact && (
            <button className="bg-twitterBlue px-5 py-1 rounded-full text-white">
              Tweet
            </button>
          )}
          {compact && (
            <button className="bg-twitterBlue px-5 py-1 rounded-full text-white">
              Tweet
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default PostForm;

interface PostFormProps {
  onPost: () => void;
  parent?: string;
  compact?: boolean;
}
