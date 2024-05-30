import { useEffect, useState } from "react"
import { ethers } from "ethers"
import TOKEN_ABI from "../config/tokenAbi.json" // Adjust the import path

const useTokenBalance = (account, tokenAddress) => {
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!account || !tokenAddress) return

    const fetchBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(tokenAddress, TOKEN_ABI, provider)
        const balance = await contract.balanceOf(account)
        setBalance(ethers.utils.formatUnits(balance, 18)) // Adjust the decimals if needed
      } catch (err) {
        setError(err.message)
      }
    }

    fetchBalance()
  }, [account, tokenAddress])

  return { balance, error }
}

export default useTokenBalance
