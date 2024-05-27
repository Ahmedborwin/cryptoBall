import { useState } from "react"
import { ethers } from "ethers"

/**
 * A custom hook to write data to a smart contract.
 *
 * @param {string} contractAddress - The address of the smart contract.
 * @param {Array} contractABI - The ABI of the smart contract.
 * @param {string} functionName - The name of the contract function to call.
 * @returns {Object} - An object containing the function to write to the contract, loading, and error states.
 */
const useContractWrite = (contractAddress, contractABI, functionName) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const write = async (...args) => {
    setLoading(true)
    setError(null)

    try {
      // Set up the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = provider.getSigner()

      // Set up the contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      // Write data to the contract
      const tx = await contract[functionName](...args)
      await tx.wait() // Wait for the transaction to be mined
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { write, loading, error }
}

export default useContractWrite
