import React, { useState, useEffect } from "react"
import { ethers, BigNumber } from "ethers"
import { useNavigate } from "react-router-dom"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"
import Token_AddressList from "../config/token_AddressList.json"
import TOKEN_ABI from "../config/tokenAbi.json"
import VRF_AddressList from "../config/VRF_AddressList.json"
import VRF_ABI from "../config/VRFAbi.json"

// assets
import FootballImage from "../assets/football-card.png"

// components
import SubmitButton from "../components/common/Button/SubmitButton"

// hooks
import useContractWrite from "../hooks/useContractWrite"
import { useAccount, useChainId, useWriteContract, useWatchContractEvent } from "wagmi"
import useEventListener from "../hooks/useEventListener"
import useOpenLootboxEventListener from "../hooks/useOpenLootboxEventListener"
import useGetIPFSData from "../hooks/useGetIPFSData"

const LootBoxOpenPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState(false)

  const chainId = useChainId()
  const { address: accountAddress } = useAccount()
  const navigate = useNavigate()
  const ipfsData = useGetIPFSData()

  const { writeContract } = useWriteContract()

  const { write: approveTokens } = useContractWrite(Token_AddressList[chainId], TOKEN_ABI, "approve")
  const { write: openLootBox } = useContractWrite(Manager_AddressList[chainId], MM_ABI, "openLootbox")

  // Watch for Approval event
  useWatchContractEvent({
    address: Token_AddressList[chainId],
    abi: TOKEN_ABI,
    eventName: "Approval",
    onLogs(logs) {
      console.log("Approval logs:", logs)
      if (logs.some((log) => log.args?.owner === account.address)) {
        handleOpenLootBox()
      }
    },
  })

  // Watch for PackOpened event
  useWatchContractEvent({
    address: VRF_AddressList[chainId],
    abi: VRF_ABI,
    eventName: "PackOpened",
    onLogs(logs) {
      console.log("PackOpened logs:", logs)
      const foundEvent = logs.find((log) => log.args?.[0] === account.address)
      if (foundEvent) {
        const playerURIIndexArray = foundEvent.args.slice(1, 6).map((arg) => BigNumber.from(arg).toNumber())
        console.log("playerURIIndexArray", playerURIIndexArray)
        const packOpenedArray = playerURIIndexArray.map((index) => ipfsData[index])
        console.log("Starting animation...")
        startOpeningAnimation({ packOpenedArray })
        console.log("Done starting animation")
      }
    },
  })

  useWatchContractEvent({
    address: Token_AddressList[chainId],
    abi: TOKEN_ABI,
    eventName: "Approval",
    onLogs(logs) {
      console.log("Approval event@@@@@@", logs)
    },
    onError(error) {
      console.error("Error in Approval event listener:", error)
    },
    chainId, // Ensure this is correctly set
    enabled: !!chainId && !!accountAddress, // Ensure this runs only when chainId and accountAddress are defined
  })

  const handleOpenBox = async () => {
    setIsOpen(true)
    writeContract({
      abi: TOKEN_ABI,
      address: Token_AddressList[chainId],
      functionName: "approve",
      args: [Manager_AddressList[chainId], ethers.utils.parseEther("5")],
    })
  }

  const handleOpenLootBox = async () => {
    console.log("Opening Lootbox...")
    await openLootBox()
    console.log("Done opening lootbox")
  }

  // if (approvalEvent.length) {
  //   if (approvalEvent.find((event) => event.eventData.find((prop) => prop === accountAddress))) handleOpenLootBox()
  // }

  // useEffect(() => {
  //   const startOpeningAnimation = async ({ packOpenedArray }) => {
  //     setIsOpen(true)
  //     setTimeout(() => {
  //       setTransition(true)
  //       setTimeout(() => {
  //         navigate("/loot-view", { state: { packOpenedArray } }) // Navigate after the animation duration
  //       }, 1000) // Transition duration
  //     }, 2000)
  //   }

  //   if (lootBoxOpenedEvent.length) {
  //     console.log("@@@@lootBoxOpenedEvent", lootBoxOpenedEvent)

  //     const foundEvent = lootBoxOpenedEvent.find((event) => event.eventData.find((prop) => prop === accountAddress))
  //     if (foundEvent) {
  //       // get the players details from the event args and use IPFS to get the player info
  //       const playerURIIndexArray = foundEvent.eventData.slice(1, 6).map((arg) => BigNumber.from(arg).toNumber())
  //       console.log("playerURIIndexArray", playerURIIndexArray)

  //       const packOpenedArray = []
  //       playerURIIndexArray.forEach((index) => {
  //         packOpenedArray.push(ipfsData[index])
  //       })

  //       console.log("packOpenedArray", packOpenedArray)

  //       console.log("Starting animation...")
  //       startOpeningAnimation({ packOpenedArray })
  //       console.log("Done starting animation")
  //     }
  //   } else {
  //     console.log("Array empty or not an array: ", lootBoxOpenedEvent, "@@@@@")
  //   }
  // }, [lootBoxOpenedEvent, accountAddress, ipfsData])
  // const startOpeningAnimation = ({ packOpenedArray }) => {
  //   setIsOpen(true)
  //   setTimeout(() => {
  //     setTransition(true)
  //     setTimeout(() => {
  //       navigate("/loot-view", { state: { packOpenedArray } }) // Navigate after the animation duration
  //     }, 1000) // Transition duration
  //   }, 2000) // Animation duration
  // }

  return (
    <>
      <style>
        {`
          @keyframes openFootball {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes lightRay {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(3); }
          }
          .football-open {
            animation: openFootball 1.5s forwards, shake 0.5s 1.5s forwards;
          }
          .light-ray {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
            animation: lightRay 1s forwards;
            z-index: 10;
          }
        `}
      </style>
      <div className="flex flex-col items-center justify-center text-center h-screen bg-green-100 relative overflow-hidden">
        {transition && <div className="light-ray"></div>}
        <div className="mb-4">
          <img
            src={FootballImage}
            alt="Football"
            className={`transition ${isOpen ? "football-open" : ""}`}
            style={{
              maxWidth: "150px", // Limit the size to 150px wide
              backgroundColor: "transparent", // Set background to transparent
            }}
          />
        </div>
        <SubmitButton onClick={handleOpenBox}>Open Box</SubmitButton>
      </div>
    </>
  )
}

export default LootBoxOpenPage
