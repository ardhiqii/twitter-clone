import { NextApiRequest, NextApiResponse } from "next";
import { initMongoose } from "../../../lib/mongoose";
import Post from "../../../models/Post";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "./auth/[...nextauth]";
import Like from "../../../models/Like";
import { Follower } from "../../../models/Follower";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  initMongoose();
  const session: CustomSession | null = await getServerSession(
    req,
    res,
    authOptions
  );

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author").populate({
        path: "parent",
        populate: "author",
      });
      res.status(200).json({ post });
    } else {
      const parent = req.query.parent || null;
      const author = req.query.author;
      let searchFilter;
      if (!author && !parent) {
        const myFollows = await Follower.find({
          source: session?.user?.id,
        }).exec();
        const idsFollowed = myFollows.map((f) => f.destination);
        searchFilter = { author: [...idsFollowed, session?.user?.id] };
      }
      if (author) searchFilter = { author };
      if (parent) searchFilter = { parent };
      if (searchFilter) {
        const posts = await Post.find(searchFilter)
          .populate("author")
          .populate({
            path:'parent',
            populate:'author'
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .exec();

        const postsLikedByMe = await Like.find({
          author: session?.user?.id,
          post: posts.map((p) => p.id),
        });
        const idsLikedByMe = postsLikedByMe.map((like) => like.post);
        res.status(200).json({ posts, idsLikedByMe });
      }
    }
    res.status(500).json("something wrong either not getting id or else");
  }

  if (req.method === "POST") {
    const { text, parent,images } = req.body;
    if (session && session.user && "id" in session.user) {
      const post = await Post.create({
        author: session?.user.id,
        text,
        parent,
        images
      });
      if (parent) {
        const parentPost = await Post.findById(parent);
        parentPost.commentsCount = await Post.countDocuments({ parent });
        await parentPost.save();
      }
      res.status(200).json(post);
    }
    res
      .status(500)
      .json("encounter error, probably fail to get id user from session");
  }
};

export default handler;
