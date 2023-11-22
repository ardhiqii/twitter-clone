import { CustomSession } from "@/pages/api/auth/[...nextauth]";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useUserInfo = () => {
  const { data, status: sessionStatus } = useSession();
  const [userInfo, setUserInfo] = useState<UserSession | null>();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const getUserInfo = async () => {
      console.log(sessionStatus);
      if (sessionStatus === "loading") {
        return;
      }
      if (data && data.user && "id" in data.user) {
        const uri = "/api/users?id=" + data?.user?.id;
        const resp = await (await fetch(uri)).json();
        setUserInfo(resp.user);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        return;
      }
    };
    getUserInfo();
  }, [sessionStatus, data]);

  return { userInfo, setUserInfo, status };
};

export default useUserInfo;

export interface UserSession {
  _id: string
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
  cover?: string
  bio?:string
}
