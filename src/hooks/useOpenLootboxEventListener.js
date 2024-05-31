import { useEffect, useState } from "react"
import { ethers } from "ethers"

const useOpenLootboxEventListener = (contractAddress, contractABI, eventName) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let contract

    const setupEventListener = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        contract = new ethers.Contract(contractAddress, contractABI, provider)

        const handleEventListener = (...args) => {
          const event = args[args.length - 1]
          console.log("lootbox event", event)
          const eventData = args.slice(0, args.length - 1)
          setEvents((prevEvents) => [...prevEvents, { eventData, transactionHash: event.transactionHash }])
        }

        contract.on(eventName, handleEventListener)

        // Cleanup function to remove the event listener
        return () => {
          if (contract) {
            contract.off(eventName, handleEventListener)
          }
        }
      } catch (e) {
        setError(e)
      }
    }

    setupEventListener()

    return () => {
      if (contract) {
        contract.removeAllListeners(eventName)
      }
    }
  }, [contractAddress, contractABI, eventName])

  return { events, error }
}

export default useOpenLootboxEventListener
