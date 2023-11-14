import mongoose from "mongoose";

let connection: typeof mongoose;

const url = process.env.MONGODB_URI!;

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url);
    }
    return connection;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default startDb;
