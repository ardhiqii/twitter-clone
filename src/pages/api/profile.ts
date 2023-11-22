import { NextApiRequest, NextApiResponse } from "next";
import { initMongoose } from "../../../lib/mongoose";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import User from "../../../models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initMongoose();
  const session: CustomSession | null = await getServerSession(
    req,
    res,
    authOptions
  );
  const { bio, name, username } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      session?.user?.id,
      { bio, name, username },
      { new: true }
    );
    res.status(201).json({ message: "Successfully update profile user", user });
  } catch (e) {
    console.error("Error update profile", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
