import mongoose from "mongoose";

export const connectToMongodb = async () => {
   try {
      if (mongoose.connection.readyState !== 1) {
         await mongoose.connect(process.env.MONGO_URL as string);
         console.log('Connected to MongoDB');
      } else {
         console.log('Already connected to MongoDB');
      }
   } catch (error: any) {
      console.log(error.message);
      throw ({ msg: "can't connect to MongoDb" })
   }
}
