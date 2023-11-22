import { NextApiRequest, NextApiResponse } from "next";
import { initMongoose } from "../../../lib/mongoose";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Follower } from "../../../models/Follower";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await initMongoose();
  const session: CustomSession | null = await getServerSession(
    req,
    res,
    authOptions
  );
  const {destination} = req.body

  const existingFollow = await Follower.findOne({destination, source: session?.user?.id})
  
  if (existingFollow){
    existingFollow.deleteOne()
    res.status(200).json({message: "Successfully unfollow"})
  }else{
    const f = await Follower.create({destination, source: session?.user?.id})
    res.status(200).json({f})
  }

}

export default handler