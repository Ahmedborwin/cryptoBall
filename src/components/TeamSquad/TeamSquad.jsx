import React from "react"
import useGetManagerPlayers from "../../hooks/useGetManagerPlayers"
import { formations } from "../../utils/constants/squad"

const TeamSquad = ({ selectedFormation, playerRoster }) => {
  const { playersMetadata, loadingPlayersMetadata, errorPlayerMetadata } = useGetManagerPlayers()

  const players = formations[selectedFormation]
  let playerNumber = 11

  const getPlayerName = (playerNumber) => {
    const tokenId = playerRoster?.[playerNumber - 1]?.tokenID.toString()
    return playersMetadata.find((player) => parseInt(player.id) === parseInt(tokenId))?.name || ""
  }

  const SquadPlayer = ({ position, index, playerNumber }) => {
    const name = getPlayerName(playerNumber)
    return (
      <div key={position + index} className="flex flex-col items-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-800">{playerNumber}</span>
        </div>
        <div className="mt-1 text-xs text-center">
          {name.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="block">
              {word}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderPlayers = (position, count) => {
    return (
      <div className={`flex justify-center ${position === "goalkeeper" ? "justify-center" : "justify-evenly"} w-full`}>
        {Array.from({ length: count }).map((_, index) => (
          <SquadPlayer key={`${position}-${index}`} position={position} index={index} playerNumber={playerNumber--} />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-green bg-opacity-50 rounded-lg flex flex-col justify-around py-4 px-10 min-h-[600px]">
      {renderPlayers("forwards", players.forwards || 0)}
      {selectedFormation === "4-2-3-1" && renderPlayers("attackingMid", players.attackingMid || 0)}
      {renderPlayers("midfielders", players.midfielders || players.defensiveMid || 0)}
      {renderPlayers("defenders", players.defenders || 0)}
      {renderPlayers("goalkeeper", 1)}
    </div>
  )
}

export default TeamSquad
