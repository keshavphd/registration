import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const connected = await connect("mongodb+srv://new2:new2@form.nupdd.mongodb.net/?retryWrites=true&w=majority&appName=form");
    if (connected) {
      console.log("Database successfully connected");
    }
  } catch (error) {
    console.log("Error in connecting database");
  }
};
export default connectDB;
