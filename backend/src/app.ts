// Importing module
import express from "express";
import readRouter from "./routes/readRoutes";
import writeRouter from "./routes/writeRoutes";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
//for handling files in req.files
app.use(fileUpload());
// // Handling GET / Request

app.use("/write", writeRouter);
app.use("/read", readRouter);
app.get("/test", (req, res) => {
  res.send("Welcome to typescript backend!");
});

//if no route hit till this point
//then user has hit a wrong end point
app.all("*", (req, res, next) => {
  res.send("Not matching routes");
});

export default app;
