import { useEffect, useState } from "react"
import { ethers } from "ethers"

const useEventListener = (contractAddress, contractABI, eventName) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const setupEventListener = async () => {
      try {
        const alchemyProvider = new ethers.providers.JsonRpcProvider(
          `https://arb-sepolia.g.alchemy.com/v2/vD6QwCUWLfCBxRT2A6CwgATSQpqc9w8G`
        )
        const signer = alchemyProvider.getSigner()
        // Set up the contract
        const contract = new ethers.Contract(contractAddress, contractABI, signer)

        const handleEventListener = (...args) => {
          const event = args[args.length - 1]
          console.log(event, "@@@@event")
          const eventData = args.slice(0, args.length - 1)
          setEvents([{ eventData, transactionHash: event.transactionHash }])
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

export default useEventListener
