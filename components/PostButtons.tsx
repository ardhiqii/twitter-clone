import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import FlipNumbers from "react-flip-numbers";

const PostButtons: React.FC<PostButtonsProps> = ({
  username,
  id,
  likesCountDefault = 0,
  likedByMeDefault,
  commentsCount,
}) => {
  const [likesCount, setLikesCount] = useState(likesCountDefault);
  const [likedByMe, setLikedByMe] = useState(likedByMeDefault);
  // console.log("post buttons",likedByMeDefault);
  const toggleLike = async () => {
    const { data: dataFromAPI } = await axios.post("/api/like", { id });
    const like = dataFromAPI?.like;
    if (like) {
      setLikesCount((prev) => prev + 1);
      setLikedByMe(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setLikedByMe(false);
    }
  };
  return (
    <div className="w-full flex justify-between text-twitterLightGray text-sm mt-2">
      <Link href={`/${username}/status/${id}`}>
        <div className="flex items-center gap-x-1 ease-linear duration-200 hover:text-twitterBlue ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          <span>{commentsCount}</span>
        </div>
      </Link>
      <button className="flex items-center gap-x-1 ease-linear duration-200 hover:text-twitterGreen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
        <span>0</span>
      </button>
      <button
        className={
          "flex items-center gap-x-1 ease-linear duration-200 hover:text-twitterLove" +
          (likedByMe ? " text-twitterLove" : "")
        }
        onClick={toggleLike}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={"w-5 h-5 " + (likedByMe ? " fill-twitterLove" : "")}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>

        <span>
          <FlipNumbers
            height={12}
            width={12}
            color={likedByMe ? "twitterLove" : "twitterLightGray"}
            play
            perspective={100}
            numbers={likesCount.toString()}
          />
        </span>
      </button>
      <button className="flex items-center gap-x-1 ease-linear duration-200 hover:text-twitterBlue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
          />
        </svg>
        <span>0</span>
      </button>
      <button className="flex items-center gap-x-1 ease-linear duration-200 hover:text-twitterBlue">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default PostButtons;

interface PostButtonsProps {
  username: string;
  id: string | null;
  likesCountDefault: number;
  likedByMeDefault: boolean;
  commentsCount: number;
}
