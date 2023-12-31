const { ethers, network } = require("hardhat")
const { frontEndAbiFile, frontEndContractsFile } = require("../helper-hardhat-config")
const fs = require("fs")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front-end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front-end updated!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(frontEndAbiFile, raffle.interface.formatJson())
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    const raffleAddress = await raffle.getAddress()

    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffleAddress)) {
            currentAddresses[chainId].push(raffleAddress)
        }
    }
    {
        currentAddresses[chainId] = [raffleAddress]
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
