import { ethers } from "ethers";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { messageAbi, messageBsc, messageMumbai } from "../contractABIs/message";

dotenv.config();

export const readDataMumbai = async (req: Request, res: Response) => {
  const name = req.query.name as string;
  let messageFromMumbai;
  let documentFromMumbai;
  if (name) {
    messageFromMumbai = await readMessageMumbai(name);
    documentFromMumbai = await readDocsMumbai(name);
  }
  // return {
  //   messageFromMumbai,
  //   documentFromMumbai,
  // };

  res.status(201).json({
    status: "success",
    data: {
      messageFromMumbai,
      documentFromMumbai,
    },
  });
};

export const readDataBsc = async (req: Request, res: Response) => {
  const name = req.query.name as string;
  let messageFromBsc;
  let documentFromBsc;
  if (name) {
    messageFromBsc = await readMessageBsc(name);
    documentFromBsc = await readDocsBsc(name);
  }

  res.status(201).json({
    status: "success",
    data: {
      messageFromBsc,
      documentFromBsc,
    },
  });
};

export const readMessageMumbaiBsc = async (req: Request, res: Response) => {
  const name = req.query.name;
  const providerMumbai = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_PROVIDER
  );
  const providerBsc = new ethers.providers.JsonRpcProvider(
    process.env.BSC_PROVIDER
  );
  const messageMumbai_r = new ethers.Contract(
    messageMumbai,
    messageAbi,
    providerMumbai
  );
  const messageBsc_r = new ethers.Contract(messageBsc, messageAbi, providerBsc);

  const messageFromMumbai = await messageMumbai_r.getMessage(name);
  const messageFromBsc = await messageBsc_r.getMessage(name);

  res.status(201).json({
    status: "success",
    data: {
      messageFromMumbai,
      messageFromBsc,
    },
  });
  //   console.log(id);

  //   res.status(201).json({
  //     status: "success",
  //     data: "ok",
  //   });
};

export const readDocsMumbaiBsc = async (req: Request, res: Response) => {
  const name = req.query.name;
  const providerMumbai = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_PROVIDER
  );
  const providerBsc = new ethers.providers.JsonRpcProvider(
    process.env.BSC_PROVIDER
  );
  const messageMumbai_r = new ethers.Contract(
    messageMumbai,
    messageAbi,
    providerMumbai
  );
  const messageBsc_r = new ethers.Contract(messageBsc, messageAbi, providerBsc);

  const documentFromMumbai = await messageMumbai_r.getDocument(name);
  const documentFromBsc = await messageBsc_r.getDocument(name);

  res.status(201).json({
    status: "success",
    data: {
      documentFromMumbai,
      documentFromBsc,
    },
  });
};

export const readMessageMumbai = async (name: string) => {
  const providerMumbai = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_PROVIDER
  );

  const messageMumbai_r = new ethers.Contract(
    messageMumbai,
    messageAbi,
    providerMumbai
  );

  const messageFromMumbai = await messageMumbai_r.getMessage(name);
  return messageFromMumbai;
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     messageFromMumbai,
  //   },
  // });
};

export const readMessageBsc = async (name: string) => {
  const providerBsc = new ethers.providers.JsonRpcProvider(
    process.env.BSC_PROVIDER
  );

  const messageBsc_r = new ethers.Contract(messageBsc, messageAbi, providerBsc);

  const messageFromBsc = await messageBsc_r.getMessage(name);
  return messageFromBsc;
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     messageFromBsc,
  //   },
  // });
};

export const readDocsMumbai = async (name: string) => {
  const providerMumbai = new ethers.providers.JsonRpcProvider(
    process.env.MUMBAI_PROVIDER
  );

  const messageMumbai_r = new ethers.Contract(
    messageMumbai,
    messageAbi,
    providerMumbai
  );

  const documentFromMumbai = await messageMumbai_r.getDocument(name);
  return documentFromMumbai;
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     documentFromMumbai,
  //   },
  // });
};

export const readDocsBsc = async (name: string) => {
  const providerBsc = new ethers.providers.JsonRpcProvider(
    process.env.BSC_PROVIDER
  );

  const messageBsc_r = new ethers.Contract(messageBsc, messageAbi, providerBsc);

  const documentFromBsc = await messageBsc_r.getDocument(name);
  return documentFromBsc;
  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     documentFromBsc,
  //   },
  // });
};
