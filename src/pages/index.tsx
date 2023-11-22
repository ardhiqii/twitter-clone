import { Inter } from "next/font/google";
import UsernameForm from "../../components/UsernameForm";
import useUserInfo from "../../hooks/useUserInfo";
import PostForm from "../../components/PostForm";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "../../components/PostContent";
import Layout from "../../components/Layout";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [idsLikedByMe, setIdsLikeByMe] = useState<string[]>([]);
  const router = useRouter()

  const fetchPosts = async () => {
    const { data } = await axios.get("/api/posts");
    setPosts(data.posts);
    setIdsLikeByMe(data.idsLikedByMe);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const logout = async () => {
    setUserInfo(null);
    await signOut();
  };

  if (userInfoStatus === "loading") {
    return "loading user info";
  }
  if(!userInfo){
    router.push('/login')
    return "no user info"
  }
  if (!userInfo.username) {
    return <UsernameForm />;
  }
  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm onPost={fetchPosts} />
      <div className="">
        {posts &&
          posts.length > 0 &&
          posts.map((post, i) => (
            <div key={post._id} className="border-t border-twitterBorder p-5">
              {post.parent && (
                <div>
                  <PostContent {...post.parent} likedByMe={false} isParent={true}/>
                </div>
              )}
              <PostContent
                {...post}
                likedByMe={idsLikedByMe.includes(post._id)}
              />
            </div>
          ))}
      </div>
      {userInfo && (
        <div className="p-5 text-center border-t border-twitterBorder">
          <button
            onClick={logout}
            className="bg-twitterWhite text-black px-5 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      )}
    </Layout>
  );
}

export interface PostInterface {
  text?: string | null;
  _id: string;
  author?: author
  createdAt?: number | Date;
  likesCount: number;
  parent?: PostInterface | null
  commentsCount:number
}

interface author{
  name: string;
  email: string;
  image: string;
  username: string;
};