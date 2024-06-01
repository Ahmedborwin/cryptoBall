import React, { useState, useEffect, useRef } from "react"
import Manager_AddressList from "../config/Manager_AddressList.json"
import MM_ABI from "../config/managerAbi.json"

// components
import SubmitButton from "../components/common/Button/SubmitButton"

// hooks
import useContractWrite from "../hooks/useContractWrite"
import useEventListener from "../hooks/useEventListener"
import { useChainId } from "wagmi"
import { BigNumber } from "ethers"

const commentaries = [
  "What a fantastic weather today!",
  "The crowd is going wild!",
  "A beautiful day for soccer.",
  "The tension is palpable.",
  "An incredible atmosphere here.",
  "What a skillful move!",
  "An unexpected turn of events!",
  "The fans are on the edge of their seats!",
  "A thrilling performance!",
  "Unbelievable scenes here at the stadium!",
]

const MatchPage = () => {
  const totalMinutes = 90
  const [currentMinute, setCurrentMinute] = useState(0)
  const [extraTime, setExtraTime] = useState(0)
  const [teamAScore, setTeamAScore] = useState(null)
  const [teamBScore, setTeamBScore] = useState(null)
  const [narration, setNarration] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const intervalRef = useRef(null)

  const chainId = useChainId()

  const {
    write: startGame,
    loading: loadingStartGame,
    error: errorStartGame,
  } = useContractWrite(Manager_AddressList[chainId], MM_ABI, "startGame")

  const { events: finalizeGameEvent, error: errorFinalizeGameEvent } = useEventListener(
    Manager_AddressList[chainId],
    MM_ABI,
    "FinalizeGame"
  )

  const toggleSimulation = async () => {
    await startGame(1)
    setExtraTime(Math.floor(Math.random() * 8)) // Random extra time between 0 and 7
    intervalRef.current = setInterval(updateMinute, 500) // Simulate each minute every second
    setIsSimulating(true)
    setShowScores(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (finalizeGameEvent.length) {
      const gameEvent = finalizeGameEvent.find((event) => event.eventData.find((prop) => prop.toString() === "1"))
      if (gameEvent && !isSimulating) {
        const gameScore = gameEvent.eventData.slice(2, 4).map((prop) => BigNumber.from(prop).toNumber())
        console.log(gameScore, "@@@@gameScore")

        setTeamAScore(gameScore[0])
        setTeamBScore(gameScore[1])
        setShowScores(true)
      }
    }
  }, [finalizeGameEvent, isSimulating])

  useEffect(() => {
    if (teamAScore !== null && teamBScore !== null && !isSimulating) {
      setNarration(
        `Full time! The match ends with a score of ${teamAScore} - ${teamBScore}. ${teamAScore > teamBScore ? "Team A wins!" : teamBScore > teamAScore ? "Team B wins!" : "It's a draw!"
        }`
      )
    }
  }, [teamAScore, teamBScore, isSimulating])

  const updateMinute = () => {
    setCurrentMinute((prevMinute) => {
      const nextMinute = prevMinute + 1

      if (nextMinute > totalMinutes + extraTime) {
        console.log("Reached end of the game, stopping simulation")
        clearInterval(intervalRef.current)
        setIsSimulating(false)
        return prevMinute
      }

      let newNarration = ""

      if (nextMinute === 1) {
        newNarration = "The game has started!"
      } else if (nextMinute === 45) {
        newNarration = "Half time! What a match so far."
      } else if (nextMinute === totalMinutes + 1) {
        newNarration = `The game goes into extra time of ${extraTime} minutes.`
      }

      // Randomly generate commentaries
      if (Math.random() > 0.95) {
        newNarration = commentaries[Math.floor(Math.random() * commentaries.length)]
      }

      if (newNarration) {
        setNarration(newNarration)
      }

      return nextMinute
    })
  }

  const displayMinute =
    currentMinute > totalMinutes ? `${totalMinutes}+${currentMinute - totalMinutes}'` : `${currentMinute}'`

  const blurredScore = (
    <div className="flex items-center justify-center">
      <span className="text-4xl font-bold pt-8 blur">0</span>
      <span className="text-4xl font-bold pt-8 blur mx-2">-</span>
      <span className="text-4xl font-bold pt-8 blur">0</span>
    </div>
  )

  const actualScore = (
    <div className="flex items-center justify-center">
      <span className="text-4xl font-bold pt-8">{teamAScore}</span>
      <span className="text-4xl font-bold pt-8 mx-2">-</span>
      <span className="text-4xl font-bold pt-8">{teamBScore}</span>
    </div>
  )

  return (
    <div className="w-full h-screen p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-[350px] flex items-center justify-center bg-[#00000073] rounded-xl shadow-xl">
        <div className="flex flex-col items-center p-4 border-r border-gray-300">
          <h2 className="text-2xl font-bold">Team A</h2>
        </div>
        <div className="flex flex-col items-center px-4">
          {showScores ? actualScore : blurredScore}
          <div className="text-xl mt-2">{displayMinute}</div>
        </div>
        <div className="flex flex-col items-center p-4 border-l border-gray-300">
          <h2 className="text-2xl font-bold">Team B</h2>
        </div>
      </div>
      <div className="w-full max-w-4xl min-h-[100px] mb-4 p-4 bg-[#00000073] rounded-xl shadow-xl border-y border-gray-300 flex items-center justify-center">
        <p className="text-white text-center">{narration}</p>
      </div>
      <SubmitButton onClick={toggleSimulation} disabled={isSimulating}>
        {"Simulate"}
      </SubmitButton>
    </div>
  )
}

export default MatchPage
