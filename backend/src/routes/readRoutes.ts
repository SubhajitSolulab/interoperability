import express from "express";
import { readDataBsc, readDataMumbai } from "../controllers/readControllers";

const readRouter = express.Router();

readRouter.get("/readDataMumbai", readDataMumbai);
readRouter.get("/readDataBsc", readDataBsc);
export default readRouter;
