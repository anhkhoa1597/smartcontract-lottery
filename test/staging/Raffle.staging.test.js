const { assert, expect } = require("chai")
const { getNamedAccounts, ethers, network, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { EventLog } = require("ethers")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Staging Tests", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
              console.log("deployer: ", deployer)
              console.log("raffle: ", await raffle.getAddress())
          })

          describe("fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                  // enter the raffle
                  console.log("Setting up test...")
                  const startingTimeStamp = await raffle.getLastestTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      // setup listener before we enter the raffle
                      // Just in case the blockchain moves REALLY fast
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add our asserts here
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()

                              const winnerEndingBalance = await accounts[0].provider.getBalance(
                                  accountAddress
                              )
                              const endingTimeStamp = await raffle.getLastestTimeStamp()
                              const raffleEntranceFeeBigInt = BigInt(raffleEntranceFee)
                              const numberOfPlayers = await raffle.getNumberOfPlayers()
                              assert.equal(numberOfPlayers, 0)
                              assert.equal(recentWinner.toString(), accountAddress)
                              assert.equal(raffleState, 0)
                              assert(
                                  winnerEndingBalance <=
                                      winnerStartingBalance + raffleEntranceFeeBigInt
                              )

                              assert(endingTimeStamp > startingTimeStamp)

                              resolve("Very good!")
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // Then entering the raffle
                      console.log("Entering Raffle...")
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      //   await tx.wait(1)
                      console.log("Ok, time to wait...")
                      const accountAddress = await accounts[0].getAddress()
                      const winnerStartingBalance = await accounts[0].provider.getBalance(
                          accountAddress
                      )
                      // and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
