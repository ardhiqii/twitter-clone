import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  username: String,
  cover:String,
  bio:String
})


const User = models.User ||  model("User", UserSchema)

export default User;