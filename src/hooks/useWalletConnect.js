import { useState, useEffect } from "react"
import { ethers } from "ethers"

const useWalletConnect = () => {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)

  const handleWalletConnect = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask is not installed")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      const network = await provider.getNetwork()

      setAccount(accounts[0])
      setChainId(network.chainId)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleWalletDisconnect = () => {
    setAccount(null)
    setChainId(null)
  }

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount(null)
        } else {
          setAccount(accounts[0])
        }
      }

      const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId, 16)) // chainId is returned as a hex string
      }

      provider
        .listAccounts()
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0])
          }
        })
        .catch((err) => setError(err.message))

      provider
        .getNetwork()
        .then((network) => {
          setChainId(network.chainId)
        })
        .catch((err) => setError(err.message))

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    } else {
      setError("MetaMask is not installed")
    }
  }, [])

  return { account, chainId, error, handleWalletConnect, handleWalletDisconnect }
}

export default useWalletConnect
