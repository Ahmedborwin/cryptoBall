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
const useContractReadIsOwner = (contractAddress, contractABI, functionName, tokenIds, args = []) => {
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

        // Create promises for each tokenId with individual error handling
        const promises = tokenIds.map(async (id) => {
          try {
            const result = await contract[functionName](...args, id)
            return { id, result }
          } catch (err) {
            if (id !== 0) console.error(`Error fetching data for tokenId ${id}:`, err)
            return null // or you can handle it differently
          }
        })

        // Wait for all promises to resolve
        const results = await Promise.all(promises)
        // Filter tokenIds based on the result being true
        const validTokenIds = results.filter((item) => item && item.result === true).map((item) => item.id)
        setData(validTokenIds)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!data.length && tokenIds.length) fetchData()
    else setLoading(false)
  }, [contractAddress, contractABI, functionName, tokenIds])

  return { data, loading, error }
}

export default useContractReadIsOwner
