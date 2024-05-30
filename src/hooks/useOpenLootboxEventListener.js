import { useEffect, useState } from "react"
import { ethers } from "ethers"

const useOpenLootboxEventListener = (contractAddress, contractABI, eventName) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  console.log(error, "@@@@Error")
  useEffect(() => {
    const setupEventListener = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Request account access if needed
        await provider.send("eth_requestAccounts", [])

        // Set up the contract
        const contract = new ethers.Contract(contractAddress, contractABI, provider)
        console.log(contract, "@@@@contract")

        const handleEventListener = (...args) => {
          console.log(args, "@@@args")
          const event = args[args.length - 1]
          const eventData = args.slice(0, args.length - 1)
          console.log(event, "@@@@event")
          setEvents((prevEvents) => [...prevEvents, { eventData, transactionHash: event.transactionHash }])
        }

        contract.on(eventName, handleEventListener)

        // Cleanup function to remove the event listener
        return () => {
          contract.off(eventName, handleEventListener)
        }
      } catch (e) {
        setError(e)
      }
    }

    setupEventListener()

    // Cleanup function to remove listeners when component unmounts or contractAddress changes
    return () => {
      setupEventListener().then((cleanup) => cleanup && cleanup())
    }
  }, [contractAddress, contractABI, eventName])

  return { events, error }
}

export default useOpenLootboxEventListener
