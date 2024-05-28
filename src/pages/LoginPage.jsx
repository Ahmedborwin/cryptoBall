import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import FormBox from "../components/common/Form/FormBox"
import FormField from "../components/common/Form/FormField"
import { AlchemySigner } from "@alchemy/aa-alchemy"
import SubmitButton from "../components/common/Button/SubmitButton"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [signer, setSigner] = useState(null) // State to hold the signer instance

  const navigate = useNavigate()

  useEffect(() => {
    const container = document.getElementById("turnkey-iframe-container")

    if (container) {
      const newSigner = new AlchemySigner({
        client: {
          connection: {
            network: "",
            apiKey: "Ia7FyjJcV1WDVIf4mj2ubRLTISvauvvU",
          },
          iframeConfig: {
            iframeContainerId: "turnkey-iframe-container",
          },
        },
      })

      setSigner(newSigner) // Save the signer instance to state
    }
  }, []) // Empty dependency array ensures this runs once after initial render

  const handleLogin = async () => {
    try {
      if (!signer) {
        console.error("Signer not ready")
        return
      }
      const result = await signer.authenticate({ type: "email", email })
      console.log("Login successful")

      navigate("/team-create")
      // Redirect or manage session
    } catch (error) {
      console.error("Login failed", error)
      console.error("Detailed error:", error.message) // More detailed error message
    }
  }

  return (
    <div className="w-full h-screen p-10">
      <FormBox>
        <FormField type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormBox>
      <FormBox>
        <div id="turnkey-iframe-container" />
      </FormBox>
      <SubmitButton onClick={handleLogin}>Log In</SubmitButton>
    </div>
  )
}

export default LoginPage
