import { useEffect, useState } from "react"

const IPFS_HASH = "https://gateway.pinata.cloud/ipfs/QmY59zJCpS9ChBWxBau85XpGYSi5zcpixczARXnfrLFm6k"

const useGetIPFSData = () => {
  const [ipfsData, setIpfsData] = useState({})

  useEffect(() => {
    const fetchIPFS = async () => {
      const response = await fetch(IPFS_HASH)
      const tokenURIResponse = await response.json()
      setIpfsData(tokenURIResponse)
    }
    fetchIPFS()
  }, [])

  return ipfsData
}

export default useGetIPFSData
