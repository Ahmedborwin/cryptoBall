import React from "react"
import { useLocation } from "react-router-dom"
import PlayerCard from "../components/PlayerCard/index"

const LootBoxViewPage = () => {
  const { state } = useLocation()
  const { packOpenedArray } = state || []

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 h-screen items-center justify-center">
      {packOpenedArray?.map((player, index) => (
        <PlayerCard player={player} index={index} />
      ))}
    </div>
  )
}

export default LootBoxViewPage
