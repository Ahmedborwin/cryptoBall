import { useEffect, useState } from "react"

const IPFS_HASH = "https://gateway.pinata.cloud/ipfs/QmYDmg62hTnibmAvAeWkDgtvcbQtgNE2KHhJt2ci8UuW6d"

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
