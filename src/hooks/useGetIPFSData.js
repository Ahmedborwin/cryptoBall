import { useEffect, useState } from "react"
import IPFS_HASH from "../config/BaseDataIPFSHash.json"

const useGetIPFSData = () => {
  const [ipfsData, setIpfsData] = useState({})

  useEffect(() => {
    const fetchIPFS = async () => {
      const response = await fetch(IPFS_HASH["Hash"])
      const tokenURIResponse = await response.json()
      setIpfsData(tokenURIResponse)
    }
    fetchIPFS()
  }, [])

  return ipfsData
}

export default useGetIPFSData
