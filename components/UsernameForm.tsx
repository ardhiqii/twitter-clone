import React, { FormEvent, useEffect, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
import { useRouter } from "next/router";

const UsernameForm = () => {
  const { userInfo, status } = useUserInfo();
  const [username, setUsername] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (status !== "loading" && username === "") {
      let defaultName = userInfo?.email?.split("@")[0];
      defaultName = defaultName?.replace(/[^a-z]+/gi, "");
      if (defaultName) {
        setUsername(defaultName);
      }
    }

  }, [status, userInfo, username, router]);

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/users", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });
    router.reload()
  };

  if (status === "loading") {
    return "";
  }
  return (
    <div className="flex h-screen justify-center items-center">
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={handleSubmitForm}
      >
        <h1 className="text-xl">Pick a username</h1>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          value={username}
          className="bg-twitterBorder px-4 py-2 rounded-full"
        />
        <button className="w-full bg-twitterBlue px-4 py-2 rounded-full">
          Continue
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
