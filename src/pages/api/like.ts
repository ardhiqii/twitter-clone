import { NextApiRequest, NextApiResponse } from "next";
import { initMongoose } from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import Like from "../../../models/Like";
import Post from "../../../models/Post";

const updateLikeCount = async (postId:string) => {
  const post = await Post.findById(postId);
  post.likesCount = await Like.countDocuments({ post: postId });
  await post.save();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await initMongoose();
  const session: CustomSession | null = await getServerSession(
    req,
    res,
    authOptions
  );
  const postId = req.body.id;
  const userId = session?.user?.id;

  if (req.method === "GET") {
    const { id } = req.query;
    const existingLike = await Like.findOne({ author: userId, post: id });
    if(existingLike){
      res.status(200).json({liked:true})
    }else{
      res.status(200).json({liked:false})
    }
  }

  if (req.method === "POST") {
    const existingLike = await Like.findOne({ author: userId, post: postId });
    if (existingLike) {
      await existingLike.deleteOne();
      await updateLikeCount(postId);
      res.status(200).json("successfully removed");
    } else {
      const like = await Like.create({ author: userId, post: postId });
      await updateLikeCount(postId);
      res.status(201).json({ like, message: "Successfully created like" });
    }
  }

  res.status(500).json("Something wrong, probably in postid,userid");
};

export default handler;
