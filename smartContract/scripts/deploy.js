// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const message = await hre.ethers.deployContract("Message", []);

  await message.waitForDeployment();

  console.log("message deployed at ", message.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//mumbai
// 0x0fC22A45507498975DC5796824F703D2486a1A31
// 0xDcb7deD79Ba7457161223C8AfD1D0c4146B5419F
//bsc
// 0x2D7Ee3a6d7480E01239C3C165286Ee2E4B728195
// 0xE04c672ED9A23eE73497eBB5edD2d3e2EF73fe85
