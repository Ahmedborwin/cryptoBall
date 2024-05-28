import { useState, useEffect } from "react"
import { ethers } from "ethers"
import useContractRead from "./useContractRead"

/**
 * A custom hook to read data from a smart contract for multiple token IDs.
 *
 * @param {string} contractAddress - The address of the smart contract.
 * @param {Array} contractABI - The ABI of the smart contract.
 * @param {string} functionName - The name of the contract function to call.
 * @param {Array} tokenIds - The list of token IDs to read data for.
 * @returns {Object} - An object containing the data, loading, and error states.
 */
const useContractReadMultiple = (contractAddress, contractABI, functionName, tokenIds, args = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, contractABI, provider)
        const promises = tokenIds.map((id) => contract[functionName](...args, id))
        const results = await Promise.all(promises)
        setData(results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!data.length) fetchData()
  }, [contractAddress, contractABI, functionName, tokenIds])

  return { data, loading, error }
}

export default useContractReadMultiple
