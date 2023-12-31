import mongoose from "mongoose"

export const initMongoose = async () => {
  if (mongoose.connection.readyState === 1){
    return mongoose.connection.asPromise()
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
}

