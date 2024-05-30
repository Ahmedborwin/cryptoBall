import React, { useState, useEffect, useRef } from "react"
import SubmitButton from "../components/common/Button/SubmitButton"

const MatchPage = () => {
  const totalMinutes = 90
  const [currentMinute, setCurrentMinute] = useState(0)
  const [extraTime, setExtraTime] = useState(0)
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [narration, setNarration] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const intervalRef = useRef(null)

  const commentaries = [
    "What a fantastic weather today!",
    "The crowd is going wild!",
    "A beautiful day for soccer.",
    "The tension is palpable.",
    "An incredible atmosphere here.",
  ]

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(intervalRef.current)
      setIsSimulating(false)
    } else {
      setExtraTime(Math.floor(Math.random() * 8)) // Random extra time between 0 and 7
      intervalRef.current = setInterval(updateMinute, 500) // Simulate each minute every second
      setIsSimulating(true)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function updateMinute() {
    setCurrentMinute((prevMinute) => {
      const nextMinute = prevMinute + 1

      if (nextMinute > totalMinutes + extraTime) {
        console.log("Reached end of the game, stopping simulation")
        clearInterval(intervalRef.current)
        setIsSimulating(false)
        setNarration(
          `Full time! The match ends with a score of ${teamAScore} - ${teamBScore}. ${
            teamAScore > teamBScore ? "Team A wins!" : teamBScore > teamAScore ? "Team B wins!" : "It's a draw!"
          }`
        )
        return prevMinute
      }

      let newNarration = ""

      if (nextMinute === 1) {
        newNarration = "The game has started!"
      } else if (nextMinute === 45) {
        newNarration = "Half time! What a match so far."
      } else if (nextMinute === totalMinutes + 1) {
        newNarration = `The game goes into extra time of ${extraTime} minutes.`
      } else if (nextMinute === 46) {
        newNarration = commentaries[Math.floor(Math.random() * commentaries.length)]
      }

      // Randomly update the score for simulation purposes
      if (Math.random() > 0.95) {
        setTeamAScore((score) => score + 1)
        newNarration = `Goal! Team A scores.`
      } else if (Math.random() > 0.95) {
        setTeamBScore((score) => score + 1)
        newNarration = `Goal! Team B scores.`
      }

      // Randomly generate other events
      if (Math.random() > 0.98) {
        newNarration = "What a chance missed!"
      } else if (Math.random() > 0.99) {
        newNarration = "Yellow card!"
      } else if (Math.random() > 0.995) {
        newNarration = "Red card!"
      }

      if (newNarration) {
        setNarration(newNarration)
      }

      return nextMinute
    })
  }

  const displayMinute =
    currentMinute > totalMinutes ? `${totalMinutes}+${currentMinute - totalMinutes}'` : `${currentMinute}'`

  return (
    <div className="w-full h-screen p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl min-h-[600px] flex items-center justify-center mb-8 bg-[#00000073] rounded-xl shadow-xl">
        <div className="flex flex-col items-center p-4 border-r border-gray-300">
          <h2 className="text-2xl font-bold">Team A</h2>
        </div>
        <div className="flex flex-col items-center px-4">
          <h2 className="text-4xl font-bold pt-8">
            {teamAScore} - {teamBScore}
          </h2>
          <div className="text-xl mt-2">{displayMinute}</div>
        </div>
        <div className="flex flex-col items-center p-4 border-l border-gray-300">
          <h2 className="text-2xl font-bold">Team B</h2>
        </div>
      </div>
      <div className="w-full max-w-4xl min-h-[100px] mt-4 p-4 bg-[#00000073] rounded-xl shadow-xl">
        <p className="text-white text-center">{narration}</p>
      </div>
      <SubmitButton onClick={toggleSimulation} className="mb-4">
        {isSimulating ? "Stop" : "Simulate"}
      </SubmitButton>
    </div>
  )
}

export default MatchPage
