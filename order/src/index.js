import connectDB from "./db/index.js";
import { app } from "./app.js";
import "dotenv/config";

connectDB()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!", err);
  });
