import mongoose from "mongoose";


const MONGO_URL = "mongodb+srv://Namrata:sairam.12@cluster0.oenkn.mongodb.net/Constraction_Website";
const connectDB = async()=>
{
    try{
          const conn  = await mongoose.connect(MONGO_URL);
          console.log(`connected to mongodb database ${conn.connection.host}`)
    }
    catch(error)
    {
         console.log(`error in mongodb ${error}`)
    }
}

export default connectDB;