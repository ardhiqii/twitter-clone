import { PostInterface } from "@/pages";
import Link from "next/link";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import moment from "moment";
import PostButtons from "./PostButtons";

const PostContent: React.FC<PostContentProps> = ({
  text,
  author,
  createdAt,
  _id,
  big = false,
  likesCount,
  likedByMe,
  commentsCount,
  images,
  isParent = false,
}) => {
  const formattedDate = moment(createdAt).format("h.mm A · D MMM YYYY");
  const showImages = () => {
    if (!images || images.length <= 0) {
      return "";
    }
    return (
      <div className="flex gap-1 h-56 my-2">
        {images?.length > 0 &&
          images?.map((img, i) => (
            <div key={i}>
              <img src={img} alt="" className="h-full"/>
            </div>
          ))}
      </div>
    );
  };
  return (
    <div className="flex-co">
      <div className="flex gap-x-2 ">
        <div className="">
          {author && (
            <Link href={"/" + author?.username}>
              <Avatar src={author.image} />
            </Link>
          )}
          {isParent && (
            <div className="w-0.5 h-16 bg-twitterBorder m-auto mt-2 mb-1"></div>
          )}
        </div>
        <div className="w-full">
          <div className={"flex gap-x-1" + (big ? " flex-col" : "")}>
            <Link href={"/" + author?.username}>
              <span className="font-bold">{author?.name}</span>
            </Link>
            <Link href={"/" + author?.username}>
              <span className="text-twitterLightGray">@{author?.username}</span>
            </Link>
            <span className="text-twitterLightGray">
              {createdAt && !big && (
                <>
                  · <ReactTimeAgo date={createdAt} timeStyle={"twitter"} />
                </>
              )}
            </span>
          </div>
          {!big && (
            <div className="">
              <Link href={`/${author?.username}/status/${_id}`}>
                <div className="">{text}
                {showImages()}
                </div>
              </Link>
              {author && (
                <PostButtons
                  username={author.username}
                  commentsCount={commentsCount}
                  likedByMeDefault={likedByMe}
                  likesCountDefault={likesCount}
                  id={_id}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {big && (
        <div className="mt-2 flex flex-col gap-y-2">
          <div className="">{text}</div>
          {showImages()}
          <div className="text-sm text-twitterLightGray">{formattedDate}</div>
          <div className="px-2 border-t border-b border-twitterBorder pt-2 pb-3">
            {author && (
              <PostButtons
                username={author.username}
                commentsCount={commentsCount}
                likedByMeDefault={likedByMe}
                likesCountDefault={likesCount}
                id={_id}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;

interface PostContentProps {
  text?: string | null;
  _id: string | null;
  author?: {
    name: string;
    email: string;
    image: string;
    username: string;
  };
  createdAt?: number | Date;
  big?: boolean;
  likesCount: number;
  likedByMe: boolean;
  commentsCount: number;
  isParent?: boolean;
  images?: [string];
}
