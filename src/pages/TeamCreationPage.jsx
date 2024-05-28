import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubmitButton from "../components/common/Button/SubmitButton"
import FormBox from "../components/common/Form/FormBox"
import FormField from "../components/common/Form/FormField/FormField"

const TeamCreationPage = () => {
  // State to store the team name and manager's name
  const [teamName, setTeamName] = useState("")
  const [managerName, setManagerName] = useState("")

  const navigate = useNavigate()

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault() // Prevents the default form submission behavior
    console.log("Creating team:", teamName, "with manager:", managerName)
    // Here you can add more logic to do something with the form data

    navigate("/team-stats")
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <h3 className="mb-4 text-sky-800">Welcome to Crypto Football</h3>
      <h5 className="mb-4 text-sky-800">Let's start by creating a team!</h5>

      <FormBox className="mt-20" onSubmit={handleSubmit}>
        <FormField value={teamName} onChange={(e) => setTeamName(e.target.value)}>
          Team Name
        </FormField>
        <br />
        <FormField value={managerName} onChange={(e) => setManagerName(e.target.value)}>
          Manager Name
        </FormField>
        <br />
        <SubmitButton onClick={handleSubmit}>Create Team</SubmitButton>
      </FormBox>
    </div>
  )
}

export default TeamCreationPage
