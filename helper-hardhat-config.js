const { ethers } = require("hardhat")

const networkConfig = {
    // default: {
    //     name: "hardhat",
    //     keepersUpdateInterval: "30",
    // },
    31337: {
        name: "hardhat",
        subscriptionId: "588",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 150 gwei keyhash
        keepersUpdateInterval: "90",
        raffleEntranceFee: ethers.parseEther("0.01"), // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
    },
    11155111: {
        name: "sepolia",
        subscriptionId: "8135",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 150 gwei keyhash
        keepersUpdateInterval: "90",
        raffleEntranceFee: ethers.parseEther("0.01"), // 0.01 ETH
        callbackGasLimit: "500000", // 500,000 gas
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", //https://docs.chain.link/vrf/v2/subscription/supported-networks#ethereum-mainnet
    },
    // 1: {
    //     name: "mainnet",
    //     keepersUpdateInterval: "30",
    // },
}

const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractsFile = "../nextjs-smartcontract-lottery/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-smartcontract-lottery/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractsFile,
    frontEndAbiFile,
}
