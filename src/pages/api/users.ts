import { NextApiRequest, NextApiResponse } from "next";
import { initMongoose } from "../../../lib/mongoose";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import { Follower } from "../../../models/Follower";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await initMongoose();
  const session: CustomSession | null = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const { id, username } = req.query;
    const user = id
      ? await User.findOne({ _id: id })
      : await User.findOne({ username });
    const follow = await Follower.findOne({source:session?.user?.id,destination: user._id})
    res.json({ user,follow });
  }

  if (req.method === "PUT") {
    const { username } = req.body;
    if (session && session.user && "id" in session.user) {
      await User.findByIdAndUpdate(session?.user?.id, { username });
      res.json("ok");
    }
    res.json("failed to get session");
  }
}
