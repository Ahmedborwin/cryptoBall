import React, { useState, useEffect, useRef } from "react"
import SubmitButton from "../components/common/Button/SubmitButton"

const SeasonPage = () => {
  const startDate = new Date("2024-08-01")
  const endDate = new Date("2025-08-01")

  const [currentDate, setCurrentDate] = useState(startDate)
  const [weekDays, setWeekDays] = useState(getWeekDays(startDate))
  const [isSimulating, setIsSimulating] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(intervalRef.current)
      setIsSimulating(false)
    } else {
      intervalRef.current = setInterval(updateDay, 500)
      setIsSimulating(true)
    }
  }

  function updateDay() {
    setCurrentDate((prevDate) => {
      const nextDay = new Date(prevDate)
      nextDay.setDate(prevDate.getDate() + 1)

      if (nextDay > endDate) {
        console.log("Reached end date, stopping simulation")
        clearInterval(intervalRef.current)
        setIsSimulating(false)
        return prevDate
      }

      if (nextDay.getDay() === 1) {
        setWeekDays(getWeekDays(nextDay))
      }

      return nextDay
    })
  }

  function getWeekDays(date) {
    let weekStart = new Date(date)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + i)
      days.push(day)
    }
    return days
  }

  return (
    <div className="w-full h-screen p-10">
      <h1>Season Page</h1>
      <h5>{`${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getFullYear()}`}</h5>
      <div className="flex m-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-2 border bg-opacity-50 ${
              currentDate.toDateString() === day.toDateString() ? "bg-blue-300" : "bg-white"
            } w-20 h-20`}
          >
            <span className="font-bold">{day.getDate()}</span>
            <div className="text-xs opacity-50">Content here</div>
          </div>
        ))}
      </div>
      <SubmitButton onClick={toggleSimulation} className="mb-4">
        {isSimulating ? "Stop" : "Simulate"}
      </SubmitButton>
    </div>
  )
}

export default SeasonPage
