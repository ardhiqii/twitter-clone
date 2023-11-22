import mongoose, { Schema, model, models } from "mongoose";

const FollowerSchema = new Schema({
  source: {type: mongoose.Types.ObjectId,required:true},
  destination:{type: mongoose.Types.ObjectId,required:true},
})

export const Follower = models.Follower || model('Follower',FollowerSchema)