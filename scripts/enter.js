const { ethers } = require("hardhat")

async function enterRaffle() {
    console.log("Entering...")
    const raffle = await ethers.getContract("Raffle")
    console.log("raffle: ", await raffle.getAddress())
    const entranceFee = await raffle.getEntranceFee()
    console.log("raffleEntranceFee: ", entranceFee)
    const tx = await raffle.enterRaffle({ value: entranceFee })
    await tx.wait(1)
    console.log("tx: ", tx.hash)
    console.log("Entered!")
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
