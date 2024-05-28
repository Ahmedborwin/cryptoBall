import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubmitButton from "../components/common/Button/SubmitButton"
import ChestBoxImage from "../assets/chest-box.avif"
import NFT_AddressList from "../config/NFT_AddressList.json"
import CBNFT_ABI from "../config/NFTAbi.json"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"

const LootBoxOpenPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleOpenBox = () => {
    setIsOpen(true)
    setTimeout(() => {
      navigate("/loot-view") // Navigate after the animation duration
    }, 3000) // Assume 3000 ms for the animation to play out
  }

  return (
    <>
      <style>
        {`
          @keyframes openChest {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1), opacity: 0; }
          }
          .chest-open {
            animation: openChest 3s forwards;
          }
        `}
      </style>
      <div className="flex flex-col items-center justify-center text-center h-screen">
        <div className="mb-4">
          <img
            src={ChestBoxImage}
            alt="Loot Box"
            className={`transition duration-3000 ${isOpen ? "chest-open" : ""}`}
            style={{
              maxWidth: "150px", // Limit the size to 300px wide
              backgroundColor: "transparent", // Set background to transparent
            }}
          />
        </div>
        <SubmitButton onClick={handleOpenBox}>Open Box</SubmitButton>
        <div>MatchManager -- handleLootBox(manager address) function - NFT contract</div>
      </div>
    </>
  )
}

export default LootBoxOpenPage
