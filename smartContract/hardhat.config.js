require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config({ path: "./.env" });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bsc: {
      url: process.env.BSCTESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  // sourcify: {
  //   enabled: true,
  // },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGON_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      bscTestnet: process.env.BSC_API_KEY,
    },
  },
};
