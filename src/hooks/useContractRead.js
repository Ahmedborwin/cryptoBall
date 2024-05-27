import { useState, useEffect } from "react"
import { ethers } from "ethers"

/**
 * A custom hook to read data from a smart contract.
 *
 * @param {string} contractAddress - The address of the smart contract.
 * @param {Array} contractABI - The ABI of the smart contract.
 * @param {string} functionName - The name of the contract function to call.
 * @param {Array} args - The arguments to pass to the contract function.
 * @returns {Object} - An object containing the data, loading, and error states.
 */
const useContractRead = (contractAddress, contractABI, functionName, args = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set up the provider (you can use any provider)
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        // Request account access if needed
        await provider.send("eth_requestAccounts", [])

        // Set up the contract
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        // Read data from the contract
        const result = await contract[functionName](...args)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [contractAddress, contractABI, functionName, args])

  return { data, loading, error }
}

export default useContractRead
