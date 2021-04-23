import mongoose from 'mongoose'
import { v2 } from 'cloudinary'

//connect to db 

async function dbConnect() {

  //return if connetcion exist 

  if (mongoose.connection.readyState >= 1) {
    return
  }

  v2.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME
  });

  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export default dbConnect
