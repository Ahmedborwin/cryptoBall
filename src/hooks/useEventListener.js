import { useEffect, useState } from "react"
import { ethers } from "ethers"

const useEventListener = (contractAddress, contractABI, eventName) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Match Event listener Here ")
    const setupEventListener = async () => {
      try {
        console.log("Match Event listener Here 2")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set up the contract
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        const handleEventListener = (...args) => {
          const event = args[args.length - 1]
          console.log(event, "@@@@event")
          const eventData = args.slice(0, args.length - 1)
          console.log(eventData, "@@@@eventData")
          setEvents([{ eventData, transactionHash: event.transactionHash }])
        }

        console.log(contract.on(eventName, handleEventListener))
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

export default useEventListener
