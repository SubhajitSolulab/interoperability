import { ethers } from "ethers";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { messageAbi, messageBsc, messageMumbai } from "../contractABIs/message";
import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";
import fileUpload from "express-fileupload";
dotenv.config();

export const handleDataWrite = async (req: Request, res: Response) => {
  // console.log(req.body);
  // console.log(req.files);

  const name: string = req.body.name;
  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Cannot proceed without name",
    });
  }

  const txMessage = await writeMessageMumbaiBsc(name, req.body.message);
  let txDocument;

  // const s = req.files;
  if (req.files) {
    const allowedMimeTypes = [
      "text/plain",
      "text/csv",
      "image/jpeg",
      "image/jpg",
    ];
    // Check if the file's mime type is in the list of allowed mime types
    //@ts-ignore
    if (!allowedMimeTypes.includes(req.files.document.mimetype)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid file type. Only .txt, .csv, .jpg, .jpeg files are allowed",
      });
    }
    txDocument = await writeDocumentMumbaiBsc(name, req.files);
  }
  // console.log(txMessage);

  res.status(201).json({
    status: "success",
    data: {
      txMessage,
      txDocument,
    },
  });
};

export const writeMessageMumbaiBsc = async (name: string, message: string) => {
  if (message) {
    const providerMumbai = new ethers.providers.JsonRpcProvider(
      process.env.MUMBAI_PROVIDER
    );
    const providerBsc = new ethers.providers.JsonRpcProvider(
      process.env.BSC_PROVIDER
    );
    const walletMumbai = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerMumbai
    );
    const walletBsc = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerBsc
    );

    const messageMumbai_rw = new ethers.Contract(
      messageMumbai,
      messageAbi,
      walletMumbai
    );
    const messageBsc_rw = new ethers.Contract(
      messageBsc,
      messageAbi,
      walletBsc
    );
    // const message = "First Hallo from polygon";
    const txMumbai = await messageMumbai_rw.setMessage(name, message);
    await txMumbai.wait();

    console.log("done from mumbai", txMumbai.hash);
    const gasPrice = walletBsc.getGasPrice();
    const gasLimit = messageBsc_rw.estimateGas.setMessage(name, message);
    const txBsc = await messageBsc_rw.setMessage(name, message, {
      gasLimit,
      gasPrice,
    });
    await txBsc.wait();
    console.log("done from bsc", txBsc.hash);

    return {
      txMessageMumbaiHash: txMumbai.hash,
      txMessageBscHash: txBsc.hash,
    };
  }
};

export const writeDocumentMumbaiBsc = async (
  name: string,
  file: fileUpload.FileArray | null | undefined
) => {
  if (file) {
    // List of allowed mime types
    // const allowedMimeTypes = [
    //   "text/plain",
    //   "text/csv",
    //   "image/jpeg",
    //   "image/jpg",
    // ];
    // // Check if the file's mime type is in the list of allowed mime types
    // //@ts-ignore
    // if (!allowedMimeTypes.includes(req.files.document.mimetype)) {
    //   return res.status(400).json({
    //     status: "error",
    //     message:
    //       "Invalid file type. Only .txt, .csv, .jpg, .jpeg files are allowed",
    //   });
    // }
    // The name of the input field is used to retrieve the uploaded file
    let uploadedFile = file.document;
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
    //@ts-ignore
    const stream = bufferToStream(uploadedFile.data);

    const result = await pinata.pinFileToIPFS(stream, {
      //@ts-ignore
      pinataMetadata: { name: uploadedFile.name },
    });
    console.log("Image upload to ipfs done");

    console.log(result);
    const providerMumbai = new ethers.providers.JsonRpcProvider(
      process.env.MUMBAI_PROVIDER
    );
    const providerBsc = new ethers.providers.JsonRpcProvider(
      process.env.BSC_PROVIDER
    );
    const walletMumbai = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerMumbai
    );
    const walletBsc = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      providerBsc
    );

    const messageMumbai_rw = new ethers.Contract(
      messageMumbai,
      messageAbi,
      walletMumbai
    );
    const messageBsc_rw = new ethers.Contract(
      messageBsc,
      messageAbi,
      walletBsc
    );
    // const message = "First Hallo from polygon";
    const txMumbai = await messageMumbai_rw.setDocument(
      name,
      "https://ipfs.io/ipfs/" + result.IpfsHash
    );
    await txMumbai.wait();
    console.log("done from mumbai");
    const gasPrice = walletBsc.getGasPrice();
    const gasLimit = messageBsc_rw.estimateGas.setDocument(
      name,
      "https://ipfs.io/ipfs/" + result.IpfsHash
    );
    const txBsc = await messageBsc_rw.setDocument(
      name,
      "https://ipfs.io/ipfs/" + result.IpfsHash,
      {
        gasLimit,
        gasPrice,
      }
    );
    await txBsc.wait();
    console.log("done from bsc");
    return {
      txDocumentMumbaiHash: txMumbai.hash,
      txDocumentBscHash: txBsc.hash,
    };
  }

  // res.status(201).json({
  //   status: "success",
  //   data: "ok",
  // });
};

function bufferToStream(buffer: any) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Indicates the end of the stream
  return stream;
}
