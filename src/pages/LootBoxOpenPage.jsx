import React, { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
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
import { useAccount, useChainId } from "wagmi"
import useEventListener from "../hooks/useEventListener"
import useOpenLootboxEventListener from "../hooks/useOpenLootboxEventListener"

const LootBoxOpenPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState(false)

  const chainId = useChainId()
  const account = useAccount()

  const navigate = useNavigate()

  const {
    write: approveTokens,
    loading: loadingApproveTokens,
    error: errorApproveTokens,
  } = useContractWrite(Token_AddressList[chainId], TOKEN_ABI, "approve")

  const {
    write: openLootBox,
    loading,
    error: errorOpenLootBox,
  } = useContractWrite(Manager_AddressList[chainId], MM_ABI, "openLootbox")

  const { events: approvalEvent, error: errorApprovalEvent } = useEventListener(
    Token_AddressList[chainId],
    TOKEN_ABI,
    "Approval"
  )

  const { events: lootBoxOpenedEvent, error: errorLootBoxOpenedEvent } = useOpenLootboxEventListener(
    VRF_AddressList[chainId],
    VRF_ABI,
    "PackOpened"
  )

  console.log(lootBoxOpenedEvent, "@@@@@event")

  const handleOpenBox = async () => {
    setIsOpen(true)
    await approveTokens(Manager_AddressList[chainId], ethers.utils.parseEther("5"))
  }

  if (errorOpenLootBox) {
    console.log(errorOpenLootBox, "error: errorOpenLootBox")
  }


  useEffect(() => {
    const handleOpenLootBox = async () => {
      console.log("Opening Lootbox...")
      await openLootBox()
      console.log("Done opening lootbox")
    }

    if (approvalEvent.length) {
      if (approvalEvent.find((event) => event.eventData.find((prop) => prop === account.address))) handleOpenLootBox()
    }
  }, [approvalEvent])

  useEffect(() => {
    const startOpeningAnimation = async () => {
      setIsOpen(true)
      setTimeout(() => {
        setTransition(true)
        setTimeout(() => {
          navigate("/loot-view") // Navigate after the animation duration
        }, 1000) // Transition duration
      }, 2000)
    }

    if (lootBoxOpenedEvent.length) {
      const foundEvent = lootBoxOpenedEvent.find((event) => event.eventData.find((prop) => prop === account.address))
      if (foundEvent) {
        console.log("Starting animation...")
        startOpeningAnimation()
        console.log("Done starting animation")
        // console.log(foundEvent.uirIndex, "@@@@@@@uriIndex")
      }
    }
  }, [lootBoxOpenedEvent])

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
