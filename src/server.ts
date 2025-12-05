import express from "express";
import config from "./config";
import { authRoute } from "./modules/auth/auth.route";
import initDB from "./config/database";

const app = express();

app.use(express.json());
initDB()

app.use("/api/v1/auth", authRoute);
  
app.listen(config.port, () => {
  console.log("server is running");
});
