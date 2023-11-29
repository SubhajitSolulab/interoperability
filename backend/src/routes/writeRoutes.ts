import express from "express";
import { handleDataWrite } from "../controllers/writeController";

const writeRouter = express.Router();

// writeRouter.post("/writeMessageMumbaiBsc", writeMessageMumbaiBsc);
// writeRouter.post("/writeDocumentMumbaiBsc", writeDocumentMumbaiBsc);
writeRouter.post("/handleDataWrite", handleDataWrite);
export default writeRouter;
