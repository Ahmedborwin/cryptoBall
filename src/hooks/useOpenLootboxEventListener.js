import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useAccount } from "wagmi"

const useOpenLootboxEventListener = (contractAddress, contractABI, eventName) => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  const account = useAccount()

  useEffect(() => {
    let contract

    console.log(eventName, "@@@@@eventName")
    // console.log(contract, '@@@@contract')
    const setupEventListener = async () => {
      try {
        console.log("@@@@setEventListener")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        if (!provider) throw new ErrorEvent("No provider!")

        contract = new ethers.Contract(contractAddress, contractABI, provider)
        if (!contract) throw new ErrorEvent("No contract!")

        const handleEventListener = (...args) => {
          const event = args[args.length - 1]
          if (!event) throw new ErrorEvent("No event!")

          const eventData = args.slice(0, args.length - 1)
          if (eventData.find((prop) => prop === account.address))
            setEvents((prevEvents) => [...prevEvents, { eventData, transactionHash: event.transactionHash }])
          else console.log("No event found for the current address!")
        }

        contract.on(eventName, handleEventListener)

        // Cleanup function to remove the event listener
        return () => {
          if (contract) {
            contract.off(eventName, handleEventListener)
          }
        }
      } catch (e) {
        setError("Lootbox open event error: ", e)
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
