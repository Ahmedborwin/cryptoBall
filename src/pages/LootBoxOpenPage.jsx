import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SubmitButton from "../components/common/Button/SubmitButton"
import FootballImage from "../assets/football-card.png" // Replace with your football icon
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"
import Token_AddressList from "../config/token_AddressList.json"
import TOKEN_ABI from "../config/tokenAbi.json"
import useContractWrite from "../hooks/useContractWrite"
import useEventListener from "../hooks/useEventListener"
import { ethers } from "ethers"

const LootBoxOpenPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState(false)

  const navigate = useNavigate()

  const {
    write: approveTokens,
    loading: loadingApproveTokens,
    error: errorApproveTokens,
  } = useContractWrite(Token_AddressList[421614], TOKEN_ABI, "approve")

  const { events: approvalEvent, error: errorApprovalEvent } = useEventListener(
    Token_AddressList[421614],
    TOKEN_ABI,
    "Approval"
  )

  const { events: lootBoxOpenedEvent, error: errorLootBoxOpenedEvent } = useEventListener(
    NFT_AddressList[421614],
    CBNFT_ABI,
    "LootBoxOpened"
  )

  // console.log(lootBoxOpenedEvent, "@@@@@event")
  // console.log(errorLootBoxOpenedEvent, "@@@@error")

  const {
    write: openLootBox,
    loading,
    error: errorOpenLootBox,
  } = useContractWrite(Manager_AddressList[421614], MM_ABI, "openLootbox")

  const handleOpenBox = async () => {
    setIsOpen(true)
    await approveTokens(Manager_AddressList[421614], ethers.utils.parseEther("5"))
  }

  useEffect(() => {
    const handleOpenLootBox = async () => {
      console.log("Opening Lootbox...")
      await openLootBox()
      console.log("Done opening lootbox")
    }

    if (approvalEvent.length) {
      if (approvalEvent.find(event => event.eventData.find(prop => prop === "0xe437260B3785171cB5BAd86c3B78d961da1b8223"))) handleOpenLootBox()
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
      const foundEvent = lootBoxOpenedEvent.find(event => event.eventData.find(prop => prop === "0xe437260B3785171cB5BAd86c3B78d961da1b8223"))
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
