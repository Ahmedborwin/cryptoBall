import { useState } from "react"
import { ethers } from "ethers"

const useWalletConnect = () => {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)

  const handleWalletConnect = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        setAccount(accounts[0])
        setError(null) // Clear any previous errors
      } catch (err) {
        setError("Failed to connect to wallet")
        console.error("Error connecting to wallet:", err)
      }
    } else {
      setError("No wallet provider found. Please install MetaMask!")
      console.error("No wallet provider found")
    }
  }

  const handleWalletDisconnect = () => {
    setAccount(null)
    setError(null)
  }

  return {
    account,
    error,
    handleWalletConnect,
    handleWalletDisconnect,
  }
}

export default useWalletConnect
