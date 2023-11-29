import { useState } from "react";
import axios from "axios";

const Home = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [queryNameMumbai, setQueryNameMumbai] = useState("");
  const [queryNameBSC, setQueryNameBSC] = useState("");
  const [file, setFile] = useState(null);
  const [myLoader, setMyLoader] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);
  const [mumbaiData, setMumbaiData] = useState({
    message: "",
    document: "",
  });
  const [bscData, setBscData] = useState({
    message: "",
    document: "",
  });

  const handleNameChange = (e) => setName(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleFileChange = (e) => {
    // Check if any file is selected
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleQueryNameMumbaiChange = (e) => setQueryNameMumbai(e.target.value);
  const handleQueryNameBSCChange = (e) => setQueryNameBSC(e.target.value);

  const handleDataSubmission = async (e) => {
    e.preventDefault();
    setMyLoader(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("document", file);
    formData.append("message", message);
    const res = await axios.post(
      "http://localhost:3000/write/handleDataWrite",
      formData
    );
    setMyLoader(false);

    console.log(res);
  };

  const handleMumbaiQuery = async () => {
    try {
      setFetchLoader(true);
      const queryParams = { name: queryNameMumbai };
      const response = await axios.get(
        "http://localhost:3000/read/readDataMumbai",
        {
          params: queryParams,
        }
      );
      setFetchLoader(false);
      setMumbaiData({
        message: response.data.data.messageFromMumbai,
        document: response.data.data.documentFromMumbai,
      });
      //   console.log(response.data);

      // Handle the response data
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  const handleBSCQuery = async () => {
    try {
      setFetchLoader(true);
      const queryParams = { name: queryNameBSC };
      const response = await axios.get(
        "http://localhost:3000/read/readDataBsc",
        {
          params: queryParams,
        }
      );
      setFetchLoader(false);
      setBscData({
        message: response.data.data.messageFromBsc,
        document: response.data.data.documentFromBsc,
      });
      //   console.log(response.data);

      // Handle the response data
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {myLoader && <Loader myLoader={myLoader} text="Submitting" />}
      {fetchLoader && <Loader myLoader={fetchLoader} text="Fetching" />}

      <div className="flex items-center justify-center py-4">
        <div className="text-6xl font-bold mb-4 border-b-4 border-gray-700">
          Mumbai↔BSC
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-xs">
          <form
            className="flex flex-col items-center mb-4 space-y-3"
            onSubmit={handleDataSubmission}
          >
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={handleNameChange}
              className="input-style p-2 rounded text-black"
            />
            <input
              type="text"
              placeholder="message"
              value={message}
              onChange={handleMessageChange}
              className="input-style p-2 rounded text-black"
            />
            <div className="flex w-full justify-around">
              <button
                type="submit"
                className="btn-style bg-green-500 px-3 py-2 rounded"
              >
                submit
              </button>
              <label className="btn-style cursor-pointer  bg-blue-500 px-3 py-2 rounded">
                <span className="text-center">upload file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".txt,.csv,.jpg,.jpeg"
                />
              </label>
            </div>
            {file && (
              <div className=" text-base text-gray-300 mt-2">
                Selected file: {file.name}
              </div>
            )}
          </form>
        </div>
      </div>
      <div className="flex justify-around my-10">
        <div className="flex flex-col items-center mb-4">
          <h2 className=" text-2xl mb-2">Read Data from Mumbai</h2>
          <input
            type="text"
            placeholder="name"
            value={queryNameMumbai}
            onChange={handleQueryNameMumbaiChange}
            className="input-style p-2 rounded text-black"
          />
          <button
            className="btn-style bg-green-500 px-3 py-2 rounded mt-6"
            onClick={handleMumbaiQuery}
          >
            query
          </button>
          <div className=" px-5 w-4/5">
            <p className="text-gray-300 mt-4">Message : {mumbaiData.message}</p>
            <p className="text-gray-300 mt-4">
              Document : {mumbaiData.document}
            </p>
          </div>
        </div>
        <div className="border-r-2 border-gray-400"></div>
        <div className="flex flex-col items-center">
          <h2 className=" text-2xl mb-2">Read Data from BSC</h2>
          <input
            type="text"
            placeholder="name"
            value={queryNameBSC}
            onChange={handleQueryNameBSCChange}
            className="input-style p-2 rounded text-black"
          />
          <button
            className="btn-style bg-green-500 px-3 py-2 rounded mt-6"
            onClick={handleBSCQuery}
          >
            query
          </button>
          <div className="px-5 w-4/5">
            <p className="text-gray-300 mt-4">Message: {bscData.message}</p>
            <p className="text-gray-300 mt-4">Document: {bscData.document}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable react/prop-types */
const Loader = ({ myLoader, text }) => {
  if (!myLoader) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 01.33-2.22m0 0a8 8 0 0114.34 0m0 0a8 8 0 01.33 2.22m0 0a8 8 0 01-.33 2.22m0 0a8 8 0 01-14.34 0m0 0a8 8 0 01-.33-2.22z"
          ></path>
        </svg>
        <div className="text-3xl text-white mt-4">{text}</div>
      </div>
    </div>
  );
};

// const inputStyle = "border border-blue-500 p-2 rounded";
// const btnStyle = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700";

export default Home;
