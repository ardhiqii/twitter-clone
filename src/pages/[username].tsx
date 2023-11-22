import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import TopNavLink from "../../components/TopNavLink";
import axios from "axios";
import useUserInfo, { UserSession } from "../../hooks/useUserInfo";
import Cover from "../../components/Cover";
import Avatar from "../../components/Avatar";
import { PostInterface } from ".";
import PostContent from "../../components/PostContent";

const UserPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const { userInfo } = useUserInfo();

  const [profileInfo, setProfileInfo] = useState<UserSession | undefined>();

  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState<string[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserSession | undefined>();

  const [isFollowing,setIsFollowing] = useState(false)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) {
        return;
      }
      const { data: dataProfile } = await axios.get(
        "/api/users?username=" + username
      );
      setProfileInfo(dataProfile.user);
      setIsFollowing(!!dataProfile.follow)
      setLoading(false);
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      if (profileInfo) {
        const { data: dataPosts } = await axios.get(
          "/api/posts?author=" + profileInfo?._id
        );
        setPosts(dataPosts.posts);
        setPostsLikedByMe(dataPosts.idsLikedByMe);
      }
    };
    fetchData();
  }, [profileInfo]);

  const updateUserImageHandler = (src: string, type: string) => {
    setProfileInfo((prev) => {
      if (prev) {
        return { ...prev, [type]: src };
      }
    });
  };

  const updateProfile = async () => {
    const bio = tempProfile?.bio;
    const name = tempProfile?.name;
    const username = tempProfile?.username;
    await axios.put("/api/profile", {
      bio,
      name,
      username,
    });
    setProfileInfo(tempProfile)
    setTempProfile(undefined);
    setEditMode(false);
  };

  const editModeHandler = () => {
    if (editMode) {
      setEditMode(false);
      setTempProfile(undefined);
    } else {
      setEditMode(true);
      setTempProfile(profileInfo);
    }
  };

  const changeProfileHandler = (
    type: string,
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTempProfile((prev) => {
      if (prev) {
        return { ...prev, [type]: e.target.value };
      }
    });
  };

  const toggleFollow = async () =>{
    setIsFollowing(prev=> !prev)
    axios.post('/api/followers',{
      destination: profileInfo?._id
    })
  }

  if (loading) {
    return "loading profile" + username;
  }

  const isMyProfile = profileInfo?._id === userInfo?._id;

  return (
    <Layout>
      <div className="px-5 pt-2">
        {profileInfo && profileInfo.name && (
          <TopNavLink title={profileInfo.name} />
        )}
      </div>
      {profileInfo && (
        <Cover
          src={profileInfo.cover as string}
          onChange={updateUserImageHandler}
          editable={isMyProfile}
        />
      )}
      <div className="flex justify-between">
        <div className="ml-5 relative">
          <div className=" absolute -top-12 border-4 rounded-full  border-black overflow-hidden">
            {profileInfo && profileInfo.image && (
              <Avatar
                big
                src={profileInfo?.image}
                editable={isMyProfile}
                onChange={updateUserImageHandler}
              />
            )}
          </div>
        </div>

        <div className="p-2">
          {isMyProfile && (
            <div>
              {!editMode && (
                <button
                  onClick={editModeHandler}
                  className="text-white bg-black border-2 border-twitterBorder px-3 py-1 rounded-full font-bold"
                >
                  Edit Profile
                </button>
              )}
              {editMode && (
                <div className="flex gap-x-2">
                  <button
                    onClick={editModeHandler}
                    className="bg-red-600 text-white px-3 py-1 rounded-full font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={updateProfile}
                    className="bg-white text-black px-3 py-1 rounded-full font-bold"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
          {!isMyProfile && (
            <button onClick={toggleFollow} className={ "px-3 py-1 rounded-full font-bold " + (isFollowing ? " bg-black text-white border border-twitterBorder" : " bg-white text-black")}>
              {isFollowing ? 'Following' : 'Follow' }
            </button>
          )}
        </div>
      </div>
      <div className="px-5 mt-2">
        {!editMode && (
          <>
            <h1 className="font-bold text-xl leading-5">{profileInfo?.name}</h1>
            <h2 className="text-twitterLightGray text-sm">
              @{profileInfo?.username}
            </h2>
            <div className="text-sm mt-2 mb-2">{profileInfo?.bio}</div>
          </>
        )}

        {editMode &&
          tempProfile &&
          tempProfile.name &&
          tempProfile.username &&
          tempProfile.bio && (
            <div className="flex flex-col gap-y-2 mb-2">
              <div className="">
                <input
                  type="text"
                  className="bg-twitterBorder p-2 rounded-full"
                  value={tempProfile?.name}
                  onChange={changeProfileHandler.bind(this, "name")}
                />
              </div>
              <div className="">
                <input
                  type="text"
                  className="bg-twitterBorder p-2 rounded-full"
                  value={tempProfile?.username}
                  onChange={changeProfileHandler.bind(this, "username")}
                />
              </div>
              <textarea
                value={tempProfile.bio}
                onChange={changeProfileHandler.bind(this, "bio")}
                className="bg-twitterBorder p-2 rounded-2xl resize-none"
              />
            </div>
          )}
      </div>
      {posts.length > 0 &&
        posts.map((post) => (
          <div className="p-5 border-t border-twitterBorder" key={post._id}>
            <PostContent
              {...post}
              likedByMe={postsLikedByMe.includes(post._id)}
            />
          </div>
        ))}
    </Layout>
  );
};

export default UserPage;
