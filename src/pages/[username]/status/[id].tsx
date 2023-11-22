import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import PostContent from "../../../../components/PostContent";
import { PostInterface } from "@/pages";
import Layout from "../../../../components/Layout";
import useUserInfo from "../../../../hooks/useUserInfo";
import PostForm from "../../../../components/PostForm";
import TopNavLink from "../../../../components/TopNavLink";

const PostPage = () => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { id } = router.query;
  const [post, setPost] = useState<PostInterface>();
  const [likedByMe, setLikedByMe] = useState(false);

  const [replies, setReplies] = useState<PostInterface[]>([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (id) {
      setLoading(true);
      const { data: dataPost } = await axios.get("/api/posts?id=" + id);
      setPost(dataPost.post);
      
      const { data: dataLike } = await axios.get("/api/like?id=" + id);
      setLikedByMe(dataLike.liked);

      const { data: dataReplies } = await axios.get("/api/posts?parent=" + id);
      setReplies(dataReplies.posts);
      setRepliesLikedByMe(dataReplies.idsLikedByMe);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [id, fetchPost]);

  if (loading) {
    return "loading data post";
  }

  return (
    <Layout>
      <div className="p-5 p-y">
        <TopNavLink />
        {post && post.parent && (
          <div className="">
            <PostContent {...post.parent} likedByMe={false} isParent={true} />
          </div>
        )}
        {post && (
          <PostContent
            {...post}
            big={true}
            likesCount={post.likesCount}
            likedByMe={likedByMe}
          />
        )}
        {!!userInfo && (
          <PostForm onPost={fetchPost} compact={true} parent={id as string} />
        )}
      </div>
      <div className="flex flex-col ">
        {replies.length == 0 && (
          <div className="border-t border-twitterBorder"></div>
        )}
        {replies.length > 0 &&
          replies.map((reply, i) => (
            <div className="border-t border-twitterBorder p-5" key={reply._id}>
              <PostContent
                {...reply}
                likedByMe={repliesLikedByMe.includes(reply._id)}
              />
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default PostPage;
