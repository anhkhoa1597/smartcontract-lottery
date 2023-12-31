const { keccak256, toUtf8Bytes, EventLog } = require("ethers")
const { ethers, network } = require("hardhat")
const { contractSizer } = require("../hardhat.config")

async function mockKeepers() {
    const raffle = await ethers.getContract("Raffle")
    const checkData = keccak256(toUtf8Bytes(""))
    const interval = await raffle.getInterval()

    if (network.config.chainId == 31337) {
        await network.provider.send("evm_increaseTime", [parseInt(interval.toString()) + 1])
        await network.provider.request({ method: "evm_mine", params: [] })
    }
    const { upkeepNeeded } = await raffle.checkUpkeep.staticCall(checkData)

    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        const logs = txReceipt.logs
        let requestId = 0
        for (const log of logs) {
            if (log instanceof EventLog && log.eventName === "RequestedRaffleWinner") {
                requestId = parseInt(log.args[0]) // Lấy requestId từ args của sự kiện
                break // Thoát khỏi vòng lặp sau khi tìm thấy sự kiện cần
            }
        }
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if (network.config.chainId == 31337) {
            await mockVrf(requestId, raffle)
        }
    } else {
        console.log("No upkeep needed!")
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We on a local network? Ok let's pretend...")
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, await raffle.getAddress())
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
